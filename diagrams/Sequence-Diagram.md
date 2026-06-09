# SkillSpill Sequence Diagrams

This document contains beautifully designed Sequence Diagrams for the core interactions within the SkillSpill platform, demonstrating the step-by-step communication between the User, Client-Side (React UI), Server-Side (Next.js Actions), and Database (Prisma).

## 1. Talent Applies for a Bounty

This diagram illustrates the process when a Talent user discovers a Bounty and successfully submits an application.

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#eff6ff',
    'primaryTextColor': '#1e293b',
    'primaryBorderColor': '#3b82f6',
    'lineColor': '#64748b',
    'actorBkg': '#2563eb',
    'actorTextColor': '#ffffff',
    'actorBorder': '#1d4ed8',
    'sequenceNumberColor': '#ffffff'
  }
}}%%
sequenceDiagram
    autonumber
    
    box rgb(248, 250, 252) Client-Side (Browser)
        actor Talent as 👨‍🚀 Talent
        participant UI as Next.js UI (Client)
    end
    
    box rgb(245, 243, 255) Server-Side
        participant API as Bounty Actions (Server)
    end
    
    box rgb(240, 253, 244) Data Access
        participant DB as Prisma (MySQL)
    end

    Talent->>UI: Clicks "Apply" on Bounty Card
    activate UI
    UI->>UI: Renders Application Modal
    Talent->>UI: Fills Cover Letter & Submits
    
    UI->>API: Server Action: applyToBounty(bountyId, data)
    activate API
    
    API->>API: Verify Session & Role (Talent)
    API->>API: Validate Input Schema (Zod)
    
    API->>DB: Check if already applied (findFirst)
    activate DB
    DB-->>API: Returns null (Not applied)
    deactivate DB
    
    API->>DB: create(BountyApplication { status: PENDING })
    activate DB
    DB-->>API: Application Created
    
    API->>DB: create(Notification for Recruiter)
    DB-->>API: Notification Created
    deactivate DB
    
    API-->>UI: Return Success ({ status: 200 })
    deactivate API
    
    UI->>UI: Closes Modal
    UI-->>Talent: Displays "Application Submitted" Toast 🎉
    deactivate UI
```

## 2. Recruiter Posts a New Bounty

This diagram shows the sequence when a Recruiter publishes a new job/bounty to the platform.

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#fff1f2',
    'primaryTextColor': '#1e293b',
    'primaryBorderColor': '#f43f5e',
    'lineColor': '#64748b',
    'actorBkg': '#e11d48',
    'actorTextColor': '#ffffff',
    'actorBorder': '#9f1239',
    'sequenceNumberColor': '#ffffff'
  }
}}%%
sequenceDiagram
    autonumber
    
    box rgb(248, 250, 252) Client-Side (Browser)
        actor Recruiter as 👔 Recruiter
        participant UI as Next.js UI (Client)
    end
    
    box rgb(245, 243, 255) Server-Side
        participant API as Bounty Actions (Server)
    end
    
    box rgb(240, 253, 244) Data Access
        participant DB as Prisma (MySQL)
    end

    Recruiter->>UI: Clicks "Create Bounty" Button
    activate UI
    UI->>UI: Renders Bounty Form
    Recruiter->>UI: Enters Details & Clicks "Publish"
    
    UI->>API: Server Action: createBounty(payload)
    activate API
    
    API->>API: Verify Session & Role (Recruiter)
    API->>API: Validate Schema (Zod)
    
    API->>DB: Transaction: create(Bounty { status: OPEN })
    activate DB
    DB-->>API: Bounty Record Created
    
    API->>DB: Transaction: insert(BountySkills)
    DB-->>API: Skills Linked
    deactivate DB
    
    API-->>UI: Return New Bounty Data ({ status: 200 })
    deactivate API
    
    UI->>UI: Redirects to Bounty Details
    UI-->>Recruiter: Displays "Bounty Published!" Toast ✅
    deactivate UI
```

## 3. GitHub Profile Integration (Talent)

This sequence shows how the system fetches and verifies external data to update a Talent's profile.

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#eff6ff',
    'primaryTextColor': '#1e293b',
    'primaryBorderColor': '#3b82f6',
    'lineColor': '#64748b',
    'actorBkg': '#2563eb',
    'actorTextColor': '#ffffff',
    'actorBorder': '#1d4ed8',
    'sequenceNumberColor': '#ffffff'
  }
}}%%
sequenceDiagram
    autonumber
    
    box rgb(248, 250, 252) Client-Side
        actor Talent as 👨‍🚀 Talent
        participant UI as Next.js UI
    end
    
    box rgb(245, 243, 255) Server-Side
        participant API as Profile Actions
    end
    
    box rgb(254, 252, 232) External Service
        participant GitHub as GitHub API
    end
    
    box rgb(240, 253, 244) Data Access
        participant DB as Prisma (MySQL)
    end

    Talent->>UI: Enters Username & Clicks "Sync"
    activate UI
    
    UI->>API: Server Action: syncGitHub(username)
    activate API
    
    API->>GitHub: GET /users/{username}/repos
    activate GitHub
    GitHub-->>API: Returns Repository JSON
    deactivate GitHub
    
    API->>API: Calculate Repos & Stars Sum
    
    API->>DB: update(TalentProfile { githubConnected: true })
    activate DB
    DB-->>API: Profile Updated
    deactivate DB
    
    API-->>UI: Return Updated Stats
    deactivate API
    
    UI->>UI: Revalidates Path / Refreshes UI
    UI-->>Talent: Shows "GitHub Synced" Success 🚀
    deactivate UI
```

## 4. Admin Reviews a Suspension Appeal

This diagram outlines the process when an Administrator reviews an appeal submitted by a suspended user and decides to restore their account.

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#f8fafc',
    'primaryTextColor': '#0f172a',
    'primaryBorderColor': '#475569',
    'lineColor': '#475569',
    'actorBkg': '#334155',
    'actorTextColor': '#ffffff',
    'actorBorder': '#0f172a',
    'sequenceNumberColor': '#ffffff'
  }
}}%%
sequenceDiagram
    autonumber
    
    box rgb(248, 250, 252) Client-Side (Browser)
        actor Admin as 🛡️ Admin
        participant UI as Next.js UI (Client)
    end
    
    box rgb(245, 243, 255) Server-Side
        participant API as Admin Actions (Server)
    end
    
    box rgb(240, 253, 244) Data Access
        participant DB as Prisma (MySQL)
    end

    Admin->>UI: Clicks "Approve" on Pending Appeal
    activate UI
    UI->>UI: Prompts for Confirmation & Notes
    Admin->>UI: Enters Admin Notes & Confirms
    
    UI->>API: Server Action: resolveAppeal(appealId, 'APPROVED', notes)
    activate API
    
    %% Strict Security Check
    API->>API: Verify Session & Role (MUST BE ADMIN)
    API->>API: Validate Schema (Zod)
    
    %% Database Transaction
    API->>DB: Transaction: update(Appeal { status: APPROVED })
    activate DB
    DB-->>API: Appeal Updated
    
    API->>DB: Transaction: update(User { isActive: true })
    DB-->>API: User Account Restored
    
    API->>DB: Transaction: create(Notification for User)
    DB-->>API: Notification Created
    deactivate DB
    
    API-->>UI: Return Success ({ status: 200 })
    deactivate API
    
    UI->>UI: Removes Appeal from UI List
    UI-->>Admin: Displays "User Account Restored" Toast ✅
    deactivate UI
```
