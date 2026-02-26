# SkillSpill System Architecture Design

This document presents a high-level System Architecture Design Diagram for the SkillSpill platform. It illustrates how the different components of the application (Frontend, Backend, Database, and Third-Party API integrations) interact with each other.

## Diagram (Mermaid)

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#ffffff',
    'primaryTextColor': '#000000',
    'primaryBorderColor': '#000000',
    'lineColor': '#000000',
    'secondaryColor': '#f4f4f4',
    'tertiaryColor': '#ffffff',
    'nodeBorder': '#000000',
    'mainBkg': '#ffffff',
    'fontFamily': 'arial',
    'clusterBkg': '#fafafa'
  }
} }%%
graph TD
    classDef browser fill:#fff,stroke:#000,stroke-width:2px;
    classDef nextjs fill:#f4f4f4,stroke:#000,stroke-width:2px,stroke-dasharray: 5 5;
    classDef db fill:#fff,stroke:#000,stroke-width:2px;
    classDef external fill:#fff,stroke:#000,stroke-width:1px,stroke-dasharray: 5 5;

    subgraph "External World"
        User(Browser / Mobile Device) :::browser
        GitHubAPI[GitHub API] :::external
    end

    subgraph "Next.js Full-Stack Application"
        direction TB
        
        subgraph "Frontend Layer (React / UI)"
            Pages[App Router Pages\nTalent & Recruiter Flows]:::nextjs
            Components[UI Components\nGlassmorphism & Neon]:::nextjs
            State[State Management\nReact Context / Hooks]:::nextjs
        end
        
        subgraph "Backend Layer (Server)"
            API[API Routes / Server Actions]:::nextjs
            Auth[Authentication\nJWT / Sessions]:::nextjs
            ORM[Prisma ORM]:::nextjs
        end
    end

    subgraph "Data Storage"
        DB[(MySQL Database)] :::db
    end

    %% Interactions
    User -->|HTTP/HTTPS Request| Pages
    Pages --> Components
    Pages --> State
    
    Pages -->|Fetch / Server Actions| API
    Components -->|Trigger| API
    
    API --> Auth
    API --> ORM
    
    ORM -->|TCP Connection| DB
    
    API -.->|Fetch Repos/Stars| GitHubAPI
```

## Component Descriptions

### 1. External World
* **User:** Accesses SkillSpill via a web browser or mobile browser.
* **GitHub API:** An external service integration used for verifying Talent skills by fetching their repositories and star counts.

### 2. Next.js Full-Stack Application
The core of the SkillSpill infrastructure runs on a single Full-Stack Next.js application framework.

#### Frontend Layer (React / UI)
* **App Router Pages:** The pages mapping to the defined routes for Talent, Recruiter, and Admin flows.
* **UI Components:** Reusable design system elements constructed with Tailwind CSS implementing the neon aesthetic and glassmorphism.
* **State Management:** Manages localized active states like theme preferences, notification stores, and form toggles.

#### Backend Layer (Server)
* **API Routes & Server Actions:** Server-side logic handling application submissions, bounty creation, profiles, and data processing.
* **Authentication:** Next.js based JWT and session management to differentiate roles securely.
* **Prisma ORM:** The database abstraction layer used to securely query the MySQL data model safely with strict typing.

### 3. Data Storage
* **MySQL Database:** The relational database holding all critical persistent state: Users, Profiles, Bounties, Applications, and Logs. Configured through Prisma's schema.
