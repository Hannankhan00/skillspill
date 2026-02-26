# SkillSpill Design Class Diagram

This document presents the Design Class Diagram for the SkillSpill platform. Unlike the conceptual UML Class Diagram that focuses on database entities, this Design Class Diagram illustrates the actual software components, including Next.js Pages (UI), Server Actions/API Controllers, Services, and Data Access (Prisma), representing the full-stack architecture.

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

    %% Frontend Components (UI Layer)
    class TalentDashboardPage {
        <<UI Component>>
        +render()
        -fetchTalentData()
    }
    
    class RecruiterDashboardPage {
        <<UI Component>>
        +render()
        -fetchRecruiterData()
    }

    class BountyCardComponent {
        <<UI Component>>
        +props: BountyData
        +render()
        +onApplyClick()
    }

    class ApplicationForm {
        <<UI Component>>
        +props: BountyId
        +submitApplication(data)
        +render()
    }

    %% Backend Controllers / Server Actions (Application Layer)
    class BountyController {
        <<Server Action / API>>
        +getBounties(filters)
        +createBounty(data)
        +applyToBounty(bountyId, talentId, data)
    }

    class UserController {
        <<Server Action / API>>
        +registerUser(data)
        +loginUser(credentials)
        +getUserProfile(userId)
    }

    class ApplicationController {
        <<Server Action / API>>
        +getApplicationsForBounty(bountyId)
        +updateApplicationStatus(appId, status)
    }

    %% Service / Business Logic Layer (Optional but good practice)
    class AuthenticationService {
        <<Service>>
        +hashPassword(password)
        +verifyPassword(hash, password)
        +generateJWT(user)
        +validateSession(token)
    }

    class GitHubIntegrationService {
        <<Service>>
        +fetchUserRepos(username)
        +calculateTotalStars(repos)
    }

    %% Data Access Layer (Prisma ORM Models / Wrappers)
    class PrismaUserRepository {
        <<Repository>>
        +findUnique(args)
        +create(args)
        +update(args)
    }

    class PrismaBountyRepository {
        <<Repository>>
        +findMany(args)
        +create(args)
        +update(args)
    }

    %% Relationships
    TalentDashboardPage ..> BountyController : calls (HTTP/Action)
    TalentDashboardPage ..> UserController : calls
    RecruiterDashboardPage ..> BountyController : calls
    RecruiterDashboardPage ..> ApplicationController : calls
    
    TalentDashboardPage *-- BountyCardComponent : uses
    BountyCardComponent ..> ApplicationForm : opens
    ApplicationForm ..> BountyController : applyToBounty()

    UserController ..> AuthenticationService : uses
    UserController ..> PrismaUserRepository : uses
    
    BountyController ..> PrismaBountyRepository : uses
    ApplicationController ..> PrismaBountyRepository : uses
    
    UserController ..> GitHubIntegrationService : uses (for Talent setup)
```

## Layer Descriptions

### 1. UI Layer (Next.js React Components)
* **Pages (`TalentDashboardPage`, `RecruiterDashboardPage`):** The main views that users interact with. They fetch initial data and render child components.
* **Components (`BountyCardComponent`, `ApplicationForm`):** Reusable UI elements that handle specific user interactions (like clicking "Apply" and filling out forms).

### 2. Application Layer (Next.js Server Actions / API Routes)
* **Controllers (`BountyController`, `UserController`, `ApplicationController`):** These act as the boundary between the frontend and the database. They validate incoming requests, check authorizations, and coordinate business logic.

### 3. Service Layer
* **Services (`AuthenticationService`, `GitHubIntegrationService`):** Encapsulates complex or external business logic, such as integrating with the GitHub API for talent verification, or securely hashing passwords.

### 4. Data Access Layer
* **Repositories / ORM (`PrismaUserRepository`, `PrismaBountyRepository`):** Represents the Prisma Client abstraction. These execute direct queries (create, read, update, delete) against the MySQL database.
