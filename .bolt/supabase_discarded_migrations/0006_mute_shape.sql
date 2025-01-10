/*
  # Create Fashion Wishlist System
  
  1. New Tables
    - fashion_wishlist: Tracks saved fashion items
      - id (uuid)
      - user_id (uuid, references auth.users)
      - trend_id (uuid, references fashion_trends)
      - created_at (timestamp)
  
  2. Security
    - Enable RLS
    - Add policies for wishlist management
*/

CREATE TABLE IF NOT EXISTS fashion_wishlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  trend_id uuid REFERENCES fashion_trends ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, trend_id)
);

ALTER TABLE fashion_wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own wishlist"
  ON fashion_wishlist
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);