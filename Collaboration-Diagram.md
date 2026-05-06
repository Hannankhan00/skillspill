# SkillSpill Collaboration Diagram (Talent Module)

This document presents the Collaboration Diagrams (also known as Communication Diagrams) for the SkillSpill platform, specifically focusing on the **Talent Module**.

While Sequence Diagrams focus on the chronological order of messages, Collaboration Diagrams emphasize the structural organization of the objects that send and receive messages. Because Collaboration Diagrams map specific interactions, we have split the Talent module into its two primary use cases to prevent overlapping sequence numbers.

## 1. Collaboration Diagram: Applying for a Job

This diagram illustrates a Talent applying for a Job posted by a Recruiter.

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
    classDef actor fill:#2563eb,stroke:#1d4ed8,stroke-width:2px,color:#ffffff,font-weight:bold,rx:10px,ry:10px
    classDef component fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e40af,font-weight:bold,rx:5px,ry:5px
    classDef database fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534,font-weight:bold

    %% Objects/Instances involved in the collaboration
    T(["fa:fa-user-astronaut Talent : User"])
    R(["fa:fa-user-tie Recruiter : User"])
    
    UI["💻 Next.js Client UI"]
    API["⚙️ Next.js Server Actions"]
    
    DBJ[("📄 Job (Database Record)")]
    DBA[("📝 Application (Database)")]
    DBN[("🔔 Notification (Database)")]

    class T,R actor
    class UI,API component
    class DBJ,DBA,DBN database

    %% Structural links and message sequence
    T -->|1. viewJob() & clickApply()| UI
    
    UI -->|2. submitApplication(jobId, coverLetter)| API
    
    API -->|3. checkJobStatus(jobId)| DBJ
    DBJ -.->|3.1 returns job data| API

    API -->|4. create(Application)| DBA
    DBA -.->|4.1 returns status (PENDING)| API
    
    API -->|5. create(Notification)| DBN
    DBN -.->|5.1 returns notification status| API
    
    API -.->|6. applicationSuccessResponse()| UI
    
    UI -.->|7. showSuccessToast()| T
    
    DBN -.->|8. push alert (if online)| R
    R -->|9. fetchNotifications()| API
```

## 2. Collaboration Diagram: Posting to the Spill Feed

This diagram illustrates the structural interaction when a Talent publishes a new post (text, code, or media) to the social feed.

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
    classDef actor fill:#2563eb,stroke:#1d4ed8,stroke-width:2px,color:#ffffff,font-weight:bold,rx:10px,ry:10px
    classDef component fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e40af,font-weight:bold,rx:5px,ry:5px
    classDef database fill:#fefce8,stroke:#eab308,stroke-width:2px,color:#854d0e,font-weight:bold

    %% Objects/Instances
    T(["fa:fa-user-astronaut Talent : User"])
    F(["fa:fa-users Followers : User"])
    
    UI["💻 Next.js Client UI"]
    API["⚙️ Next.js Server Actions"]
    
    DBP[("💬 SpillPost (Database)")]
    DBM[("🖼️ SpillMedia (Database)")]

    class T,F actor
    class UI,API component
    class DBP,DBM database

    %% Structural links and message sequence
    T -->|1. writePost() & clickPublish()| UI
    
    UI -->|2. submitPost(caption, mediaFiles)| API
    
    API -->|3. uploadMedia()| DBM
    DBM -.->|3.1 returns media URLs| API

    API -->|4. create(Post)| DBP
    DBP -.->|4.1 returns post object| API
    
    API -.->|5. publishSuccessResponse()| UI
    
    UI -.->|6. prependPostToFeed()| T
    
    DBP -.->|7. real-time feed update| F
    F -->|8. viewNewPost()| UI
```

## Collaboration Description

The flowcharts above outline the structural layout of how objects communicate when a core user action triggers a system-wide state change within the Talent module.

### 1. Structural Interaction
Instead of reading strictly top-to-bottom chronologically like a sequence diagram, this graph shows which software components interact. 
* The **Talent** interacts *only* with the **UI**.
* The **Frontend UI** acts as an intermediary, communicating *only* with the **Backend Server API**.
* The **Server API** is responsible for acting on multiple **Database Records**.

### 2. Why Two Diagrams?
Collaboration Diagrams use numbered arrows to show chronological execution (`1. doThis()`, `2. doThat()`). If we placed "Applying for a Job" and "Posting to the Feed" on the exact same diagram, the numbers would overlap and conflict, making the diagram impossible to read. By separating the specific use cases, the structural messaging remains clear.
