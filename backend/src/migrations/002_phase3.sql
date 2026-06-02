-- CodeCraft Phase 3 Migration
-- Adds sender_name and avatar columns to sim_messages for AI persona support

-- Add sender_name column for display names (e.g. "Kira Voss", "Maya Chen")
ALTER TABLE sim_messages
ADD COLUMN IF NOT EXISTS sender_name TEXT;

-- Add avatar column for persona icon identifier
ALTER TABLE sim_messages
ADD COLUMN IF NOT EXISTS avatar TEXT DEFAULT 'robot_2';

-- Index for faster channel queries
CREATE INDEX IF NOT EXISTS idx_sim_messages_channel_created
ON sim_messages(channel, created_at DESC);
