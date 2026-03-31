ALTER TABLE public.game_states 
  ADD COLUMN IF NOT EXISTS checkin_streak integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS checkin_last_date text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS completed_missions jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS completed_missions_date text DEFAULT NULL;