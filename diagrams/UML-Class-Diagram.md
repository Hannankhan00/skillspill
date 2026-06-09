# SkillSpill UML Class Diagram

This document presents the UML Class Diagram for the SkillSpill platform, outlining the core entities, their attributes, and their architectural relationships in a clean format to match the project aesthetics.

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
classDiagram
    direction TB
    
    class User {
        +String id
        +String email
        +String? username
        +Role role
        +String fullName
        +Boolean emailVerified
        +Boolean isActive
        +DateTime createdAt
    }

    class Session {
        +String id
        +String token
        +DateTime expiresAt
        +String? ipAddress
    }

    class TalentProfile {
        +String id
        +ExperienceLevel? experienceLevel
        +String? bio
        +Boolean githubConnected
        +Int githubRepos
        +Int githubStars
        +Boolean isAvailable
    }

    class TalentSkill {
        +String id
        +String skillName
        +Boolean isVerified
    }

    class TalentProject {
        +String id
        +String url
        +String? title
    }

    class RecruiterProfile {
        +String id
        +String? jobTitle
        +String companyName
        +String? location
    }

    class RecruiterIndustry {
        +String id
        +String industryName
    }

    class Bounty {
        +String id
        +String title
        +BountyStatus status
        +Decimal? reward
        +Boolean isRemote
        +DateTime? deadline
    }

    class BountySkill {
        +String id
        +String skillName
    }

    class BountyApplication {
        +String id
        +ApplicationStatus status
        +DateTime appliedAt
        +String? coverLetter
    }

    class Notification {
        +String id
        +String title
        +String type
        +Boolean isRead
        +DateTime createdAt
    }

    class Appeal {
        +String id
        +String reason
        +AppealStatus status
        +DateTime createdAt
    }

    %% Relationships
    User "1" *-- "0..*" Session : has
    User "1" *-- "0..1" TalentProfile : has
    User "1" *-- "0..1" RecruiterProfile : has
    User "1" *-- "0..*" Notification : receives
    User "1" *-- "0..*" Appeal : makes
    
    TalentProfile "1" *-- "0..*" TalentSkill : possesses
    TalentProfile "1" *-- "0..*" TalentProject : showcases
    TalentProfile "1" -- "0..*" BountyApplication : submits
    
    RecruiterProfile "1" *-- "0..*" RecruiterIndustry : operates in
    RecruiterProfile "1" -- "0..*" Bounty : posts
    
    Bounty "1" *-- "0..*" BountySkill : requires
    Bounty "1" -- "0..*" BountyApplication : receives
```

## Entity Descriptions

### 1. Core Authentication & Users
* **User:** The central entity that handles authentication and base authorization (Talent, Recruiter, Admin). It links to every notification, session, or specific profile.
* **Session:** Handles tracking logged-in states globally. 

### 2. Talent Entities
* **TalentProfile:** Holds specific properties for users acting as developers and candidates (e.g., GitHub stats, experience level, availability).
* **TalentSkill:** Links specific granular skills verified onto the talent's profile.
* **TalentProject:** Showcases the talent's past portfolio projects.

### 3. Recruiter Entities
* **RecruiterProfile:** Holds employer-level properties for users who create job postings (Bounties).
* **RecruiterIndustry:** Represents sectors or fields that the recruiter operates within.

### 4. Bounties (Jobs)
* **Bounty:** Represents job postings, issues, or projects posted by recruiters. Tracks statuses such as OPEN or COMPLETED.
* **BountySkill:** The required skills specified by a recruiter for a particular Bounty.
* **BountyApplication:** The junction entity linking a Talent to a Bounty, retaining cover letters, statuses (PENDING, ACCEPTED), and timestamps.

### 5. Administration
* **Notification:** Direct system notices sent to users.
* **Appeal:** Security/Banning mechanism handling system appeals for suspensions.
