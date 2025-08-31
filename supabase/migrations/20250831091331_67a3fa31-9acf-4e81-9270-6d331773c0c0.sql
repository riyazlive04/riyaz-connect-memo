
-- Remove overly permissive RLS policies and create secure ones

-- 1. Fix Payment Orders Table
DROP POLICY IF EXISTS "Edge functions can manage payment orders" ON public.payment_orders;

-- Create secure policy for users to view only their own payment orders
CREATE POLICY "Users can view their own payment orders" ON public.payment_orders
  FOR SELECT
  USING (user_id = auth.uid());

-- 2. Fix User Credits Table  
DROP POLICY IF EXISTS "Edge functions can manage user credits" ON public.user_credits;

-- Create secure policy for users to view only their own credits
CREATE POLICY "Users can view their own credits" ON public.user_credits
  FOR SELECT  
  USING (user_id = auth.uid());

-- 3. Fix Credit Transactions Table
DROP POLICY IF EXISTS "Edge functions can manage credit transactions" ON public.credit_transactions;

-- Create secure policy for users to view only their own transactions
CREATE POLICY "Users can view their own credit transactions" ON public.credit_transactions
  FOR SELECT
  USING (user_id = auth.uid());

-- 4. Fix Database Function Security
DROP FUNCTION IF EXISTS public.generate_string_id(text);
CREATE OR REPLACE FUNCTION public.generate_string_id(table_name text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER SET search_path = public
AS $function$
BEGIN
  RETURN table_name || '_' || extract(epoch from now())::bigint::text || '_' || floor(random() * 1000)::text;
END;
$function$;
