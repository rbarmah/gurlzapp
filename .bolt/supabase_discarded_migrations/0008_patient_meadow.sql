/*
  # Create Chat Messages Table

  1. New Tables
    - chat_messages: Stores user chat messages
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - content (text)
      - topic (text)
      - anonymous (boolean)
      - anonymous_id (text)
      - likes_count (integer)
      - created_at (timestamp)

  2. Security
    - Enable RLS
    - Add policies for message access and management
*/

-- Create chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  content text NOT NULL,
  topic text NOT NULL,
  anonymous boolean DEFAULT false,
  anonymous_id text,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Messages are viewable by everyone" ON chat_messages;
  DROP POLICY IF EXISTS "Authenticated users can insert messages" ON chat_messages;
  DROP POLICY IF EXISTS "Users can update own messages" ON chat_messages;
END $$;

-- Create policies
CREATE POLICY "Messages are viewable by everyone"
  ON chat_messages
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert messages"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own messages"
  ON chat_messages
  FOR UPDATE
  USING (auth.uid() = user_id);