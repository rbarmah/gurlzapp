/*
  # Create Message Reactions System
  
  1. New Tables
    - message_reactions: Tracks user reactions to messages
      - id (uuid)
      - message_id (uuid, references chat_messages)
      - user_id (uuid, references auth.users)
      - reaction_type (text)
      - created_at (timestamp)
  
  2. Security
    - Enable RLS
    - Add policies for reaction management
*/

CREATE TABLE IF NOT EXISTS message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES chat_messages ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  reaction_type text NOT NULL CHECK (
    reaction_type IN ('like', 'heart', 'celebrate', 'support')
  ),
  created_at timestamptz DEFAULT now(),
  UNIQUE(message_id, user_id, reaction_type)
);

ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can add reactions"
  ON message_reactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own reactions"
  ON message_reactions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Reactions are viewable by everyone"
  ON message_reactions
  FOR SELECT
  USING (true);