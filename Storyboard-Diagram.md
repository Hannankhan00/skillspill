# SkillSpill Storyboard Diagram (User Flow)

This document presents a UI Storyboard (User Flow) Diagram for the SkillSpill platform. 

A storyboard diagram visually represents the sequence of graphical User Interface (UI) screens a user navigates through to accomplish a specific goal. This specific storyboard illustrates the **Talent User Journey**: from arriving at the site to successfully applying for a Bounty.

## Storyboard Flowchart

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
    classDef screen fill:#fff,stroke:#000,stroke-width:2px;
    classDef modal fill:#f4f4f4,stroke:#000,stroke-width:2px,stroke-dasharray: 5 5;
    classDef action fill:none,stroke:none,color:#000;

    %% Screen Definitions & Classification
    subgraph "Public / Entry"
        Screen1["<b>[ Screen 1 ]</b><br/>SkillSpill Landing Page<br/><i>Hero section with neon aesthetic</i><br/>[ Login / Sign Up ] [ Explore Bounties ]"] :::screen
        Screen2["<b>[ Screen 2 ]</b><br/>Authentication Modal<br/><i>Email / Password Inputs</i><br/>[ Authenticate via GitHub ]<br/>[ Log In ]"] :::modal
    end

    subgraph "Main Application (Talent Hub)"
        Screen3["<b>[ Screen 3 ]</b><br/>Talent Dashboard<br/><i>Sidebar Navigation | Main Feed</i><br/>[ Bounty Card: React Developer ]<br/>[ Bounty Card: Smart Contract ]"] :::screen
    end

    subgraph "Bounty Interaction Flow"
        Screen4["<b>[ Screen 4 ]</b><br/>Bounty Details View<br/><i>Full description, requirements, reward</i><br/>[ Apply Now ] [ Save for Later ]"] :::screen
        Screen5["<b>[ Screen 5 ]</b><br/>Application Form Modal<br/><i>Cover Letter Textarea / GitHub Select</i><br/>[ Submit Application ] [ Cancel ]"] :::modal
    end
    
    subgraph "Post-Action Tracking"
        Screen6["<b>[ Screen 6 ]</b><br/>Success Tracking View<br/><i>'My Applications' Tab</i><br/>Status: [ PENDING ]"] :::screen
    end

    %% Flow UI Actions
    Screen1 -- "User clicks [ Login / Sign Up ]" --> Screen2
    Screen2 -- "User enters credentials & Clicks [ Log In ]" --> Screen3
    Screen3 -- "User scrolls and clicks [ Bounty Card ]" --> Screen4
    Screen4 -- "User decides to apply and clicks [ Apply Now ]" --> Screen5
    Screen5 -- "User types pitch and clicks [ Submit Application ]" --> Screen6

    %% Helper Notes
    note1>Toast Notification:<br/>'Application Submitted Successfully!']
    Screen5 -.-> note1
    note1 -.-> Screen6
```

## Screen Descriptions

1.  **Screen 1 - Landing Page:** The initial impression of the SkillSpill platform. It features the primary brand messaging, futuristic glassmorphism design, and clear call-to-actions to funnel users into the onboarding process.
2.  **Screen 2 - Authentication Modal:** A popup overlay where users can create an account or log in. It includes options for traditional email/password login as well as rapid OAuth login (like GitHub), which is highly relevant for the Talent user base.
3.  **Screen 3 - Talent Dashboard:** The core hub for authenticated Talent. The UI displays an endless feed or grid of available Bounties (jobs). Each card provides a high-level summary (Title, Reward, Tech Stack).
4.  **Screen 4 - Bounty Details View:** Once a Bounty Card is clicked, the UI expands to show a dedicated page or full-screen modal. The user can read the complete requirements and evaluate the specific criteria before deciding to apply.
5.  **Screen 5 - Application Form Modal:** An active input state overlay. The Talent writes their cover letter/pitch here. The UI might optionally autofill their verified tools or GitHub links to streamline the application process.
6.  **Screen 6 - Success Tracking View:** Post-submission, the user is redirected to a dashboard tab (e.g., "My Applications") where they can visually track the timeline of their submission moving from "PENDING" to "ACCEPTED" via status badges.
