-- Remove the remaining overly permissive policies that allow public access

-- Fix Payment Orders - Remove the permissive edge function policy
DROP POLICY IF EXISTS "Edge functions can manage payment orders" ON public.payment_orders;

-- Fix Credit Transactions - Remove the permissive edge function policy  
DROP POLICY IF EXISTS "Edge functions can manage credit transactions" ON public.credit_transactions;

-- Fix User Credits - Remove the permissive edge function policy
DROP POLICY IF EXISTS "Edge functions can manage user credits" ON public.user_credits;