# SkillSpill Wireframe Storyboards

This document contains low-fidelity UI Storyboard mockups specifically tailored to the **SkillSpill Codebase**. 

These diagrams replicate a wireframe sketching style (using **S** for Static Labels, **T** for Text Boxes, **B** for Buttons, and **I** for Images), exactly matching standard UI/UX wireframing conventions. Each screen is accompanied by a legend detailing the elements.

## 1. Log In Screen

```mermaid
flowchart TD
    classDef elem fill:#fff,stroke:#000,stroke-width:1px,color:#000

    subgraph Screen ["Log in Screen"]
        direction TB
        S1["S1: Welcome Back to SkillSpill"]
        
        subgraph R1 [" "]
            direction LR
            S2["S2: Email Address"] --- T1["T1: Enter Email"]
        end
        subgraph R2 [" "]
            direction LR
            S3["S3: Password"] --- T2["T2: Enter Password"]
        end
        
        B1["B1: Log in to Account"]
        B2["B2: Continue with GitHub"]
        
        S1 --- R1
        R1 --- R2
        R2 --- B1
        B1 --- B2
    end
    
    Legend["<b>Legend:</b><br/>S1: Static Label (Header)<br/>S2-S3: Static Labels<br/>T1-T2: Text Boxes<br/>B1: Button (Primary)<br/>B2: Button (OAuth)"]
    
    Screen --- Legend

    class S1,S2,T1,S3,T2,B1,B2,Legend elem
    
    style Screen fill:#fff,stroke:#000,stroke-width:3px
    style R1 fill:none,stroke:none
    style R2 fill:none,stroke:none
    style Legend text-align:left
```

## 2. Talent Sign Up Screen (`/signup/talent`)

```mermaid
flowchart TD
    classDef elem fill:#fff,stroke:#000,stroke-width:1px,color:#000

    subgraph Screen ["Talent Sign Up Screen"]
        direction TB
        S4["S4: Register as Talent"]
        
        subgraph R1 [" "]
            direction LR
            S5["S5: Full Name"] --- T3["T3: Enter Name"]
        end
        subgraph R2 [" "]
            direction LR
            S6["S6: Email Address"] --- T4["T4: Enter Email"]
        end
        subgraph R3 [" "]
            direction LR
            S7["S7: Password"] --- T5["T5: Create Password"]
        end
        subgraph R4 [" "]
            direction LR
            S8["S8: GitHub Username"] --- T6["T6: Enter Username"]
        end
        subgraph R5 [" "]
            direction LR
            S9["S9: Short Bio"] --- T7["T7: Tell us about yourself"]
        end
        
        B4["B4: Register Account"]
        
        S4 --- R1
        R1 --- R2
        R2 --- R3
        R3 --- R4
        R4 --- R5
        R5 --- B4
    end
    
    Legend["<b>Legend:</b><br/>S4: Static Label (Header)<br/>S5-S9: Static Labels<br/>T3-T7: Text Boxes<br/>B4: Button (Submit)"]
    
    Screen --- Legend

    class S4,S5,T3,S6,T4,S7,T5,S8,T6,S9,T7,B4,Legend elem

    style Screen fill:#fff,stroke:#000,stroke-width:3px
    style R1 fill:none,stroke:none
    style R2 fill:none,stroke:none
    style R3 fill:none,stroke:none
    style R4 fill:none,stroke:none
    style R5 fill:none,stroke:none
    style Legend text-align:left
```

## 3. Spill Feed Screen (`/feed`)

```mermaid
flowchart TD
    classDef elem fill:#fff,stroke:#000,stroke-width:1px,color:#000

    subgraph Screen ["Spill Feed Screen"]
        direction TB
        
        subgraph TopBar [" "]
            direction LR
            B5["B5: Sidebar Menu"] ~~~ S11["S11: SkillSpill Feed"]
        end
        
        subgraph CreatePost [" "]
            direction LR
            I1["I1: Your Avatar"] --- T8["T8: What's on your mind?"] --- B6["B6: Post"]
        end
        
        subgraph FeedPost [" "]
            direction TB
            subgraph PostHeader [" "]
                direction LR
                I2["I2: Author Avatar"] --- S12["S12: Author Name"]
            end
            S13["S13: Post Content / Description"]
            subgraph PostActions [" "]
                direction LR
                B7["B7: Like (Heart)"] ~~~ B8["B8: Comment"]
            end
            PostHeader --- S13
            S13 --- PostActions
        end
        
        TopBar --- CreatePost
        CreatePost --- FeedPost
    end
    
    Legend["<b>Legend:</b><br/>S11-S13: Static Labels<br/>I1-I2: Image Boxes (Avatars)<br/>T8: Text Box (Post Input)<br/>B5: Button (Menu Navigation)<br/>B6: Button (Submit Post)<br/>B7-B8: Buttons (Social Actions)"]
    
    Screen --- Legend

    class B5,S11,I1,T8,B6,I2,S12,S13,B7,B8,Legend elem
    
    style Screen fill:#fff,stroke:#000,stroke-width:3px
    style TopBar fill:none,stroke:none
    style CreatePost fill:none,stroke:none
    style FeedPost fill:none,stroke:#000,stroke-dasharray: 5 5
    style PostHeader fill:none,stroke:none
    style PostActions fill:none,stroke:none
    style Legend text-align:left
```
