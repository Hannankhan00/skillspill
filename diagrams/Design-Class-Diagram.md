# SkillSpill Design Class Diagram

This document presents the **Design Class Diagram** for the SkillSpill platform. Unlike the conceptual Domain Model, this diagram illustrates the actual software components representing the full-stack architecture. It has been customized to accurately reflect the **Next.js (App Router)** and **Prisma** architecture.

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

    %% Frontend Components (UI Layer)
    class TalentDashboardPage {
        <<React Server Component>>
        +render()
        -fetchTalentData()
    }
    
    class RecruiterDashboardPage {
        <<React Server Component>>
        +render()
        -fetchRecruiterData()
    }

    class BountyCardComponent {
        <<Client Component>>
        +props: BountyData
        +render()
        +onApplyClick()
    }

    class ApplicationForm {
        <<Client Component>>
        +props: BountyId
        +submitApplication(data)
        +render()
    }

    %% Backend Controllers / Server Actions (Application Layer)
    class BountyActions {
        <<Server Actions>>
        +getBounties(filters)
        +createBounty(data)
        +applyToBounty(bountyId, talentId, data)
    }

    class UserActions {
        <<Server Actions>>
        +registerUser(data)
        +loginUser(credentials)
        +getUserProfile(userId)
    }

    class ApplicationActions {
        <<Server Actions>>
        +getApplicationsForBounty(bountyId)
        +updateApplicationStatus(appId, status)
    }

    %% Service / Business Logic Layer (Optional but good practice)
    class AuthenticationService {
        <<Service>>
        +hashPassword(password)
        +verifyPassword(hash, password)
        +generateSession(user)
    }

    class GitHubService {
        <<Service>>
        +fetchUserRepos(username)
        +calculateTotalStars(repos)
    }

    %% Data Access Layer (Prisma ORM Models / Wrappers)
    class PrismaUserRepository {
        <<Prisma Client>>
        +findUnique(args)
        +create(args)
        +update(args)
    }

    class PrismaBountyRepository {
        <<Prisma Client>>
        +findMany(args)
        +create(args)
        +update(args)
    }

    %% Relationships
    TalentDashboardPage ..> BountyActions : calls
    TalentDashboardPage ..> UserActions : calls
    RecruiterDashboardPage ..> BountyActions : calls
    RecruiterDashboardPage ..> ApplicationActions : calls
    
    TalentDashboardPage *-- BountyCardComponent : mounts
    BountyCardComponent ..> ApplicationForm : triggers
    ApplicationForm ..> BountyActions : invokes applyToBounty()

    UserActions ..> AuthenticationService : utilizes
    UserActions ..> PrismaUserRepository : queries
    
    BountyActions ..> PrismaBountyRepository : queries
    ApplicationActions ..> PrismaBountyRepository : queries
    
    UserActions ..> GitHubService : integrates (for setup)

    %% Premium Color Styling
    style TalentDashboardPage fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e40af
    style RecruiterDashboardPage fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e40af
    style BountyCardComponent fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e40af
    style ApplicationForm fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e40af

    style BountyActions fill:#f5f3ff,stroke:#8b5cf6,stroke-width:2px,color:#5b21b6
    style UserActions fill:#f5f3ff,stroke:#8b5cf6,stroke-width:2px,color:#5b21b6
    style ApplicationActions fill:#f5f3ff,stroke:#8b5cf6,stroke-width:2px,color:#5b21b6

    style AuthenticationService fill:#fefce8,stroke:#eab308,stroke-width:2px,color:#854d0e
    style GitHubService fill:#fefce8,stroke:#eab308,stroke-width:2px,color:#854d0e

    style PrismaUserRepository fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534
    style PrismaBountyRepository fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534
```

## Layer Descriptions

### 1. UI Layer (Next.js React Components) - <span style="color:#3b82f6">Blue</span>
* **Pages (`TalentDashboardPage`, `RecruiterDashboardPage`):** The React Server Components (RSC) that users interact with. They fetch initial data securely on the server and render child components.
* **Components (`BountyCardComponent`, `ApplicationForm`):** Reusable Client Components that handle interactivity and UI states (like clicking "Apply" and managing form inputs).

### 2. Application Layer (Next.js Server Actions) - <span style="color:#8b5cf6">Purple</span>
* **Actions (`BountyActions`, `UserActions`, `ApplicationActions`):** These act as the boundary between the frontend and the database in Next.js App Router. They validate incoming requests, check authorizations, mutate data, and coordinate business logic.

### 3. Service Layer - <span style="color:#eab308">Yellow</span>
* **Services (`AuthenticationService`, `GitHubService`):** Encapsulates complex or external business logic, such as integrating with the GitHub API for talent verification, or securely hashing passwords using `bcrypt`.

### 4. Data Access Layer (Prisma) - <span style="color:#22c55e">Green</span>
* **Repositories (`PrismaUserRepository`, `PrismaBountyRepository`):** Represents the generated Prisma Client abstraction. These execute direct database queries against the MySQL schema safely and with full TypeScript typing.
