# SkillSpill Site Map Diagram

This document presents the **Site Map** for the SkillSpill platform. 

It illustrates the structural hierarchy and routing of the application's Next.js pages, demonstrating how different modules (Public, Talent, Recruiter, Admin, and Shared) are organized.

## Site Map Hierarchy

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
flowchart TD
    %% Custom Premium Styling
    classDef root fill:#0f172a,stroke:#000000,stroke-width:3px,color:#ffffff,font-weight:bold,font-size:18px,rx:15px,ry:15px
    classDef public fill:#f1f5f9,stroke:#94a3b8,stroke-width:2px,color:#334155,font-weight:bold,rx:5px,ry:5px
    classDef talent fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e40af,font-weight:bold,rx:5px,ry:5px
    classDef recruiter fill:#fff1f2,stroke:#f43f5e,stroke-width:2px,color:#9f1239,font-weight:bold,rx:5px,ry:5px
    classDef admin fill:#334155,stroke:#0f172a,stroke-width:2px,color:#ffffff,font-weight:bold,rx:5px,ry:5px
    classDef shared fill:#fefce8,stroke:#eab308,stroke-width:2px,color:#854d0e,font-weight:bold,rx:5px,ry:5px

    Root(("🌍 SkillSpill Application")) :::root

    %% Top Level Sections
    Pub["Public / Auth Pages"] :::public
    Tal["👨‍🚀 Talent Module"] :::talent
    Rec["👔 Recruiter Module"] :::recruiter
    Adm["🛡️ Admin Module"] :::admin
    Sha["💬 Shared / Social"] :::shared

    Root --> Pub
    Root --> Tal
    Root --> Rec
    Root --> Adm
    Root --> Sha

    %% Public Pages
    Pub --> Home["/ (Landing Page)"] :::public
    Pub --> Login["/login"] :::public
    Pub --> Signup["/signup"] :::public
    Pub --> Susp["/suspended"] :::public

    %% Talent Pages
    Tal --> TDash["/dashboard (Talent)"] :::talent
    Tal --> TProfile["/talent/profile"] :::talent
    Tal --> TJobs["/talent/jobs (Browse)"] :::talent
    Tal --> TApps["/talent/applications"] :::talent

    %% Recruiter Pages
    Rec --> RDash["/recruiter (Dashboard)"] :::recruiter
    Rec --> RJobs["/recruiter/jobs (Post & Manage)"] :::recruiter
    Rec --> RApps["/recruiter/applications"] :::recruiter
    Rec --> RSearch["/recruiter/search-talent"] :::recruiter

    %% Admin Pages
    Adm --> ADash["/admin (Dashboard)"] :::admin
    Adm --> AUsers["/admin/users"] :::admin
    Adm --> AAppeals["/admin/appeals"] :::admin
    Adm --> AReports["/admin/reports"] :::admin

    %% Shared Pages
    Sha --> Feed["/feed (SpillFeed)"] :::shared
    Sha --> Chat["/messages (Direct Chat)"] :::shared
    Sha --> Settings["/settings"] :::shared
```

## Architectural Organization

1. **Public / Auth (Gray)**: Routes accessible by any anonymous visitor to log in, sign up, or view the marketing landing page.
2. **Talent Module (Blue)**: Protected routes where Talent users can configure their GitHub-linked profile, browse open jobs, and track applications.
3. **Recruiter Module (Red)**: Protected routes designated for Recruiters to post jobs, review incoming applications, and search for active talent on the platform.
4. **Admin Module (Slate)**: Highly protected moderation routes for resolving suspension appeals, reviewing content reports, and managing system-wide users.
5. **Shared / Social (Gold)**: Global interactive features like the social SpillFeed and direct messaging systems that bridge the gap between user roles.
