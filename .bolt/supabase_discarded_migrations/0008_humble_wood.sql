/*
  # Create User Profiles Table
  
  1. New Tables
    - profiles: Stores user profile information
      - id (uuid, references auth.users)
      - username (text, unique)
      - gender (text)
      - country (text) 
      - phone_number (text)
      - user_type (text)
      - created_at (timestamp)
      - updated_at (timestamp)
  
  2. Security
    - Enable RLS
    - Add policies for profile access
*/

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  gender text CHECK (gender IN ('female', 'male')) NOT NULL,
  country text NOT NULL,
  phone_number text,
  user_type text CHECK (user_type IN ('individual', 'organization', 'vendor')) NOT NULL DEFAULT 'individual',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
END $$;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);