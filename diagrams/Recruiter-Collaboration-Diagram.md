# SkillSpill Collaboration Diagram (Recruiter Module)

This document presents the Collaboration Diagrams (also known as Communication Diagrams) specifically focusing on the **Recruiter Module**. 

This diagram highlights the structural organization and message passing between objects when a Recruiter performs their two primary use cases: **Posting a new Job** and **Reviewing Applications**.

## Collaboration Diagram: Posting a Job

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
    %% Custom Premium Styling (Red/Rose theme for Recruiter)
    classDef actor fill:#e11d48,stroke:#9f1239,stroke-width:2px,color:#ffffff,font-weight:bold,rx:10px,ry:10px
    classDef component fill:#fff1f2,stroke:#f43f5e,stroke-width:2px,color:#9f1239,font-weight:bold,rx:5px,ry:5px
    classDef database fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534,font-weight:bold

    %% Objects/Instances
    R(["fa:fa-user-tie Recruiter : User"])
    
    UI["💻 Next.js Client UI"]
    API["⚙️ Next.js Server Actions"]
    
    DBJ[("📄 Job (Database Record)")]
    DBS[("🎯 JobSkill (Database Record)")]

    class R actor
    class UI,API component
    class DBJ,DBS database

    %% Structural links and message sequence
    R -->|1. fillForm() & clickPublish()| UI
    
    UI -->|2. submitJobPayload(details, skills)| API
    
    API -->|3. create(Job)| DBJ
    DBJ -.->|3.1 returns jobId| API

    API -->|4. insert(JobSkills)| DBS
    DBS -.->|4.1 returns success| API
    
    API -.->|5. jobPublishedResponse()| UI
    
    UI -.->|6. showSuccessToast() & redirect()| R
```

## Collaboration Description

The flowchart above outlines the structural layout of how objects communicate when a Recruiter creates a new job.

### Structural Interaction
* The **Recruiter** interacts *only* with the **UI component** (the browser form).
* The **Frontend UI** bundles the data and acts as a structural intermediary, communicating *only* with the **Backend Server API**.
* The **Server API** coordinates the transaction, manipulating multiple **Database Records** (`Job` and `JobSkill`) to ensure data consistency.

### Message Sequence Numbers
The numbered edges show chronological execution flow passing between structurally linked objects:
* **(1) to (2):** The Recruiter initiates the action, prompting the UI to send the payload to the Next.js Server.
* **(3) to (4):** The Server performs a database transaction. It must first create the core `Job` record (3) before it can insert the associated `JobSkill` records (4) using the newly generated ID.
* **(5) to (6):** Once the database acknowledges the transaction, the server responds to the UI, which visually confirms the action to the Recruiter.

## 2. Collaboration Diagram: Reviewing an Application

This diagram illustrates the structural communication when a Recruiter accepts (or rejects) a Talent's application.

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
    %% Custom Premium Styling (Red/Rose theme for Recruiter)
    classDef actor fill:#e11d48,stroke:#9f1239,stroke-width:2px,color:#ffffff,font-weight:bold,rx:10px,ry:10px
    classDef talent fill:#2563eb,stroke:#1d4ed8,stroke-width:2px,color:#ffffff,font-weight:bold,rx:10px,ry:10px
    classDef component fill:#fff1f2,stroke:#f43f5e,stroke-width:2px,color:#9f1239,font-weight:bold,rx:5px,ry:5px
    classDef database fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534,font-weight:bold

    %% Objects/Instances
    R(["fa:fa-user-tie Recruiter : User"])
    T(["fa:fa-user-astronaut Talent : User"])
    
    UI["💻 Next.js Client UI"]
    API["⚙️ Next.js Server Actions"]
    
    DBA[("📝 Application (Database Record)")]
    DBN[("🔔 Notification (Database Record)")]

    class R actor
    class T talent
    class UI,API component
    class DBA,DBN database

    %% Structural links and message sequence
    R -->|1. viewApplicants() & clickAccept()| UI
    
    UI -->|2. updateApplicationStatus(appId, 'ACCEPTED')| API
    
    API -->|3. update(Application)| DBA
    DBA -.->|3.1 returns updated app| API

    API -->|4. create(Notification for Talent)| DBN
    DBN -.->|4.1 returns notification status| API
    
    API -.->|5. statusUpdateResponse()| UI
    
    UI -.->|6. showSuccessToast()| R
    
    DBN -.->|7. push alert (if online)| T
    T -->|8. checkNotifications()| API
```

### Reviewing Application Description
* **Structural Flow**: The Recruiter acts on the UI, which routes to the Server Actions. The server mutates the `Application` state and generates a `Notification`. The `Notification` then acts as the structural bridge to the separate `Talent` actor.
* **Message Sequence**: The `Application` record must be successfully updated (3) before the `Notification` payload is generated (4). Finally, the feedback loop closes for the Recruiter (6), and an asynchronous alert loop opens for the Talent (7).
