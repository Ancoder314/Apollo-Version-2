/*
  # Initial Apollo Study App Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `name` (text)
      - `level` (integer, default 1)
      - `total_stars` (integer, default 0)
      - `current_streak` (integer, default 0)
      - `study_time` (integer, default 0) -- in minutes
      - `completed_lessons` (integer, default 0)
      - `weak_areas` (text array, default empty)
      - `strong_areas` (text array, default empty)
      - `learning_style` (text, default 'visual')
      - `study_goals` (text array, default empty)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `study_plans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `description` (text)
      - `duration` (integer) -- in days
      - `daily_time_commitment` (integer) -- in minutes
      - `difficulty` (text)
      - `subjects` (jsonb)
      - `milestones` (jsonb)
      - `adaptive_features` (jsonb)
      - `personalized_recommendations` (text array)
      - `estimated_outcome` (text)
      - `confidence` (integer) -- 0-100
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `study_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `subject` (text)
      - `topic` (text)
      - `duration` (integer) -- in minutes
      - `stars_earned` (integer)
      - `accuracy` (numeric)
      - `completed_at` (timestamp)
      - `session_data` (jsonb)

    - `daily_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `date` (date)
      - `study_time` (integer) -- in minutes
      - `lessons_completed` (integer)
      - `stars_earned` (integer)
      - `subjects_studied` (text array)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  name text NOT NULL,
  level integer DEFAULT 1,
  total_stars integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  study_time integer DEFAULT 0,
  completed_lessons integer DEFAULT 0,
  weak_areas text[] DEFAULT '{}',
  strong_areas text[] DEFAULT '{}',
  learning_style text DEFAULT 'visual',
  study_goals text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create study_plans table
CREATE TABLE IF NOT EXISTS study_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  duration integer NOT NULL,
  daily_time_commitment integer NOT NULL,
  difficulty text NOT NULL,
  subjects jsonb NOT NULL,
  milestones jsonb NOT NULL,
  adaptive_features jsonb NOT NULL,
  personalized_recommendations text[] DEFAULT '{}',
  estimated_outcome text NOT NULL,
  confidence integer NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create study_sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subject text NOT NULL,
  topic text NOT NULL,
  duration integer NOT NULL,
  stars_earned integer NOT NULL,
  accuracy numeric NOT NULL,
  completed_at timestamptz DEFAULT now(),
  session_data jsonb DEFAULT '{}'
);

-- Create daily_progress table
CREATE TABLE IF NOT EXISTS daily_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  study_time integer DEFAULT 0,
  lessons_completed integer DEFAULT 0,
  stars_earned integer DEFAULT 0,
  subjects_studied text[] DEFAULT '{}',
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for study_plans
CREATE POLICY "Users can read own study plans"
  ON study_plans
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study plans"
  ON study_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own study plans"
  ON study_plans
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own study plans"
  ON study_plans
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for study_sessions
CREATE POLICY "Users can read own study sessions"
  ON study_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study sessions"
  ON study_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policies for daily_progress
CREATE POLICY "Users can read own daily progress"
  ON daily_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily progress"
  ON daily_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily progress"
  ON daily_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_study_plans_user_id ON study_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_study_plans_active ON study_plans(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_completed_at ON study_sessions(user_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_daily_progress_user_date ON daily_progress(user_id, date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_plans_updated_at
  BEFORE UPDATE ON study_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();