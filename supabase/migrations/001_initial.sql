-- ─── Profiles ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  mmr INTEGER DEFAULT 1000 CHECK (mmr >= 0),
  rank TEXT DEFAULT 'scholar',
  streak INTEGER DEFAULT 0 CHECK (streak >= 0),
  max_streak INTEGER DEFAULT 0 CHECK (max_streak >= 0),
  last_active DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── Quiz Attempts ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  topic TEXT NOT NULL,
  question_id TEXT NOT NULL,
  correct BOOLEAN NOT NULL,
  mmr_before INTEGER,
  mmr_after INTEGER,
  mmr_delta INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own attempts" ON quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own attempts" ON quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─── Flashcard Progress ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS flashcard_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  card_id TEXT NOT NULL,
  ease_factor FLOAT DEFAULT 2.5 CHECK (ease_factor >= 1.3),
  interval INTEGER DEFAULT 1 CHECK (interval >= 1),
  next_review DATE DEFAULT CURRENT_DATE,
  repetitions INTEGER DEFAULT 0 CHECK (repetitions >= 0),
  UNIQUE(user_id, card_id)
);

ALTER TABLE flashcard_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own flashcard progress" ON flashcard_progress
  FOR ALL USING (auth.uid() = user_id);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_profiles_mmr ON profiles(mmr DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_created_at ON quiz_attempts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_flashcard_progress_user_next ON flashcard_progress(user_id, next_review);
