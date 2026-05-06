# SkillSpill Use Case Diagram

This document presents a comprehensive, A4-optimized use case diagram for the **SkillSpill** platform. It has been generated based on the actual system schema to map out all core actors and their interactions with the system modules.

## Diagram (Mermaid)

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#ffffff',
    'primaryTextColor': '#1e293b',
    'primaryBorderColor': '#e2e8f0',
    'lineColor': '#64748b',
    'clusterBkg': '#f8fafc',
    'clusterBorder': '#cbd5e1'
  }
}}%%
flowchart LR
    %% Custom Premium Styles
    classDef actor fill:#2563eb,stroke:#1d4ed8,stroke-width:2px,color:#ffffff,font-size:16px,font-weight:bold,rx:8px,ry:8px
    classDef usecase fill:#ffffff,stroke:#8b5cf6,stroke-width:2px,color:#4c1d95,font-size:14px,font-weight:600,rx:20px,ry:20px
    classDef system fill:#ffffff,stroke:#94a3b8,stroke-width:2px,stroke-dasharray: 5 5,color:#334155,font-size:18px,font-weight:bold,rx:15px,ry:15px
    classDef module fill:#f1f5f9,stroke:#cbd5e1,stroke-width:1px,color:#475569,font-size:14px,font-weight:bold,rx:10px,ry:10px
    
    %% Actors with FontAwesome Icons
    Guest(["fa:fa-user-secret Guest"]):::actor
    Talent(["fa:fa-user-astronaut Talent"]):::actor
    Recruiter(["fa:fa-user-tie Recruiter"]):::actor
    Admin(["fa:fa-user-shield Admin"]):::actor

    %% System Boundary
    subgraph System ["✨ SkillSpill Platform Boundary ✨"]
        direction TB
        
        subgraph Auth ["🔐 Identity & Access"]
            direction TB
            UC_Login(["fa:fa-sign-in-alt Sign Up / Login"]):::usecase
        end
        
        subgraph Profiles ["👤 Profile Management"]
            direction TB
            UC_TProfile(["fa:fa-id-card Manage Talent Profile"]):::usecase
            UC_GitHub(["fa:fa-github Sync GitHub Stats"]):::usecase
            UC_RProfile(["fa:fa-building Manage Recruiter Profile"]):::usecase
        end
        
        subgraph Bounties ["🎯 Bounties (Job Board)"]
            direction TB
            UC_PostB(["fa:fa-plus-circle Post & Manage Bounties"]):::usecase
            UC_ReviewB(["fa:fa-clipboard-check Review Applications"]):::usecase
            UC_BrowseB(["fa:fa-search Browse Bounties"]):::usecase
            UC_ApplyB(["fa:fa-paper-plane Apply for Bounty"]):::usecase
        end

        subgraph Social ["💬 Social & Comms"]
            direction TB
            UC_Post(["fa:fa-pen Create Spill Post"]):::usecase
            UC_Engage(["fa:fa-heart Engage (Like/Comment)"]):::usecase
            UC_Follow(["fa:fa-users Follow Users"]):::usecase
            UC_Message(["fa:fa-envelope Send Direct Messages"]):::usecase
        end

        subgraph Mod ["🛡️ Moderation & Support"]
            direction TB
            UC_Report(["fa:fa-flag Report Users/Content"]):::usecase
            UC_Appeal(["fa:fa-balance-scale Submit Appeal"]):::usecase
            UC_Moderate(["fa:fa-gavel Moderate Platform"]):::usecase
            UC_ReviewAppeals(["fa:fa-check-circle Review Appeals"]):::usecase
        end
    end
    
    class System system
    class Auth,Profiles,Bounties,Social,Mod module

    %% Connections
    Guest --> UC_Login
    Guest --> UC_BrowseB

    Talent --> UC_Login
    Talent --> UC_TProfile
    Talent --> UC_GitHub
    Talent --> UC_BrowseB
    Talent --> UC_ApplyB
    Talent --> UC_Post
    Talent --> UC_Engage
    Talent --> UC_Follow
    Talent --> UC_Message
    Talent --> UC_Report
    Talent --> UC_Appeal

    Recruiter --> UC_Login
    Recruiter --> UC_RProfile
    Recruiter --> UC_PostB
    Recruiter --> UC_ReviewB
    Recruiter --> UC_BrowseB
    Recruiter --> UC_Post
    Recruiter --> UC_Engage
    Recruiter --> UC_Follow
    Recruiter --> UC_Message
    Recruiter --> UC_Report
    Recruiter --> UC_Appeal

    %% Admin flows reversed to appear nicely on the right
    UC_Login <-- Admin
    UC_Moderate <-- Admin
    UC_ReviewAppeals <-- Admin
```

## Detailed Use Case Descriptions

### 1. Identity & Access
*   **Sign Up / Log In**: Users authenticate into the system. Flow branches out to Talent, Recruiter, or Admin based on role. Guest users can access limited read-only areas.

### 2. Profile Management
*   **Manage Talent Profile**: Talents update their resume, biography, portfolio URLs, and experience levels.
*   **Sync GitHub Stats**: Talents link their GitHub accounts to display repositories and star counts directly on their profile.
*   **Manage Recruiter Profile**: Recruiters update their company details, industry type, and contact information.

### 3. Bounties (Job Board)
*   **Post & Manage Bounties**: Recruiters create new job postings/bounties, define rewards, set requirements, and update their statuses.
*   **Review Applications**: Recruiters evaluate incoming applications from Talents, moving them through states like Pending, Reviewed, Shortlisted, Rejected, or Accepted.
*   **Browse & Search Bounties**: Guests, Talents, and Recruiters browse active bounties.
*   **Apply for Bounty**: Talents submit their cover letters and links to fulfill bounty requirements.

### 4. Social (Spill Feed) & Comms
*   **Create Spill Post**: Users create text, media, code snippet, or hiring posts.
*   **Engage (Like, Comment, Repost, Save)**: Users interact with content on the feed.
*   **Follow Users**: Users subscribe to content from other Talents or Recruiters.
*   **Send Direct Messages**: 1-on-1 private messaging and attachment sharing between users.

### 5. Moderation & Support
*   **Report Users/Content**: Users report malicious behavior or posts.
*   **Submit Suspension Appeal**: Banned or suspended users can submit a formal appeal for review.
*   **Moderate Platform**: Admins review reports, monitor platform activity, and suspend violators.
*   **Review Appeals**: Admins process incoming appeals and can restore accounts.
