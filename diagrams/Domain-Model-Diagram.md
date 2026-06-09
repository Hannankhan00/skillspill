# SkillSpill Domain Model Diagram

This document presents the high-level Domain Model Diagram for the SkillSpill platform. Unlike a strict database schema or a technical UML diagram, this focuses on the core business domains, their primary attributes, and how they relate conceptually to each other.

## Diagram (Mermaid)

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#ffffff',
    'primaryTextColor': '#1e293b',
    'primaryBorderColor': '#e2e8f0',
    'lineColor': '#64748b',
    'fontFamily': 'inter, sans-serif'
  }
}}%%
classDiagram
    direction TB

    %% Base Entities (Identity Domain)
    class User {
        <<Aggregate Root>>
        String email
        Role role
        String fullName
        Boolean isActive
    }

    class Session {
        <<Value Object>>
        String token
        DateTime expiresAt
    }

    %% Talent Domain
    class TalentProfile {
        <<Domain Entity>>
        ExperienceLevel experience
        String bio
        Boolean githubConnected
        Boolean isAvailable
    }

    class TalentSkill {
        <<Value Object>>
        String skillName
        Boolean isVerified
    }

    %% Recruiter & Bounty Domain
    class RecruiterProfile {
        <<Domain Entity>>
        String companyName
        String companySize
    }

    class Bounty {
        <<Aggregate Root>>
        String title
        String description
        Decimal reward
        BountyStatus status
    }

    class BountyApplication {
        <<Domain Entity>>
        ApplicationStatus status
        String coverLetter
        DateTime appliedAt
    }

    %% Social Domain
    class SpillPost {
        <<Aggregate Root>>
        String postType
        String caption
        Int likesCount
    }

    class SpillComment {
        <<Domain Entity>>
        String content
        DateTime createdAt
    }

    %% Comms & Support Domain
    class Conversation {
        <<Aggregate Root>>
        DateTime lastActive
    }

    class Message {
        <<Domain Entity>>
        String content
        Boolean isRead
    }

    class Report {
        <<Domain Entity>>
        String reason
        String status
    }

    %% Structural Relationships
    User "1" *-- "0..*" Session : maintains
    User "1" *-- "0..1" TalentProfile : acts as
    User "1" *-- "0..1" RecruiterProfile : acts as
    
    TalentProfile "1" *-- "0..*" TalentSkill : possesses
    
    RecruiterProfile "1" -- "0..*" Bounty : publishes
    TalentProfile "1" -- "0..*" BountyApplication : submits
    Bounty "1" *-- "0..*" BountyApplication : receives

    User "1" -- "0..*" SpillPost : authors
    SpillPost "1" *-- "0..*" SpillComment : contains
    User "1" -- "0..*" SpillComment : writes

    User "2" -- "0..*" Conversation : participates in
    Conversation "1" *-- "0..*" Message : contains

    User "1" -- "0..*" Report : files

    %% Styling 
    style User fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e40af
    style Session fill:#eff6ff,stroke:#3b82f6,stroke-width:1px,color:#1e40af
    
    style TalentProfile fill:#f5f3ff,stroke:#8b5cf6,stroke-width:2px,color:#5b21b6
    style TalentSkill fill:#f5f3ff,stroke:#8b5cf6,stroke-width:1px,color:#5b21b6

    style RecruiterProfile fill:#fff1f2,stroke:#f43f5e,stroke-width:2px,color:#9f1239
    style Bounty fill:#fff1f2,stroke:#f43f5e,stroke-width:2px,color:#9f1239
    style BountyApplication fill:#fff1f2,stroke:#f43f5e,stroke-width:1px,color:#9f1239

    style SpillPost fill:#fefce8,stroke:#eab308,stroke-width:2px,color:#854d0e
    style SpillComment fill:#fefce8,stroke:#eab308,stroke-width:1px,color:#854d0e

    style Conversation fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534
    style Message fill:#f0fdf4,stroke:#22c55e,stroke-width:1px,color:#166534

    style Report fill:#f1f5f9,stroke:#64748b,stroke-width:2px,color:#334155
```

## Domain Explanations

1. **Identity Domain (Blue)**: Represents the core user authentication and session management. `User` is the central aggregate root that ties everything together.
2. **Talent Domain (Purple)**: Represents the candidate side of the platform, tracking skills, experience, and availability.
3. **Recruiter & Job Domain (Pink)**: Tracks the employers (`RecruiterProfile`) and the jobs/challenges they post (`Bounty`). It also handles the link between a Talent and a Job (`BountyApplication`).
4. **Social Domain (Yellow)**: Encompasses the "Spill" feed, allowing users to create posts and comment on them.
5. **Comms Domain (Green)**: Handles private direct messaging between users.
6. **Support Domain (Gray)**: Handles moderation elements like reports and appeals.
