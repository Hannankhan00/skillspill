# SkillSpill State Chart Diagram

This document contains a comprehensive State Chart Diagram (also known as a State Machine Diagram) but focused on the broader system behavior, specifically the **User Journey and Session Lifecycle**.

While a standard State Machine focuses on individual records (like the status of a Bounty), this State Chart Diagram illustrates the complex, composite states a User traverses when interacting with the application.

## 1. User Journey & Session State Chart

This diagram illustrates the login, onboarding, and dashboard interactions for both Talent and Recruiter users, showing hierarchical states beautifully color-coded by their phase.

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
stateDiagram-v2
    %% Premium color styling definitions
    classDef unauth fill:#f1f5f9,color:#334155,stroke:#94a3b8,stroke-width:2px,font-weight:bold
    classDef auth fill:#eff6ff,color:#1e40af,stroke:#3b82f6,stroke-width:2px,font-weight:bold
    classDef onboard fill:#f5f3ff,color:#5b21b6,stroke:#8b5cf6,stroke-width:2px,font-weight:bold
    classDef active fill:#f0fdf4,color:#166534,stroke:#22c55e,stroke-width:2px,font-weight:bold
    
    [*] --> Unauthenticated
    class Unauthenticated unauth

    Unauthenticated --> Authenticating : Initiates Auth Flow
    
    state Authenticating {
        [*] --> EnteringCredentials : Input Details
        EnteringCredentials --> ValidatingAuth : Submit
        ValidatingAuth --> EnteringCredentials : Bad Credentials
        ValidatingAuth --> Authenticated : Success (Session Active)
    }
    class Authenticating auth
    
    Authenticated --> Onboarding : First Login (No Profile)
    Authenticated --> DashboardSession : Returning User
    
    state Onboarding {
        [*] --> SelectingRole : Choose Path
        SelectingRole --> TalentSetup : Selects 'Talent'
        SelectingRole --> RecruiterSetup : Selects 'Recruiter'
        
        TalentSetup --> ProfileComplete : Adds Bio & GitHub
        RecruiterSetup --> ProfileComplete : Adds Company Info
    }
    class Onboarding onboard
    
    ProfileComplete --> DashboardSession : Finishes Setup
    
    state DashboardSession {
        [*] --> Idle
        
        %% Talent Flow Interactions
        Idle --> BrowsingJobs : Talent Views Feed
        BrowsingJobs --> ApplyingToJob : Clicks 'Apply'
        ApplyingToJob --> BrowsingJobs : Completes Application
        
        %% Recruiter Flow Interactions
        Idle --> ManagingJobs : Recruiter Views Dash
        ManagingJobs --> CreatingJob : Clicks 'Post Job'
        CreatingJob --> ManagingJobs : Publishes Job
        
        ManagingJobs --> ReviewingApplications : Opens Applicants
        ReviewingApplications --> ManagingJobs : Accepts / Rejects
    }
    class DashboardSession active
    
    DashboardSession --> Unauthenticated : User Logs Out
    Onboarding --> Unauthenticated : User Logs Out / Aborts
```

### State Chart Explanations

1. **Unauthenticated / Authenticating (Blue):** The user starts here. An internal sub-state validates their credentials against the database. If authentication fails, they return to the input state; if it succeeds, they become `Authenticated`.
2. **Onboarding (Purple):** A critical fork in the state. If the user record lacks a related `TalentProfile` or `RecruiterProfile`, they must pass through this state. It splits into two mutually exclusive sub-states (`TalentSetup` and `RecruiterSetup`) before converging at `ProfileComplete`.
3. **DashboardSession (Green):** Once inside, the user enters an `Idle` state on their dashboard. From here, depending on their role, they branch into different activity states:
    *   **Talent:** Transition into `BrowsingJobs` and `ApplyingToJob`.
    *   **Recruiter:** Transition into `ManagingJobs`, `CreatingJob`, and `ReviewingApplications`.
4. **Logout:** From any active, authenticated major state (Dashboard or Onboarding), triggering a Log Out action transitions the user immediately back to the initial `Unauthenticated` state (Gray), terminating the session securely.
