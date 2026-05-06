-- ──────────────────────────────────────────────────────────────
-- SkillSpill — Semantic Matching Migration
-- Creates the talent_bounty_matches table.
-- Safe to re-run: uses CREATE TABLE IF NOT EXISTS
-- Run directly on MySQL via phpMyAdmin or CLI
-- ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `talent_bounty_matches` (
  `id`                VARCHAR(191)   NOT NULL,
  `bountyId`          VARCHAR(191)   NOT NULL,
  `talentProfileId`   VARCHAR(191)   NOT NULL,

  `matchScore`        DOUBLE         NOT NULL,
  `skillOverlapScore` DOUBLE         NOT NULL,
  `semanticScore`     DOUBLE         NOT NULL,
  `bonusScore`        DOUBLE         NOT NULL,

  `computedAt`        DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`         DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),

  UNIQUE KEY `tbm_bounty_talent_unique`  (`bountyId`, `talentProfileId`),
  INDEX `tbm_bountyId_idx`               (`bountyId`),
  INDEX `tbm_talentProfileId_idx`        (`talentProfileId`),
  INDEX `tbm_matchScore_idx`             (`matchScore`),

  CONSTRAINT `tbm_bountyId_fkey`
    FOREIGN KEY (`bountyId`)
    REFERENCES `bounties` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT `tbm_talentProfileId_fkey`
    FOREIGN KEY (`talentProfileId`)
    REFERENCES `talent_profiles` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────
-- End of migration
-- ──────────────────────────────────────────────────────────────
