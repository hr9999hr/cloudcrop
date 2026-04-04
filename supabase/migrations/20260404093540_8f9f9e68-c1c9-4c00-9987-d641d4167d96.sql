
-- Trigger: prevent real_money from being increased via direct client UPDATE
-- Only server-side (service_role) can increase real_money
CREATE OR REPLACE FUNCTION public.validate_financial_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow service_role to do anything (edge functions use service_role)
  IF current_setting('request.jwt.claims', true)::jsonb->>'role' = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- Prevent real_money from increasing via client
  IF NEW.real_money > OLD.real_money THEN
    NEW.real_money := OLD.real_money;
  END IF;

  -- Prevent coins from increasing by more than 300 in a single update (max crop yield is 250)
  IF NEW.coins > OLD.coins + 300 THEN
    NEW.coins := OLD.coins;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_financial_update_trigger
  BEFORE UPDATE ON public.game_states
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_financial_update();
