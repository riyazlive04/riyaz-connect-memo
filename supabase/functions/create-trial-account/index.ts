
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

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('User not authenticated');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data } = await supabase.auth.getUser(token);
    const user = data.user;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Use service role client for database operations
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if user already has credits record
    const { data: existingCredits } = await supabaseService
      .from('user_credits')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (existingCredits) {
      // User already has an account
      return new Response(JSON.stringify({ 
        error: 'User already has an account',
        hasAccount: true 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Calculate trial dates
    const trialStartDate = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(trialStartDate.getDate() + 14);

    // Create trial account with 5 free credits (default amount)
    const defaultTrialCredits = 5;
    await supabaseService
      .from('user_credits')
      .insert({
        user_id: user.id,
        credits: defaultTrialCredits,
        is_trial_user: true,
        trial_start_date: trialStartDate.toISOString(),
        trial_end_date: trialEndDate.toISOString(),
        trial_credits_used: 0
      });

    // Record the trial creation transaction
    await supabaseService
      .from('credit_transactions')
      .insert({
        user_id: user.id,
        credits: defaultTrialCredits,
        type: 'trial',
        description: `14-Day Free Trial - ${defaultTrialCredits} Credits`
      });

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Trial account created successfully',
      trialEndDate: trialEndDate.toISOString(),
      credits: defaultTrialCredits
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error creating trial account:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
