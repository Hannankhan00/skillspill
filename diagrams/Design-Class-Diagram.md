# SkillSpill Design Class Diagram

Verified against the codebase. Optimised for **A4 landscape** printing.

> **Print tip**: Paste into [mermaid.live](https://mermaid.live) → **File → Print → Landscape → A4 → Scale to fit**.

## Diagram (Mermaid)

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#ffffff',
    'primaryTextColor': '#000000',
    'primaryBorderColor': '#000000',
    'lineColor': '#000000',
    'lineWidth': '2.5',
    'fontFamily': 'Arial, sans-serif',
    'fontSize': '13px'
  }
}}%%
classDiagram
    direction LR

    %% ── UI LAYER ─────────────────────────────────────
    class TalentPage {
        <<RSC + Shell>>
    }
    class RecruiterPage {
        <<RSC + Shell>>
    }
    class AdminPage {
        <<RSC>>
    }

    %% ── API ROUTE HANDLERS ───────────────────────────
    class AuthRoutes {
        <<Route Handler>>
    }
    class SpillRoutes {
        <<Route Handler>>
    }
    class JobRoutes {
        <<Route Handler>>
    }
    class ApplicationRoutes {
        <<Route Handler>>
    }
    class GitHubRoutes {
        <<Route Handler>>
    }
    class MatchingRoutes {
        <<Route Handler>>
    }
    class ConversationRoutes {
        <<Route Handler>>
    }
    class ModerationRoutes {
        <<Route Handler>>
    }
    class AdminRoutes {
        <<Route Handler>>
    }

    %% ── SERVICE LAYER ────────────────────────────────
    class AuthService {
        <<Service>>
        hashPassword()
        createSession()
    }
    class GitHubScoringService {
        <<Service>>
        scoreRepo()
        selectTopRepo()
    }
    class MatchingService {
        <<Service>>
        runMatching()
        storeResults()
    }
    class NotifyService {
        <<Service>>
        send()
        pushRealtime()
    }
    class StorageService {
        <<Service>>
        uploadBlob()
    }

    %% ── EXTERNAL MICROSERVICE ────────────────────────
    class PythonMatcherService {
        <<Flask Microservice>>
        semanticScore : Float
        skillOverlapScore : Float
    }

    %% ── DATA ACCESS ──────────────────────────────────
    class PrismaClient {
        <<Singleton ORM>>
        All DB delegates
    }

    %% ── DATABASE ─────────────────────────────────────
    class MySQLDatabase {
        <<MySQL>>
    }

    %% ── RELATIONSHIPS ────────────────────────────────

    TalentPage --> AuthRoutes : auth
    TalentPage --> SpillRoutes : feed
    TalentPage --> JobRoutes : bounties
    TalentPage --> GitHubRoutes : repos
    TalentPage --> ConversationRoutes : messages

    RecruiterPage --> JobRoutes : manage
    RecruiterPage --> ApplicationRoutes : applications
    RecruiterPage --> MatchingRoutes : matches
    RecruiterPage --> ConversationRoutes : messages

    AdminPage --> AdminRoutes : admin
    AdminPage --> ModerationRoutes : moderate

    AuthRoutes --> AuthService : delegates
    AuthRoutes --> PrismaClient : persists

    SpillRoutes --> PrismaClient : queries
    SpillRoutes --> StorageService : upload
    SpillRoutes --> NotifyService : notify

    JobRoutes --> PrismaClient : queries
    ApplicationRoutes --> PrismaClient : queries
    ApplicationRoutes --> NotifyService : notify

    GitHubRoutes --> GitHubScoringService : score
    GitHubRoutes --> PrismaClient : persists

    MatchingRoutes --> MatchingService : triggers
    MatchingService --> PythonMatcherService : HTTP
    MatchingService --> PrismaClient : stores

    ConversationRoutes --> PrismaClient : queries
    ConversationRoutes --> NotifyService : realtime

    ModerationRoutes --> PrismaClient : queries
    AdminRoutes --> PrismaClient : queries

    PrismaClient --> MySQLDatabase : SQL

    %% ── B&W PRINT STYLING ────────────────────────────

    style TalentPage fill:#ffffff,stroke:#000000,stroke-width:3px,color:#000000
    style RecruiterPage fill:#ffffff,stroke:#000000,stroke-width:3px,color:#000000
    style AdminPage fill:#ffffff,stroke:#000000,stroke-width:3px,color:#000000

    style AuthRoutes fill:#f0f0f0,stroke:#000000,stroke-width:2px,color:#000000
    style SpillRoutes fill:#f0f0f0,stroke:#000000,stroke-width:2px,color:#000000
    style JobRoutes fill:#f0f0f0,stroke:#000000,stroke-width:2px,color:#000000
    style ApplicationRoutes fill:#f0f0f0,stroke:#000000,stroke-width:2px,color:#000000
    style GitHubRoutes fill:#f0f0f0,stroke:#000000,stroke-width:2px,color:#000000
    style MatchingRoutes fill:#f0f0f0,stroke:#000000,stroke-width:2px,color:#000000
    style ConversationRoutes fill:#f0f0f0,stroke:#000000,stroke-width:2px,color:#000000
    style ModerationRoutes fill:#f0f0f0,stroke:#000000,stroke-width:2px,color:#000000
    style AdminRoutes fill:#f0f0f0,stroke:#000000,stroke-width:2px,color:#000000

    style AuthService fill:#d9d9d9,stroke:#000000,stroke-width:2px,color:#000000
    style GitHubScoringService fill:#d9d9d9,stroke:#000000,stroke-width:2px,color:#000000
    style MatchingService fill:#d9d9d9,stroke:#000000,stroke-width:2px,color:#000000
    style NotifyService fill:#d9d9d9,stroke:#000000,stroke-width:2px,color:#000000
    style StorageService fill:#d9d9d9,stroke:#000000,stroke-width:2px,color:#000000

    style PythonMatcherService fill:#a6a6a6,stroke:#000000,stroke-width:3px,color:#000000

    style PrismaClient fill:#bfbfbf,stroke:#000000,stroke-width:3px,color:#000000

    style MySQLDatabase fill:#8c8c8c,stroke:#000000,stroke-width:3px,color:#000000
```

---

## Layer Legend

| Fill | Layer |
|---|---|
| White `#ffffff` | UI (Next.js Pages) |
| Light grey `#f0f0f0` | API Route Handlers |
| Medium grey `#d9d9d9` | Service Layer |
| Dark grey `#a6a6a6` | External Microservice (Flask) |
| Mid-dark `#bfbfbf` | Data Access (Prisma ORM) |
| Darkest `#8c8c8c` | MySQL Database |

> **Border key**: **3px** = critical/central · **2px** = primary

---

## Layer Descriptions

1. **UI**: Server-rendered pages with embedded client shells for interactivity.
2. **API Routes** (`/app/api/`): REST boundary — one class per route group.
3. **Services** (`/lib/`): Auth, GitHub scoring pipeline, semantic matching, notifications, and blob storage.
4. **Microservice** (`matching-service/`): Dockerised Python Flask — computes semantic + skill-overlap scores.
5. **Data Access**: Single `PrismaClient` singleton querying MySQL via Prisma ORM.
