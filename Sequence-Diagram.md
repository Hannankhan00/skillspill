# SkillSpill Sequence Diagrams

This document contains Sequence Diagrams for the core interactions within the SkillSpill platform, demonstrating the step-by-step communication between the User, Frontend UI, Backend Web Server (Next.js Application), and the Database.

## 1. Talent Applies for a Bounty

This diagram illustrates the process when a Talent user discovers a Bounty and successfully submits an application.

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
    'fontFamily': 'arial',
    'sequenceNumberColor': '#000000'
  }
} }%%
sequenceDiagram
    autonumber
    actor Talent as Talent (User)
    participant UI as Next.js Frontend (UI)
    participant API as Server Action (Next.js)
    participant DB as Prisma (MySQL)

    Talent->>UI: Clicks "Apply" on Bounty Card
    activate UI
    UI->>UI: Render Application Modal
    Talent->>UI: Fills Cover Letter & Submit
    UI->>API: POST /api/bounty/apply (bountyId, coverLetter)
    activate API
    
    API->>API: Validate session & user role (Talent)
    
    API->>DB: Check if already applied (bountyId, talentProfileId)
    activate DB
    DB-->>API: Returns "Not Applied"
    deactivate DB
    
    API->>DB: Create BountyApplication (Status: PENDING)
    activate DB
    DB-->>API: Application Created (Success)
    deactivate DB
    
    API->>DB: Create Notification for Recruiter
    activate DB
    DB-->>API: Notification Created
    deactivate DB
    
    API-->>UI: Return Success Response (200 OK)
    deactivate API
    
    UI->>UI: Close Modal & Show Success Toast
    UI-->>Talent: Displays "Application Submitted"
    deactivate UI
```

## 2. Recruiter Posts a New Bounty

This diagram shows the sequence when a Recruiter publishes a new job/bounty to the platform.

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
    'fontFamily': 'arial',
    'sequenceNumberColor': '#000000'
  }
} }%%
sequenceDiagram
    autonumber
    actor Recruiter as Recruiter (User)
    participant UI as Next.js Frontend (UI)
    participant API as Server Action (Next.js)
    participant DB as Prisma (MySQL)

    Recruiter->>UI: Clicks "Create Bounty" Button
    activate UI
    UI->>UI: Render Bounty Creation Form
    Recruiter->>UI: Enters Title, Description, Reward, Skills
    Recruiter->>UI: Clicks "Publish"
    UI->>API: POST /api/bounty/create (payload)
    activate API
    
    API->>API: Validate session & user role (Recruiter)
    API->>API: Validate input schema (Zod)
    
    API->>DB: Begin Transaction Create Bounty (Status: OPEN)
    activate DB
    DB-->>API: Bounty Record Created
    
    API->>DB: Insert Required Skills (BountySkill)
    DB-->>API: Skills Linked
    
    DB-->>API: Commit Transaction Success
    deactivate DB
    
    API-->>UI: Return New Bounty Data (200 OK)
    deactivate API
    
    UI->>UI: Redirect to Bounty Details Page
    UI-->>Recruiter: Displays "Bounty Published!"
    deactivate UI
```

## 3. GitHub Profile Integration (Talent)

This sequence shows how the system fetches and verifies external data to update a Talent's profile.

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
    'fontFamily': 'arial',
    'sequenceNumberColor': '#000000'
  }
} }%%
sequenceDiagram
    autonumber
    actor Talent as Talent (User)
    participant UI as Next.js Frontend (UI)
    participant API as Server Action (Next.js)
    participant GitHub as External GitHub API
    participant DB as Prisma (MySQL)

    Talent->>UI: Enters GitHub Username & Clicks "Connect"
    activate UI
    UI->>API: POST /api/talent/github-sync (username)
    activate API
    
    API->>GitHub: GET /users/{username}/repos
    activate GitHub
    GitHub-->>API: Returns Repository Data (JSON)
    deactivate GitHub
    
    API->>API: Calculate Total Repos & Sum of Stars
    
    API->>DB: Update TalentProfile (githubConnected: True, stats)
    activate DB
    DB-->>API: Profile Updated
    deactivate DB
    
    API-->>UI: Return Updated Stats (200 OK)
    deactivate API
    
    UI->>UI: Update Dashboard UI with Stats
    UI-->>Talent: Show "GitHub Connected" Success
    deactivate UI
```
