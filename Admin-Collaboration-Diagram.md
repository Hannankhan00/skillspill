# SkillSpill Collaboration Diagram (Admin Module)

This document presents the Collaboration Diagrams (also known as Communication Diagrams) specifically focusing on the **Admin Module**. 

This diagram highlights the structural organization and message passing between objects when an Administrator performs core moderation actions: **Reviewing Suspension Appeals** and **Moderating Reported Content**.

## 1. Collaboration Diagram: Resolving a Suspension Appeal

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
    %% Custom Premium Styling (Slate/Gray theme for Admin)
    classDef admin fill:#334155,stroke:#0f172a,stroke-width:2px,color:#ffffff,font-weight:bold,rx:10px,ry:10px
    classDef user fill:#2563eb,stroke:#1d4ed8,stroke-width:2px,color:#ffffff,font-weight:bold,rx:10px,ry:10px
    classDef component fill:#f8fafc,stroke:#475569,stroke-width:2px,color:#0f172a,font-weight:bold,rx:5px,ry:5px
    classDef database fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534,font-weight:bold

    %% Objects/Instances
    A(["fa:fa-shield-halved Admin : User"])
    U(["fa:fa-user SuspendedUser : User"])
    
    UI["💻 Next.js Client UI"]
    API["⚙️ Next.js Server Actions"]
    
    DBA[("⚖️ Appeal (Database Record)")]
    DBU[("👤 User (Database Record)")]
    DBN[("🔔 Notification (Database Record)")]

    class A admin
    class U user
    class UI,API component
    class DBA,DBU,DBN database

    %% Structural links and message sequence
    A -->|1. viewAppeal() & clickApprove()| UI
    
    UI -->|2. resolveAppeal(appealId, 'APPROVED')| API
    
    API -->|3. update(Appeal)| DBA
    DBA -.->|3.1 returns updated appeal| API

    API -->|4. update(User account status)| DBU
    DBU -.->|4.1 returns restored user| API
    
    API -->|5. create(Notification for User)| DBN
    DBN -.->|5.1 returns notification status| API
    
    API -.->|6. resolutionSuccessResponse()| UI
    
    UI -.->|7. removeAppealFromQueue()| A
    
    DBN -.->|8. email / push alert| U
```

## Collaboration Description

The flowchart above outlines the structural layout of how objects communicate when an Administrator restores a suspended user's account.

### Structural Interaction
* The **Admin** acts as the high-privilege initiator, interacting through the **UI component**.
* The **Server API** must perform a complex multi-table transaction, structurally reaching out to three distinct **Database Records**: `Appeal`, `User`, and `Notification`.

### Message Sequence Numbers
The numbered edges show chronological execution flow passing between structurally linked objects:
* **(1) to (2):** The Admin triggers the resolution action on the frontend, sending a payload to the backend server.
* **(3) to (5):** The Server performs three sequential database operations: updating the `Appeal` status to "APPROVED" (3), updating the associated `User` record to remove the suspension flag (4), and generating an asynchronous `Notification` (5) to let the user know.
* **(6) to (7):** The server returns success, and the UI removes the appeal from the Admin's pending review queue.
* **(8):** A system-generated email or push notification acts as the bridge back to the suspended user, letting them know their account is active again.

## 2. Collaboration Diagram: Moderating Reported Content

This diagram illustrates the structural communication when an Admin reviews a reported Social Feed post (SpillPost) and decides to delete it for violating community guidelines.

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
    %% Custom Premium Styling (Slate/Gray theme for Admin)
    classDef admin fill:#334155,stroke:#0f172a,stroke-width:2px,color:#ffffff,font-weight:bold,rx:10px,ry:10px
    classDef user fill:#2563eb,stroke:#1d4ed8,stroke-width:2px,color:#ffffff,font-weight:bold,rx:10px,ry:10px
    classDef component fill:#f8fafc,stroke:#475569,stroke-width:2px,color:#0f172a,font-weight:bold,rx:5px,ry:5px
    classDef database fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534,font-weight:bold

    %% Objects/Instances
    A(["fa:fa-shield-halved Admin : User"])
    U(["fa:fa-user OffendingUser : User"])
    
    UI["💻 Next.js Client UI"]
    API["⚙️ Next.js Server Actions"]
    
    DBR[("🚩 Report (Database Record)")]
    DBP[("💬 SpillPost (Database Record)")]
    DBN[("🔔 Notification (Database Record)")]

    class A admin
    class U user
    class UI,API component
    class DBR,DBP,DBN database

    %% Structural links and message sequence
    A -->|1. viewReport() & clickDeletePost()| UI
    
    UI -->|2. resolveReport(reportId, 'DELETED')| API
    
    API -->|3. delete(SpillPost)| DBP
    DBP -.->|3.1 returns success| API

    API -->|4. update(Report status to RESOLVED)| DBR
    DBR -.->|4.1 returns updated report| API
    
    API -->|5. create(Warning Notification)| DBN
    DBN -.->|5.1 returns notification status| API
    
    API -.->|6. moderationSuccessResponse()| UI
    
    UI -.->|7. removeReportFromQueue()| A
    
    DBN -.->|8. push warning alert| U
```

### Moderating Content Description
* **Structural Flow**: The Admin identifies an issue via the UI and triggers the Server Action. The Server enforces the moderation policy by altering the original `SpillPost`, updating the `Report` queue, and dispatching a `Notification` to the Offending User.
* **Message Sequence**: The `SpillPost` must be successfully deleted (3) before the `Report` queue is marked as resolved (4). Finally, the `Notification` record is created (5) to establish a communication bridge to the Offending User (8) so they understand why their content was removed.
