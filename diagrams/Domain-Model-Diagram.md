# SkillSpill Domain Model Diagram

High-level domain model verified against the Prisma schema. Optimised for **A4 landscape** printing.

> **Print tip**: Paste into [mermaid.live](https://mermaid.live) → **Print → Landscape → A4 → Scale to fit**.

## Diagram (Mermaid)

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#ffffff',
    'primaryTextColor': '#000000',
    'primaryBorderColor': '#000000',
    'lineColor': '#000000',
    'lineWidth': '4',
    'fontFamily': 'Arial, sans-serif',
    'fontSize': '13px'
  }
}}%%
classDiagram
    direction LR

    %% ── IDENTITY ─────────────────────────────────────
    class User {
        <<Aggregate Root>>
        Role role
        Boolean isActive
    }
    class Session
    class Follow
    class Notification {
        String type
        Boolean isRead
    }

    %% ── TALENT ───────────────────────────────────────
    class TalentProfile {
        <<Domain Entity>>
        ExperienceLevel level
        Boolean isAvailable
    }
    class TalentSkill {
        String skillName
    }
    class TalentProject {
        String title
    }
    class TalentWorkExperience {
        String companyName
    }
    class GithubRepository {
        Float finalScore
    }

    %% ── RECRUITER & BOUNTY ───────────────────────────
    class RecruiterProfile {
        <<Domain Entity>>
        String companyName
    }
    class RecruiterIndustry {
        String industryName
    }
    class Bounty {
        <<Aggregate Root>>
        BountyStatus status
        Decimal reward
    }
    class BountySkill {
        String skillName
    }
    class BountyApplication {
        ApplicationStatus status
    }
    class TalentBountyMatch {
        Float matchScore
    }

    %% ── SOCIAL ───────────────────────────────────────
    class SpillPost {
        <<Aggregate Root>>
        String postType
        String visibility
    }
    class SpillMedia {
        String mediaType
    }
    class SpillComment {
        String content
    }
    class SpillHashtag {
        String tag
        Int useCount
    }

    %% ── COMMS ────────────────────────────────────────
    class Conversation {
        <<Aggregate Root>>
        DateTime lastAt
    }
    class Message {
        Boolean isRead
    }

    %% ── MODERATION ───────────────────────────────────
    class Report {
        String targetType
        String status
    }
    class Appeal {
        AppealStatus status
    }

    %% ── SYSTEM STATUS ────────────────────────────────
    class StatusIncident {
        <<Aggregate Root>>
        String severity
        String status
    }
    class IncidentUpdate {
        String message
    }

    %% ── RELATIONSHIPS ────────────────────────────────

    User *-- Session : maintains
    User *-- TalentProfile : acts as
    User *-- RecruiterProfile : acts as
    User -- Follow : follows
    User *-- Notification : receives
    User *-- GithubRepository : owns
    User -- SpillPost : authors
    User -- Conversation : participates
    User -- Report : files
    User -- Appeal : submits

    TalentProfile *-- TalentSkill : has
    TalentProfile *-- TalentProject : showcases
    TalentProfile *-- TalentWorkExperience : records
    TalentProfile -- BountyApplication : submits
    TalentProfile -- TalentBountyMatch : matched

    RecruiterProfile *-- RecruiterIndustry : operates in
    RecruiterProfile -- Bounty : publishes

    Bounty *-- BountySkill : requires
    Bounty *-- BountyApplication : receives
    Bounty -- TalentBountyMatch : scored by

    SpillPost *-- SpillMedia : contains
    SpillPost *-- SpillComment : has
    SpillComment -- SpillComment : replies to
    SpillPost -- SpillHashtag : tagged

    Conversation *-- Message : contains

    StatusIncident *-- IncidentUpdate : logged by

    %% ── B&W PRINT STYLING ────────────────────────────

    style User fill:#ffffff,stroke:#000000,stroke-width:4px,color:#000000
    style Session fill:#ffffff,stroke:#000000,stroke-width:2px,color:#000000
    style Follow fill:#ffffff,stroke:#000000,stroke-width:2px,color:#000000
    style Notification fill:#ffffff,stroke:#000000,stroke-width:2px,color:#000000

    style TalentProfile fill:#f0f0f0,stroke:#000000,stroke-width:3px,color:#000000
    style TalentSkill fill:#f0f0f0,stroke:#000000,stroke-width:2px,color:#000000
    style TalentProject fill:#f0f0f0,stroke:#000000,stroke-width:2px,color:#000000
    style TalentWorkExperience fill:#f0f0f0,stroke:#000000,stroke-width:2px,color:#000000
    style GithubRepository fill:#f0f0f0,stroke:#000000,stroke-width:2px,color:#000000

    style RecruiterProfile fill:#d9d9d9,stroke:#000000,stroke-width:3px,color:#000000
    style RecruiterIndustry fill:#d9d9d9,stroke:#000000,stroke-width:2px,color:#000000
    style Bounty fill:#d9d9d9,stroke:#000000,stroke-width:4px,color:#000000
    style BountySkill fill:#d9d9d9,stroke:#000000,stroke-width:2px,color:#000000
    style BountyApplication fill:#d9d9d9,stroke:#000000,stroke-width:2px,color:#000000
    style TalentBountyMatch fill:#d9d9d9,stroke:#000000,stroke-width:2px,color:#000000

    style SpillPost fill:#bfbfbf,stroke:#000000,stroke-width:4px,color:#000000
    style SpillMedia fill:#bfbfbf,stroke:#000000,stroke-width:2px,color:#000000
    style SpillComment fill:#bfbfbf,stroke:#000000,stroke-width:2px,color:#000000
    style SpillHashtag fill:#bfbfbf,stroke:#000000,stroke-width:2px,color:#000000

    style Conversation fill:#ffffff,stroke:#000000,stroke-width:3px,color:#000000
    style Message fill:#ffffff,stroke:#000000,stroke-width:2px,color:#000000

    style Report fill:#a6a6a6,stroke:#000000,stroke-width:3px,color:#000000
    style Appeal fill:#a6a6a6,stroke:#000000,stroke-width:3px,color:#000000

    style StatusIncident fill:#ebebeb,stroke:#000000,stroke-width:3px,color:#000000
    style IncidentUpdate fill:#ebebeb,stroke:#000000,stroke-width:2px,color:#000000
```

---

## Legend

| Fill | Domain |
|---|---|
| White `#ffffff` | Identity — User, Session, Follow, Notification |
| Light grey `#f0f0f0` | Talent — TalentProfile, TalentSkill, TalentProject, WorkExperience, GithubRepo |
| Medium grey `#d9d9d9` | Recruiter & Bounty — RecruiterProfile, Industry, Bounty, BountySkill, Application, Match |
| Mid grey `#bfbfbf` | Social — SpillPost, SpillMedia, SpillComment, SpillHashtag |
| White `#ffffff` | Comms — Conversation, Message |
| Dark grey `#a6a6a6` | Moderation — Report, Appeal |
| Near-white `#ebebeb` | System Status — StatusIncident, IncidentUpdate |

> **Border**: **3px** = Aggregate Root · **2px** = Domain Entity · **1px** = Value Object
