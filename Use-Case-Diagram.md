# SkillSpill Use Case Diagram

This document presents a professional, minimalist use case diagram for the SkillSpill platform. It identifies the actors and their key interactions in a clean black-and-white format.

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
    'actorBkg': '#ffffff',
    'actorBorder': '#000000',
    'actorLineColor': '#000000',
    'actorTextColor': '#000000',
    'usecaseBkg': '#ffffff',
    'usecaseBorder': '#000000',
    'usecaseTextColor': '#000000'
  }
} }%%
graph LR
    subgraph Users
        T[Talent]
        R[Recruiter]
        A[Admin]
    end

    subgraph "SkillSpill Platform"
        UC1((Sign Up / Login))
        UC2((Manage Profile))
        UC3((Post Bounty))
        UC4((Apply for Bounty))
        UC5((Review Applications))
        UC6((Moderate Users))
        UC7((Track Status))
        UC8((Connect GitHub))
    end

    %% Relations
    T --- UC1
    T --- UC2
    T --- UC8
    T --- UC4
    T --- UC7

    R --- UC1
    R --- UC2
    R --- UC3
    R --- UC5

    A --- UC1
    A --- UC6
```


## Detailed Use Case Descriptions

### 1. Authentication & Onboarding
*   **Sign Up / Log In**: Users can create an account as either Talent or Recruiter or log in using existing credentials.
*   **Verify Email**: A security step to ensure the validity of the user's email address.

### 2. Talent Functionalities
*   **Manage Talent Profile**: Updating biography, experience level, portfolio links, and resume.
*   **Connect GitHub**: Integration to fetch repositories and star counts to prove technical proficiency.
*   **View Skill Tree**: Visualize verified skills and progress within the platform.
*   **Search & View Bounties**: Browse available "bounties" (job/project listings) with neon-themed UI.
*   **Apply for Bounty**: Submit application details and cover letters for specific opportunities.
*   **Track Application Status**: Monitor if an application is Pending, Reviewed, Shortlisted, Rejected, or Accepted.

### 3. Recruiter Functionalities
*   **Manage Recruiter Profile**: Setting up company name, size, website, and industry.
*   **Create Bounty**: Posting new work opportunities with requirements, rewards, and deadlines.
*   **Manage Bounties**: Editing active bounties or changing their status (Open, Completed, etc.).
*   **Review Applications**: Processing submissions from Talent, including shortlisting or rejecting candidates.
*   **Search Talent Profiles**: Proactively looking for potential candidates based on skills and experience.

### 4. Administrative & Shared Functionalities
*   **Moderate Users**: Admins can suspend users who violate platform policies.
*   **Review Appeals**: Handling requests from suspended users to regain access.
*   **View Notifications**: Real-time alerts for application updates, new bounties, or system messages.
*   **Appeal Suspension**: Standard process for any user to contest a platform-wide action.
