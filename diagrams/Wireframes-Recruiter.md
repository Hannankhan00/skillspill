# Recruiter Module - Wireframe Storyboards

This document contains the low-fidelity UI wireframes for the **Recruiter** screens within the SkillSpill application.

## 1. Recruiter Dashboard (`/recruiter/dashboard`)

```mermaid
flowchart TD
    classDef elem fill:#fff,stroke:#000,stroke-width:1px,color:#000

    subgraph Screen ["Recruiter Dashboard"]
        direction TB
        
        subgraph TopBar [" "]
            direction LR
            S1["S1: Recruiter Dashboard"] ~~~ B1["B1: Post New Job"]
        end
        
        subgraph StatsRow [" "]
            direction LR
            S2["S2: Total Jobs: 4"] ~~~ S3["S3: Pending Applicants: 12"]
        end
        
        subgraph JobCard1 [" "]
            direction LR
            S4["S4: Job: Frontend Dev"] ~~~ B2["B2: View Applicants (5)"] ~~~ B3["B3: Edit/Close Job"]
        end
        
        subgraph JobCard2 [" "]
            direction LR
            S5["S5: Job: Smart Contract"] ~~~ B4["B4: View Applicants (7)"] ~~~ B5["B5: Edit/Close Job"]
        end
        
        TopBar --- StatsRow
        StatsRow --- JobCard1
        JobCard1 --- JobCard2
    end
    
    Legend["<b>Legend:</b><br/>S1-S5: Static Labels (Headers & Details)<br/>B1: Button (Call to Action)<br/>B2-B5: Buttons (Job Management)"]
    
    Screen --- Legend

    class S1,B1,S2,S3,S4,B2,B3,S5,B4,B5,Legend elem
    
    style Screen fill:#fff,stroke:#000,stroke-width:3px
    style TopBar fill:none,stroke:none
    style StatsRow fill:none,stroke:#000,stroke-dasharray: 5 5
    style JobCard1 fill:none,stroke:#000
    style JobCard2 fill:none,stroke:#000
    style Legend text-align:left
```

## 2. Post a Job Screen (`/recruiter/jobs/create`)

```mermaid
flowchart TD
    classDef elem fill:#fff,stroke:#000,stroke-width:1px,color:#000

    subgraph Screen ["Post a Job Screen"]
        direction TB
        S6["S6: Create a New Job"]
        
        subgraph R1 [" "]
            direction LR
            S7["S7: Job Title"] --- T1["T1: Enter Job Title"]
        end
        subgraph R2 [" "]
            direction LR
            S8["S8: Job Description"] --- T2["T2: Enter detailed description..."]
        end
        subgraph R3 [" "]
            direction LR
            S9["S9: Required Skills"] --- T3["T3: e.g., React, Prisma"]
        end
        subgraph R4 [" "]
            direction LR
            S10["S10: Reward / Budget"] --- T4["T4: Enter Amount ($)"]
        end
        
        B6["B6: Publish Job"]
        B7["B7: Save as Draft"]
        
        S6 --- R1
        R1 --- R2
        R2 --- R3
        R3 --- R4
        R4 --- B6
        B6 --- B7
    end
    
    Legend["<b>Legend:</b><br/>S6-S10: Static Labels<br/>T1-T4: Text Boxes (Form Inputs)<br/>B6-B7: Buttons (Form Submission)"]
    
    Screen --- Legend

    class S6,S7,T1,S8,T2,S9,T3,S10,T4,B6,B7,Legend elem

    style Screen fill:#fff,stroke:#000,stroke-width:3px
    style R1 fill:none,stroke:none
    style R2 fill:none,stroke:none
    style R3 fill:none,stroke:none
    style R4 fill:none,stroke:none
    style Legend text-align:left
```

## 3. Review Applicants Screen (`/recruiter/applications`)

```mermaid
flowchart TD
    classDef elem fill:#fff,stroke:#000,stroke-width:1px,color:#000

    subgraph Screen ["Review Applicants Screen"]
        direction TB
        S11["S11: Applicants for 'Frontend Dev'"]
        
        subgraph Filters [" "]
            direction LR
            B8["B8: Pending"] ~~~ B9["B9: Accepted"] ~~~ B10["B10: Rejected"]
        end
        
        subgraph ApplicantCard1 [" "]
            direction TB
            subgraph AppHeader [" "]
                direction LR
                I1["I1: Avatar"] --- S12["S12: Name: Alice (Talent)"] --- B11["B11: View Profile"]
            end
            S13["S13: Cover Letter: 'I am highly experienced in...'"]
            subgraph AppActions [" "]
                direction LR
                B12["B12: Accept Talent"] ~~~ B13["B13: Reject"] ~~~ B14["B14: Message"]
            end
            AppHeader --- S13 --- AppActions
        end
        
        S11 --- Filters
        Filters --- ApplicantCard1
    end
    
    Legend["<b>Legend:</b><br/>S11-S13: Static Labels<br/>I1: Image Box (Avatar)<br/>B8-B10: Buttons (Tabs)<br/>B11-B14: Buttons (Applicant Actions)"]
    
    Screen --- Legend

    class S11,B8,B9,B10,I1,S12,B11,S13,B12,B13,B14,Legend elem

    style Screen fill:#fff,stroke:#000,stroke-width:3px
    style Filters fill:none,stroke:none
    style ApplicantCard1 fill:none,stroke:#000
    style AppHeader fill:none,stroke:none
    style AppActions fill:none,stroke:none
    style Legend text-align:left
```

## 4. Recruiter Sign Up Screen (`/signup/recruiter`)

```mermaid
flowchart TD
    classDef elem fill:#fff,stroke:#000,stroke-width:1px,color:#000

    subgraph Screen ["Recruiter Sign Up Screen"]
        direction TB
        S14["S14: Register as Recruiter"]
        
        subgraph R1 [" "]
            direction LR
            S15["S15: Full Name"] --- T5["T5: Enter Name"]
        end
        subgraph R2 [" "]
            direction LR
            S16["S16: Email Address"] --- T6["T6: Enter Work Email"]
        end
        subgraph R3 [" "]
            direction LR
            S17["S17: Password"] --- T7["T7: Create Password"]
        end
        subgraph R4 [" "]
            direction LR
            S18["S18: Company Name"] --- T8["T8: Enter Company"]
        end
        subgraph R5 [" "]
            direction LR
            S19["S19: Company Website"] --- T9["T9: Optional URL"]
        end
        
        B15["B15: Create Recruiter Account"]
        
        S14 --- R1
        R1 --- R2
        R2 --- R3
        R3 --- R4
        R4 --- R5
        R5 --- B15
    end
    
    Legend["<b>Legend:</b><br/>S14-S19: Static Labels<br/>T5-T9: Text Boxes (Form Inputs)<br/>B15: Button (Submit)"]
    
    Screen --- Legend

    class S14,S15,T5,S16,T6,S17,T7,S18,T8,S19,T9,B15,Legend elem

    style Screen fill:#fff,stroke:#000,stroke-width:3px
    style R1 fill:none,stroke:none
    style R2 fill:none,stroke:none
    style R3 fill:none,stroke:none
    style R4 fill:none,stroke:none
    style R5 fill:none,stroke:none
    style Legend text-align:left
```
