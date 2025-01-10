/*
  # Create Fashion Trends System
  
  1. New Tables
    - fashion_trends: Stores fashion posts and trends
      - id (uuid)
      - user_id (uuid, references auth.users)
      - images (text array)
      - description (text)
      - tags (text array)
      - likes_count (integer)
      - price (decimal, for vendors)
      - created_at (timestamp)
  
  2. Security
    - Enable RLS
    - Add policies for trend management
*/

CREATE TABLE IF NOT EXISTS fashion_trends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  images text[] NOT NULL,
  description text NOT NULL,
  tags text[],
  likes_count integer DEFAULT 0,
  price decimal(10,2),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE fashion_trends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trends are viewable by everyone"
  ON fashion_trends
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create trends"
  ON fashion_trends
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trends"
  ON fashion_trends
  FOR UPDATE
  USING (auth.uid() = user_id);