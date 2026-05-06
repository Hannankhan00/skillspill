-- ─────────────────────────────────────────────────────────────
-- SkillSpill — GitHub Scoring Migration
-- Adds githubScore / scoreLastUpdated to talent_profiles and
-- creates the github_repositories table for per-repo scoring.
-- Safe to re-run: uses ADD COLUMN IF NOT EXISTS / CREATE TABLE IF NOT EXISTS
-- Run this directly on your MySQL database via phpMyAdmin or CLI
-- ─────────────────────────────────────────────────────────────

-- ─── talent_profiles: GitHub scoring columns ───
ALTER TABLE talent_profiles
  ADD COLUMN IF NOT EXISTS githubScore      FLOAT     NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS scoreLastUpdated TIMESTAMP NULL;

-- ─── github_repositories: scored repos per talent ───
CREATE TABLE IF NOT EXISTS github_repositories (
  id              INT            NOT NULL AUTO_INCREMENT,
  userId          VARCHAR(191)   NOT NULL,
  repoName        VARCHAR(255)   NOT NULL,
  repoUrl         VARCHAR(500)   NOT NULL,
  repoType        VARCHAR(50)    NULL,
  primaryLanguage VARCHAR(100)   NULL,
  metadataScore   FLOAT          NOT NULL DEFAULT 0,
  structureScore  FLOAT          NOT NULL DEFAULT 0,
  aiScore         FLOAT          NOT NULL DEFAULT 0,
  finalScore      FLOAT          NOT NULL DEFAULT 0,
  isTopRepo       BOOLEAN        NOT NULL DEFAULT FALSE,
  scoreBreakdown  JSON           NULL,
  pushedAt        TIMESTAMP      NULL,
  scoredAt        TIMESTAMP      NULL,
  createdAt       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_userId (userId),

  CONSTRAINT fk_github_repos_user
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
-- End of migration
-- ─────────────────────────────────────────────────────────────
