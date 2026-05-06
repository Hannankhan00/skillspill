# Admin Module - Wireframe Storyboards

This document contains the low-fidelity UI wireframes for the **Admin** screens within the SkillSpill application.

## 1. Admin Dashboard (`/admin/dashboard`)

```mermaid
flowchart TD
    classDef elem fill:#fff,stroke:#000,stroke-width:1px,color:#000

    subgraph Screen ["Admin Dashboard"]
        direction TB
        
        subgraph TopBar [" "]
            direction LR
            S1["S1: Admin Overview"] ~~~ B1["B1: Logout Admin"]
        end
        
        subgraph StatsRow [" "]
            direction LR
            S2["S2: Total Users: 1,240"] ~~~ S3["S3: Active Jobs: 56"] ~~~ S4["S4: Pending Reports: 8"]
        end
        
        subgraph QuickActions [" "]
            direction LR
            B2["B2: Manage Users"] ~~~ B3["B3: Review Appeals"] ~~~ B4["B4: View System Logs"]
        end
        
        TopBar --- StatsRow
        StatsRow --- QuickActions
    end
    
    Legend["<b>Legend:</b><br/>S1-S4: Static Labels (Dashboard Metrics)<br/>B1-B4: Buttons (Navigation)"]
    
    Screen --- Legend

    class S1,B1,S2,S3,S4,B2,B3,B4,Legend elem
    
    style Screen fill:#fff,stroke:#000,stroke-width:3px
    style TopBar fill:none,stroke:none
    style StatsRow fill:none,stroke:#000,stroke-dasharray: 5 5
    style QuickActions fill:none,stroke:none
    style Legend text-align:left
```

## 2. Content Moderation (Reports) Screen (`/admin/reports`)

```mermaid
flowchart TD
    classDef elem fill:#fff,stroke:#000,stroke-width:1px,color:#000

    subgraph Screen ["Moderation (Reports) Screen"]
        direction TB
        S5["S5: Reported Content Queue"]
        
        subgraph ReportCard1 [" "]
            direction TB
            subgraph ReportHeader [" "]
                direction LR
                S6["S6: Reported By: UserX"] --- S7["S7: Reason: Spam"]
            end
            S8["S8: Offending Post: 'Click here for free money...'"]
            subgraph ReportActions [" "]
                direction LR
                B5["B5: Delete Post & Warn User"] ~~~ B6["B6: Dismiss Report"]
            end
            ReportHeader --- S8 --- ReportActions
        end
        
        subgraph ReportCard2 [" "]
            direction TB
            subgraph ReportHeader2 [" "]
                direction LR
                S9["S9: Reported By: UserY"] --- S10["S10: Reason: Harassment"]
            end
            S11["S11: Offending User: TalentZ"]
            subgraph ReportActions2 [" "]
                direction LR
                B7["B7: Suspend User"] ~~~ B8["B8: Dismiss Report"]
            end
            ReportHeader2 --- S11 --- ReportActions2
        end
        
        S5 --- ReportCard1
        ReportCard1 --- ReportCard2
    end
    
    Legend["<b>Legend:</b><br/>S5-S11: Static Labels (Report Details)<br/>B5-B8: Buttons (Moderation Actions)"]
    
    Screen --- Legend

    class S5,S6,S7,S8,B5,B6,S9,S10,S11,B7,B8,Legend elem

    style Screen fill:#fff,stroke:#000,stroke-width:3px
    style ReportCard1 fill:none,stroke:#000
    style ReportHeader fill:none,stroke:none
    style ReportActions fill:none,stroke:none
    style ReportCard2 fill:none,stroke:#000
    style ReportHeader2 fill:none,stroke:none
    style ReportActions2 fill:none,stroke:none
    style Legend text-align:left
```

## 3. Appeals Management Screen (`/admin/appeals`)

```mermaid
flowchart TD
    classDef elem fill:#fff,stroke:#000,stroke-width:1px,color:#000

    subgraph Screen ["Appeals Management Screen"]
        direction TB
        S12["S12: Suspension Appeals Queue"]
        
        subgraph AppealCard [" "]
            direction TB
            subgraph AppealHeader [" "]
                direction LR
                I1["I1: Avatar"] --- S13["S13: Suspended User: John Doe"]
            end
            S14["S14: Appeal Message: 'My account was hacked, I apologize...'"]
            subgraph AppealActions [" "]
                direction LR
                B9["B9: Approve & Restore Account"] ~~~ B10["B10: Reject (Keep Suspended)"]
            end
            AppealHeader --- S14 --- AppealActions
        end
        
        S12 --- AppealCard
    end
    
    Legend["<b>Legend:</b><br/>S12-S14: Static Labels<br/>I1: Image Box<br/>B9-B10: Buttons (Resolution Actions)"]
    
    Screen --- Legend

    class S12,I1,S13,S14,B9,B10,Legend elem

    style Screen fill:#fff,stroke:#000,stroke-width:3px
    style AppealCard fill:none,stroke:#000
    style AppealHeader fill:none,stroke:none
    style AppealActions fill:none,stroke:none
    style Legend text-align:left
```
