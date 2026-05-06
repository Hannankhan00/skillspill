# Talent Module - Wireframe Storyboards

This document contains the low-fidelity UI wireframes for the **Talent** screens within the SkillSpill application.

## 1. Spill Feed Screen (`/feed`)

```mermaid
flowchart TD
    classDef elem fill:#fff,stroke:#000,stroke-width:1px,color:#000

    subgraph Screen ["Spill Feed Screen"]
        direction TB
        
        subgraph TopBar [" "]
            direction LR
            B1["B1: Sidebar Menu"] ~~~ S1["S1: SkillSpill Feed"]
        end
        
        subgraph CreatePost [" "]
            direction LR
            I1["I1: Your Avatar"] --- T1["T1: What's on your mind?"] --- B2["B2: Post"]
        end
        
        subgraph FeedPost [" "]
            direction TB
            subgraph PostHeader [" "]
                direction LR
                I2["I2: Author Avatar"] --- S2["S2: Author Name"]
            end
            S3["S3: Post Content / Description"]
            subgraph PostActions [" "]
                direction LR
                B3["B3: Like (Heart)"] ~~~ B4["B4: Comment"]
            end
            PostHeader --- S3
            S3 --- PostActions
        end
        
        TopBar --- CreatePost
        CreatePost --- FeedPost
    end
    
    Legend["<b>Legend:</b><br/>S1-S3: Static Labels<br/>I1-I2: Image Boxes (Avatars)<br/>T1: Text Box (Post Input)<br/>B1: Button (Menu Navigation)<br/>B2: Button (Submit Post)<br/>B3-B4: Buttons (Social Actions)"]
    
    Screen --- Legend

    class B1,S1,I1,T1,B2,I2,S2,S3,B3,B4,Legend elem
    
    style Screen fill:#fff,stroke:#000,stroke-width:3px
    style TopBar fill:none,stroke:none
    style CreatePost fill:none,stroke:none
    style FeedPost fill:none,stroke:#000,stroke-dasharray: 5 5
    style PostHeader fill:none,stroke:none
    style PostActions fill:none,stroke:none
    style Legend text-align:left
```

## 2. Job Board Screen (`/talent/jobs`)

```mermaid
flowchart TD
    classDef elem fill:#fff,stroke:#000,stroke-width:1px,color:#000

    subgraph Screen ["Job Board Screen"]
        direction TB
        
        subgraph TopBar [" "]
            direction LR
            S4["S4: Explore Jobs"] ~~~ B5["B5: Notifications"]
        end
        
        subgraph SearchBar [" "]
            direction LR
            T2["T2: Search by Title or Skill"] --- B6["B6: Search/Filter"]
        end
        
        subgraph JobCard1 [" "]
            direction TB
            S5["S5: Job Title (e.g. React Developer)"]
            S6["S6: Reward / Budget"]
            B7["B7: View Details & Apply"]
            S5 --- S6 --- B7
        end
        
        subgraph JobCard2 [" "]
            direction TB
            S7["S7: Job Title (e.g. Node.js Backend)"]
            S8["S8: Reward / Budget"]
            B8["B8: View Details & Apply"]
            S7 --- S8 --- B8
        end
        
        TopBar --- SearchBar
        SearchBar --- JobCard1
        JobCard1 --- JobCard2
    end
    
    Legend["<b>Legend:</b><br/>S4-S8: Static Labels (Titles & Details)<br/>T2: Text Box (Search Input)<br/>B5-B8: Clickable Buttons"]
    
    Screen --- Legend

    class S4,B5,T2,B6,S5,S6,B7,S7,S8,B8,Legend elem
    
    style Screen fill:#fff,stroke:#000,stroke-width:3px
    style TopBar fill:none,stroke:none
    style SearchBar fill:none,stroke:none
    style JobCard1 fill:none,stroke:#000
    style JobCard2 fill:none,stroke:#000
    style Legend text-align:left
```

## 3. Search Screen (`/search`)

```mermaid
flowchart TD
    classDef elem fill:#fff,stroke:#000,stroke-width:1px,color:#000

    subgraph Screen ["Global Search Screen"]
        direction TB
        
        subgraph SearchHeader [" "]
            direction LR
            T3["T3: Search Users, Jobs, or Posts..."] --- B9["B9: Search"]
        end
        
        subgraph Filters [" "]
            direction LR
            B10["B10: Users Tab"] ~~~ B11["B11: Jobs Tab"] ~~~ B12["B12: Posts Tab"]
        end
        
        subgraph ResultCard [" "]
            direction LR
            I3["I3: Avatar"] --- S9["S9: Name / Title"] --- B13["B13: View Profile"]
        end
        
        SearchHeader --- Filters
        Filters --- ResultCard
    end
    
    Legend["<b>Legend:</b><br/>S9: Static Label (Result Text)<br/>I3: Image Box<br/>T3: Text Box (Search)<br/>B9-B13: Buttons & Tabs"]
    
    Screen --- Legend

    class T3,B9,B10,B11,B12,I3,S9,B13,Legend elem
    
    style Screen fill:#fff,stroke:#000,stroke-width:3px
    style SearchHeader fill:none,stroke:none
    style Filters fill:none,stroke:none
    style ResultCard fill:none,stroke:#000
    style Legend text-align:left
```

## 4. User Profile Screen (`/talent/profile`)

```mermaid
flowchart TD
    classDef elem fill:#fff,stroke:#000,stroke-width:1px,color:#000

    subgraph Screen ["Profile Screen"]
        direction TB
        
        subgraph ProfileHeader [" "]
            direction TB
            I4["I4: Profile Image"]
            S10["S10: Full Name & Username"]
            S11["S11: Short Bio"]
            B14["B14: Edit Profile"]
            I4 --- S10 --- S11 --- B14
        end
        
        subgraph SkillsSection [" "]
            direction TB
            S12["S12: My Skills"]
            S13["S13: React, Node, TypeScript..."]
            S12 --- S13
        end
        
        subgraph GithubSection [" "]
            direction TB
            S14["S14: GitHub Contributions"]
            I5["I5: GitHub Graph / Stats Graphic"]
            S14 --- I5
        end
        
        ProfileHeader --- SkillsSection
        SkillsSection --- GithubSection
    end
    
    Legend["<b>Legend:</b><br/>S10-S14: Static Labels<br/>I4-I5: Images (Avatar & Graph)<br/>B14: Button (Edit)"]
    
    Screen --- Legend

    class I4,S10,S11,B14,S12,S13,S14,I5,Legend elem
    
    style Screen fill:#fff,stroke:#000,stroke-width:3px
    style ProfileHeader fill:none,stroke:none
    style SkillsSection fill:none,stroke:#000
    style GithubSection fill:none,stroke:#000
    style Legend text-align:left
```

## 5. Messaging Screen (`/messages`)

```mermaid
flowchart TD
    classDef elem fill:#fff,stroke:#000,stroke-width:1px,color:#000

    subgraph Screen ["Direct Messaging Screen"]
        direction LR
        
        subgraph Sidebar [" "]
            direction TB
            S15["S15: Conversations"]
            B15["B15: Chat w/ Recruiter A"]
            B16["B16: Chat w/ Talent B"]
            S15 --- B15 --- B16
        end
        
        subgraph ChatArea [" "]
            direction TB
            S16["S16: Chatting with Recruiter A"]
            
            subgraph MessageHistory [" "]
                direction TB
                S17["S17: Bubble (Recruiter): Hi!"]
                S18["S18: Bubble (You): Hello!"]
                S17 --- S18
            end
            
            subgraph ChatInput [" "]
                direction LR
                T4["T4: Type a message..."] --- B17["B17: Send"]
            end
            
            S16 --- MessageHistory --- ChatInput
        end
        
        Sidebar ~~~ ChatArea
    end
    
    Legend["<b>Legend:</b><br/>S15-S18: Static Text & Chat Bubbles<br/>T4: Text Box (Message Input)<br/>B15-B17: Buttons (Chat Select & Send)"]
    
    Screen --- Legend

    class S15,B15,B16,S16,S17,S18,T4,B17,Legend elem
    
    style Screen fill:#fff,stroke:#000,stroke-width:3px
    style Sidebar fill:none,stroke:#000
    style ChatArea fill:none,stroke:#000
    style MessageHistory fill:none,stroke:none
    style ChatInput fill:none,stroke:none
    style Legend text-align:left
```
