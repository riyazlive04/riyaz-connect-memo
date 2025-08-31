
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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

    // Get authenticated user if Authorization header is present
    let user = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data } = await supabase.auth.getUser(token);
      user = data.user;
    }

    const { amount, credits, planName, sessionToken, authenticated } = await req.json();

    // Create Razorpay order
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error('Razorpay credentials not configured');
    }

    // Generate a shorter receipt ID to comply with Razorpay's 40 character limit
    const timestamp = Date.now().toString().slice(-8);
    const userIdentifier = user?.id?.slice(0, 8) || sessionToken?.slice(-8) || 'guest';
    const receipt = `ord_${userIdentifier}_${timestamp}`;

    const orderData = {
      amount: amount, // amount in paise
      currency: 'INR',
      receipt: receipt,
      notes: {
        user_id: user?.id || 'unauthenticated',
        credits: credits.toString(),
        plan_name: planName,
        session_token: sessionToken || ''
      }
    };

    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Razorpay API error:', errorData);
      throw new Error('Failed to create Razorpay order');
    }

    const order = await response.json();

    // Store order in database
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabaseService.from('payment_orders').insert({
      user_id: user?.id || null,
      razorpay_order_id: order.id,
      amount: amount,
      credits: credits,
      plan_name: planName,
      status: 'created',
      session_token: sessionToken || null
    });

    return new Response(JSON.stringify({
      order_id: order.id,
      amount: order.amount,
      key_id: razorpayKeyId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
