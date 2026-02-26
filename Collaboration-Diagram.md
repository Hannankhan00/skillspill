# SkillSpill Collaboration Diagram

This document presents the Collaboration Diagram (also known as a Communication Diagram) for the SkillSpill platform.

While Sequence Diagrams focus on the chronological order of messages, Collaboration Diagrams emphasize the structural organization of the objects that send and receive messages. The following diagram illustrates a primary use case: **A Talent applying for a Bounty posted by a Recruiter**.

## Collaboration Diagram (Flowchart)

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
    'fontFamily': 'arial'
  }
} }%%
graph TD
    classDef actor fill:#fff,stroke:#000,stroke-width:2px;
    classDef component fill:#f4f4f4,stroke:#000,stroke-width:2px;
    classDef database fill:#fff,stroke:#000,stroke-width:2px;

    %% Objects/Instances involved in the collaboration
    T(Talent : User) :::actor
    R(Recruiter : User) :::actor
    
    UI[Next.js Application : Frontend] :::component
    API[Server API Route : Backend] :::component
    
    DBB[(Bounty : Database Record)] :::database
    DBA[(Application : Database Record)] :::database
    DBN[(Notification : Database Record)] :::database

    %% Structural links and message sequence
    T -->|1. views() & clicksApply()| UI
    
    UI -->|2. sendApplicationPayload(bountyId, coverLetter)| API
    
    API -->|3. findUnique()| DBB
    DBB -.->|3.1 returns bounty data| API

    API -->|4. create()| DBA
    DBA -.->|4.1 returns application status (PENDING)| API
    
    API -->|5. create()| DBN
    DBN -.->|5.1 returns notification status| API
    
    API -.->|6. applicationSuccessResponse()| UI
    
    UI -.->|7. showSuccessToast()| T
    
    DBN -.->|8. push alert (if online)| R
    R -->|9. fetchNotifications()| API
```

## Collaboration Description

The flowchart above outlines the structural layout of how objects communicate when a core user action triggers a system-wide state change in SkillSpill.

### 1. Structural Interaction
Instead of reading strictly top-to-bottom chronologically like a sequence diagram, this graph shows which software components interact. 
* The **Talent** interacts *only* with the **UI**.
* The **Frontend UI** acts as an intermediary, communicating *only* with the **Backend Server API**.
* The **Server API** is responsible for acting on multiple **Database Records** (`Bounty`, `Application`, `Notification`).

### 2. Message Sequence Numbers
The messages (edges) are numbered to show chronological execution flow passing between structurally linked node objects:
* **(1) to (2):** Talent initiates action in the Next.js UI, firing off HTTP actions to the Next.js Server backend.
* **(3) to (4):** Backend interacts with the Prisma ORM layer to fetch matching Bounty details and then creates a new Application record mapping the Talent to that Bounty.
* **(5):** Once the core database interaction is done, a secondary notification process builds a link between the interaction and the Recruiter.
* **(6) to (7):** Acknowledgement flows back up the chain to the initiating Talent actor.
* **(8) to (9):** The Recruiter independently interfaces with the Notification system downstream once the collaboration chain concludes.
