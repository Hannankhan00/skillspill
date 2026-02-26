# SkillSpill Entity-Relationship (ER) Diagram

This document presents the Entity-Relationship (ER) Diagram based on the SkillSpill Prisma database model. It describes the entities in the database and their relational links.

## Diagram (Mermaid)

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#ffffff',
    'primaryTextColor': '#000000',
    'primaryBorderColor': '#000000',
    'lineColor': '#000000',
    'secondaryColor': '#ffffff',
    'tertiaryColor': '#ffffff',
    'nodeBorder': '#000000',
    'mainBkg': '#ffffff',
    'fontFamily': 'arial'
  }
} }%%
erDiagram
    users {
        String id PK
        String email UK
        String username UK
        String passwordHash
        Role role
        String fullName
        Boolean emailVerified
        Boolean isActive
    }

    sessions {
        String id PK
        String userId FK
        String token UK
        DateTime expiresAt
    }

    talent_profiles {
        String id PK
        String userId FK
        ExperienceLevel experienceLevel
        Boolean githubConnected
        Int githubRepos
        Int githubStars
    }

    talent_skills {
        String id PK
        String talentProfileId FK
        String skillName
        Boolean isVerified
    }

    talent_projects {
        String id PK
        String talentProfileId FK
        String url
        String title
    }

    recruiter_profiles {
        String id PK
        String userId FK
        String companyName
        String jobTitle
    }

    recruiter_industries {
        String id PK
        String recruiterProfileId FK
        String industryName
    }

    bounties {
        String id PK
        String recruiterProfileId FK
        String title
        BountyStatus status
        Decimal reward
        Boolean isRemote
        DateTime deadline
    }

    bounty_skills {
        String id PK
        String bountyId FK
        String skillName
    }

    bounty_applications {
        String id PK
        String bountyId FK
        String talentProfileId FK
        ApplicationStatus status
        DateTime appliedAt
    }

    notifications {
        String id PK
        String userId FK
        String title
        String type
        Boolean isRead
    }

    appeals {
        String id PK
        String userId FK
        String reason
        AppealStatus status
    }

    %% Relationships
    users ||--o{ sessions : "has"
    users ||--o| talent_profiles : "has"
    users ||--o| recruiter_profiles : "has"
    users ||--o{ notifications : "receives"
    users ||--o{ appeals : "creates"
    
    talent_profiles ||--o{ talent_skills : "has skill"
    talent_profiles ||--o{ talent_projects : "showcases"
    talent_profiles ||--o{ bounty_applications : "makes"
    
    recruiter_profiles ||--o{ recruiter_industries : "operates in"
    recruiter_profiles ||--o{ bounties : "posts"
    
    bounties ||--o{ bounty_skills : "requires"
    bounties ||--o{ bounty_applications : "receives"
```
