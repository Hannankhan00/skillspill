# SkillSpill Storyboard Diagram (User Flow)

This document presents a UI Storyboard (User Flow) Diagram for the SkillSpill platform. 

A storyboard diagram visually represents the sequence of graphical User Interface (UI) screens a user navigates through to accomplish a specific goal. This specific storyboard illustrates the **Talent User Journey**: from arriving at the site to successfully applying for a Job.

## Storyboard Flowchart

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
    classDef screen fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e40af,rx:10px,ry:10px
    classDef modal fill:#fefce8,stroke:#eab308,stroke-width:2px,color:#854d0e,stroke-dasharray: 5 5,rx:10px,ry:10px
    classDef note fill:#f8fafc,stroke:#475569,stroke-width:1px,color:#334155,font-style:italic

    %% Screen Definitions & Classification
    subgraph "Public / Entry"
        Screen1["<b>[ Screen 1 ]</b><br/>SkillSpill Landing Page<br/><i>Hero section with neon aesthetic</i><br/>[ Login / Sign Up ] [ Explore Jobs ]"]
        Screen2["<b>[ Screen 2 ]</b><br/>Authentication Modal<br/><i>Email / Password Inputs</i><br/>[ Authenticate via GitHub ]<br/>[ Log In ]"]
    end

    subgraph "Main Application (Talent Hub)"
        Screen3["<b>[ Screen 3 ]</b><br/>Talent Dashboard<br/><i>Sidebar Navigation | Main Feed</i><br/>[ Job Card: React Developer ]<br/>[ Job Card: Smart Contract ]"]
    end

    subgraph "Job Interaction Flow"
        Screen4["<b>[ Screen 4 ]</b><br/>Job Details View<br/><i>Full description, requirements, reward</i><br/>[ Apply Now ] [ Save for Later ]"]
        Screen5["<b>[ Screen 5 ]</b><br/>Application Form Modal<br/><i>Cover Letter Textarea / GitHub Select</i><br/>[ Submit Application ] [ Cancel ]"]
    end
    
    subgraph "Post-Action Tracking"
        Screen6["<b>[ Screen 6 ]</b><br/>Success Tracking View<br/><i>'My Applications' Tab</i><br/>Status: [ PENDING ]"]
    end

    class Screen1,Screen3,Screen4,Screen6 screen
    class Screen2,Screen5 modal

    %% Flow UI Actions
    Screen1 -->|"Clicks [ Login / Sign Up ]"| Screen2
    Screen2 -->|"Enters credentials & Clicks [ Log In ]"| Screen3
    Screen3 -->|"Scrolls and clicks [ Job Card ]"| Screen4
    Screen4 -->|"Decides to apply & clicks [ Apply Now ]"| Screen5
    Screen5 -->|"Types pitch & clicks [ Submit Application ]"| Screen6

    %% Helper Notes
    note1>Toast Notification:<br/>'Application Submitted Successfully!']
    Screen5 -.-> note1
    note1 -.-> Screen6
    
    class note1 note
```

## Screen Descriptions

1.  **Screen 1 - Landing Page:** The initial impression of the SkillSpill platform. It features the primary brand messaging, futuristic glassmorphism design, and clear call-to-actions to funnel users into the onboarding process.
2.  **Screen 2 - Authentication Modal:** A popup overlay where users can create an account or log in. It includes options for traditional email/password login as well as rapid OAuth login (like GitHub), which is highly relevant for the Talent user base.
3.  **Screen 3 - Talent Dashboard:** The core hub for authenticated Talent. The UI displays an endless feed or grid of available Jobs. Each card provides a high-level summary (Title, Reward, Tech Stack).
4.  **Screen 4 - Job Details View:** Once a Job Card is clicked, the UI expands to show a dedicated page or full-screen modal. The user can read the complete requirements and evaluate the specific criteria before deciding to apply.
5.  **Screen 5 - Application Form Modal:** An active input state overlay. The Talent writes their cover letter/pitch here. The UI might optionally autofill their verified tools or GitHub links to streamline the application process.
6.  **Screen 6 - Success Tracking View:** Post-submission, the user is redirected to a dashboard tab (e.g., "My Applications") where they can visually track the timeline of their submission moving from "PENDING" to "ACCEPTED" via status badges.
