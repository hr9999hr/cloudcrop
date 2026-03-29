
CREATE TABLE public.game_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  coins numeric NOT NULL DEFAULT 0,
  real_money numeric NOT NULL DEFAULT 50.00,
  water_drops integer NOT NULL DEFAULT 3,
  farmer_level integer NOT NULL DEFAULT 1,
  total_harvests integer NOT NULL DEFAULT 0,
  plants jsonb NOT NULL DEFAULT '[]'::jsonb,
  inventory jsonb NOT NULL DEFAULT '[]'::jsonb,
  transactions jsonb NOT NULL DEFAULT '[]'::jsonb,
  deliveries jsonb NOT NULL DEFAULT '[]'::jsonb,
  delivery_address text NOT NULL DEFAULT '',
  has_seen_welcome boolean NOT NULL DEFAULT false,
  daily_login_claimed boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.game_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own game state"
  ON public.game_states FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own game state"
  ON public.game_states FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own game state"
  ON public.game_states FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_game_states_updated_at
  BEFORE UPDATE ON public.game_states
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
