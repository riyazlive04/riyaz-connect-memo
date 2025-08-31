
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createHmac } from "https://deno.land/std@0.190.0/crypto/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      credits,
      planName,
      userId 
    } = await req.json();

    let user = null;
    
    // Get user either from auth header or from userId (for post-login processing)
    if (userId) {
      user = { id: userId };
    } else {
      const authHeader = req.headers.get('Authorization');
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        const { data } = await supabase.auth.getUser(token);
        user = data.user;
      }
    }

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Verify signature
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    if (!razorpayKeySecret) {
      throw new Error('Razorpay secret not configured');
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = await createHmac("sha256", new TextEncoder().encode(razorpayKeySecret))
      .update(new TextEncoder().encode(body))
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new Error('Payment verification failed');
    }

    // Use service role client for database operations
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Update payment order status and associate with user if needed
    await supabaseService
      .from('payment_orders')
      .update({
        user_id: user.id,
        status: 'completed',
        razorpay_payment_id: razorpay_payment_id,
        completed_at: new Date().toISOString()
      })
      .eq('razorpay_order_id', razorpay_order_id);

    // Add credits to user
    const { data: existingCredits } = await supabaseService
      .from('user_credits')
      .select('credits')
      .eq('user_id', user.id)
      .single();

    if (existingCredits) {
      // Update existing credits
      await supabaseService
        .from('user_credits')
        .update({
          credits: existingCredits.credits + credits,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
    } else {
      // Create new credits record
      await supabaseService
        .from('user_credits')
        .insert({
          user_id: user.id,
          credits: credits
        });
    }

    // Record credit transaction
    await supabaseService
      .from('credit_transactions')
      .insert({
        user_id: user.id,
        credits: credits,
        type: 'purchase',
        description: `${planName} Plan Purchase`,
        razorpay_payment_id: razorpay_payment_id
      });

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Payment verified and credits added' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
