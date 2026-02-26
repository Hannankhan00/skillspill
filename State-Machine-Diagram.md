# SkillSpill Architecture - State Machine Diagrams

This document contains State Machine diagrams to illustrate the lifecycle of key entities in the SkillSpill system: **Bounty** (Job Post) and **Application** (Candidate Submission).

## 1. Bounty State Machine

This diagram shows how a Bounty transitions through different states from its creation by a recruiter to its completion or cancellation.

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
stateDiagram-v2
    [*] --> OPEN : Create Bounty

    OPEN --> IN_PROGRESS : Accept Application
    OPEN --> CANCELLED : Recruiter Cancels (No Candidates)
    
    IN_PROGRESS --> COMPLETED : Talent Finishes Work
    IN_PROGRESS --> CANCELLED : Recruiter/Admin Terminates
    
    COMPLETED --> [*]
    CANCELLED --> [*]

    note right of OPEN
        Talent can view and apply
        to the bounty in this state.
    end note
```

## 2. Bounty Application State Machine

This diagram outlines how a Talent's application to a particular Bounty moves from submission to the final decision.

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
stateDiagram-v2
    [*] --> PENDING : Talent applies

    PENDING --> REVIEWED : Recruiter Views Application
    PENDING --> REJECTED : Recruiter Rejects / Auto-Reject (Deadline)
    
    REVIEWED --> SHORTLISTED : Recruiter Marks as Potential
    REVIEWED --> REJECTED : Recruiter Declines
    
    SHORTLISTED --> ACCEPTED : Recruiter Approves Candidate
    SHORTLISTED --> REJECTED : Recruiter Declines
    
    ACCEPTED --> [*] : Bounty Moves to IN_PROGRESS
    REJECTED --> [*]
```

## 3. User Suspension / Appeal State Machine

To show the lifecycle of an Admin moderating a user.

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
stateDiagram-v2
    [*] --> ACTIVE : User Signup
    
    ACTIVE --> SUSPENDED : Admin detects violation
    
    state SUSPENDED {
        [*] --> PENDING_APPEAL : User submits appeal
        PENDING_APPEAL --> APPEAL_REJECTED : Admin Denies Appeal
        PENDING_APPEAL --> APPEAL_APPROVED : Admin Approves Appeal
        APPEAL_REJECTED --> [*] : Permanent Ban
    }
    
    APPEAL_APPROVED --> ACTIVE : Access Restored
```
