# SkillSpill Navigation Maps (Separate Portals)

Below are the separate navigation maps for Authentication/Public, Talent, Recruiter, and Admin dashboards.

## 1. Authentication & Public Navigation

```mermaid
graph TD
    classDef rootNode fill:#0f172a,stroke:#334155,stroke-width:2px,color:#FFFFFF,font-weight:bold,rx:10,ry:10;
    classDef authNode fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#FFFFFF,font-weight:bold,rx:5,ry:5;
    classDef pageNode fill:#f8fafc,stroke:#cbd5e1,stroke-width:1px,color:#0f172a,rx:5,ry:5;
    classDef dynamicNode fill:#eff6ff,stroke:#93c5fd,stroke-width:1px,color:#1e40af,stroke-dasharray: 5 5,rx:5,ry:5;

    Home["🏠 Landing Page (/)"]:::rootNode

    %% Auth 
    Login["/login"]:::authNode
    SignupT["/signup/talent"]:::authNode
    SignupR["/signup/recruiter"]:::authNode
    
    Home --> Login
    Home --> SignupT
    Home --> SignupR

    %% General / Public
    Feed["/feed"]:::pageNode
    FeedSaved["/feed/saved"]:::pageNode
    FeedTag["/feed/tag/[hashtag]"]:::dynamicNode
    Dash["/dashboard (Router)"]:::pageNode
    Suspended["/suspended"]:::pageNode

    Home --> Feed
    Home --> Dash
    Home --> Suspended

    Feed --> FeedSaved
    Feed --> FeedTag
```

## 2. Talent Portal Navigation

```mermaid
graph TD
    classDef portalNode fill:#2563eb,stroke:#1d4ed8,stroke-width:2px,color:#FFFFFF,font-weight:bold,rx:8,ry:8;
    classDef pageNode fill:#f8fafc,stroke:#cbd5e1,stroke-width:1px,color:#0f172a,rx:5,ry:5;
    classDef dynamicNode fill:#eff6ff,stroke:#93c5fd,stroke-width:1px,color:#1e40af,stroke-dasharray: 5 5,rx:5,ry:5;

    Talent["👨‍💻 Talent Portal (/talent)"]:::portalNode

    T_Jobs["/talent/jobs"]:::pageNode
    T_JobId["/talent/jobs/[id]"]:::dynamicNode
    T_Github["/talent/github"]:::pageNode
    T_SkillTree["/talent/skill-tree"]:::pageNode
    T_Messages["/talent/messages"]:::pageNode
    T_Search["/talent/search"]:::pageNode
    T_Profile["/talent/profile"]:::pageNode
    T_Settings["/talent/settings"]:::pageNode
    T_ViewT["/talent/talent/[id]"]:::dynamicNode
    T_ViewR["/talent/recruiter/[id]"]:::dynamicNode

    Talent --> T_Jobs
    T_Jobs --> T_JobId
    
    Talent --> T_Github
    Talent --> T_SkillTree
    Talent --> T_Messages
    Talent --> T_Search
    Talent --> T_Profile
    Talent --> T_Settings
    Talent --> T_ViewT
    Talent --> T_ViewR
```

## 3. Recruiter Portal Navigation

```mermaid
graph TD
    classDef portalNode fill:#7B2FFF,stroke:#5A18C8,stroke-width:2px,color:#FFFFFF,font-weight:bold,rx:8,ry:8;
    classDef pageNode fill:#f8fafc,stroke:#cbd5e1,stroke-width:1px,color:#0f172a,rx:5,ry:5;
    classDef dynamicNode fill:#f3e8ff,stroke:#d8b4fe,stroke-width:1px,color:#6b21a8,stroke-dasharray: 5 5,rx:5,ry:5;

    Recruiter["🏢 Recruiter Portal (/recruiter)"]:::portalNode

    R_Jobs["/recruiter/jobs"]:::pageNode
    R_Apps["/recruiter/applications"]:::pageNode
    R_Messages["/recruiter/messages"]:::pageNode
    R_Notifs["/recruiter/notifications"]:::pageNode
    R_Search["/recruiter/search"]:::pageNode
    R_Profile["/recruiter/profile"]:::pageNode
    R_Settings["/recruiter/settings"]:::pageNode
    R_ViewT["/recruiter/talent/[id]"]:::dynamicNode
    R_ViewR["/recruiter/recruiter/[id]"]:::dynamicNode

    Recruiter --> R_Jobs
    Recruiter --> R_Apps
    Recruiter --> R_Messages
    Recruiter --> R_Notifs
    Recruiter --> R_Search
    Recruiter --> R_Profile
    Recruiter --> R_Settings
    Recruiter --> R_ViewT
    Recruiter --> R_ViewR
```

## 4. Admin Portal Navigation

*Note: The Admin portal is built as a single-page application using internal React state to switch tabs, so the paths are represented as internal sections rather than router URLs.*

```mermaid
graph TD
    classDef portalNode fill:#0DD5E7,stroke:#0A9BA8,stroke-width:2px,color:#0a1415,font-weight:bold,rx:8,ry:8;
    classDef tabNode fill:#e0f2fe,stroke:#7dd3fc,stroke-width:1px,color:#0369a1,stroke-dasharray: 2 2,rx:5,ry:5;

    Admin["⚙️ Admin Portal (/admin)"]:::portalNode

    A_Dash["Executive Dashboard<br/>(Overview Tab)"]:::tabNode
    A_Users["User Management<br/>(Users Tab)"]:::tabNode
    A_Appeals["Appeal Management<br/>(Appeals Tab)"]:::tabNode
    A_Reports["Network Reports<br/>(Reports Tab)"]:::tabNode

    Admin -.-> A_Dash
    Admin -.-> A_Users
    Admin -.-> A_Appeals
    Admin -.-> A_Reports
```
