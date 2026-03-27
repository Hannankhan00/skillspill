-- ─────────────────────────────────────────────────────────────
-- SkillSpill — Performance Index Migration
-- Safe to re-run: all statements use IF NOT EXISTS
-- Run this directly on your MySQL database via phpMyAdmin or CLI
-- ─────────────────────────────────────────────────────────────

-- ─── spill_posts ───
-- NOTE: Prisma schema already defines these via @@index directives,
--       but included here for manual application on existing databases.
ALTER TABLE spill_posts ADD INDEX IF NOT EXISTS idx_user_id (user_id);
ALTER TABLE spill_posts ADD INDEX IF NOT EXISTS idx_created_at (created_at);
ALTER TABLE spill_posts ADD INDEX IF NOT EXISTS idx_post_type (post_type);
-- Composite index for the main feed query (WHERE status, visibility ORDER BY created_at)
ALTER TABLE spill_posts ADD INDEX IF NOT EXISTS idx_status_visibility_created (status, visibility, created_at);

-- ─── spill_likes ───
-- Composite (post_id, user_id) covers both lookup and uniqueness checks
ALTER TABLE spill_likes ADD INDEX IF NOT EXISTS idx_post_user (post_id, user_id);

-- ─── spill_comments ───
ALTER TABLE spill_comments ADD INDEX IF NOT EXISTS idx_post_id (post_id);
-- Composite for paginated comment loading (ORDER BY created_at per post)
ALTER TABLE spill_comments ADD INDEX IF NOT EXISTS idx_post_created (post_id, created_at);

-- ─── spill_saves ───
ALTER TABLE spill_saves ADD INDEX IF NOT EXISTS idx_user_post (user_id, post_id);

-- ─── spill_reposts ───
ALTER TABLE spill_reposts ADD INDEX IF NOT EXISTS idx_post_id (original_id);
ALTER TABLE spill_reposts ADD INDEX IF NOT EXISTS idx_user_id (user_id);

-- ─── spill_media ───
ALTER TABLE spill_media ADD INDEX IF NOT EXISTS idx_post_id (post_id);

-- ─── spill_hashtags ───
-- Covered by UNIQUE on tag; use_count index for popular hashtag queries
ALTER TABLE spill_hashtags ADD INDEX IF NOT EXISTS idx_use_count (use_count);

-- ─── users ───
ALTER TABLE users ADD INDEX IF NOT EXISTS idx_role (role);
ALTER TABLE users ADD INDEX IF NOT EXISTS idx_is_active (is_active);
-- Composite for talent/recruiter discovery queries
ALTER TABLE users ADD INDEX IF NOT EXISTS idx_role_active (role, is_active);

-- ─── sessions ───
ALTER TABLE sessions ADD INDEX IF NOT EXISTS idx_user_id (user_id);

-- ─── follows ───
ALTER TABLE follows ADD INDEX IF NOT EXISTS idx_follower_id (follower_id);
ALTER TABLE follows ADD INDEX IF NOT EXISTS idx_following_id (following_id);

-- ─── notifications ───
-- Composite for unread notification queries (WHERE user_id, is_read)
ALTER TABLE notifications ADD INDEX IF NOT EXISTS idx_user_isread (user_id, is_read);

-- ─── bounties ───
ALTER TABLE bounties ADD INDEX IF NOT EXISTS idx_recruiter_profile_id (recruiter_profile_id);
ALTER TABLE bounties ADD INDEX IF NOT EXISTS idx_status (status);

-- ─── bounty_applications ───
ALTER TABLE bounty_applications ADD INDEX IF NOT EXISTS idx_talent_profile_id (talent_profile_id);
ALTER TABLE bounty_applications ADD INDEX IF NOT EXISTS idx_status (status);

-- ─── conversations ───
ALTER TABLE conversations ADD INDEX IF NOT EXISTS idx_user_a_id (user_a_id);
ALTER TABLE conversations ADD INDEX IF NOT EXISTS idx_user_b_id (user_b_id);

-- ─── messages ───
ALTER TABLE messages ADD INDEX IF NOT EXISTS idx_conversation_id (conversation_id);
ALTER TABLE messages ADD INDEX IF NOT EXISTS idx_sender_id (sender_id);

-- ─── appeals ───
ALTER TABLE appeals ADD INDEX IF NOT EXISTS idx_user_id (user_id);
ALTER TABLE appeals ADD INDEX IF NOT EXISTS idx_status (status);

-- ─── talent_profiles ───
ALTER TABLE talent_profiles ADD INDEX IF NOT EXISTS idx_user_id (user_id);

-- ─── talent_skills ───
ALTER TABLE talent_skills ADD INDEX IF NOT EXISTS idx_skill_name (skill_name);

-- ─────────────────────────────────────────────────────────────
-- End of migration
-- ─────────────────────────────────────────────────────────────
