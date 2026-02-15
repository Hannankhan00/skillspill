# SkillSpill Design System

## 1. Overview
SkillSpill is a futuristic, high-tech platform connecting talent with recruiters through a gamified, "hacker/bounty hunter" aesthetic. The design language emphasizes dark modes, neon accents, and data-rich interfaces.

## 2. Color Palette

### Primary Colors
- **Cyber Green (Primary/Talent):** `#3CF91A` (Vibrant neon lime green)
- **Deep Void (Background):** `#050505` (Almost black, high contrast)
- **Hollow Gray (Surface):** `#121212` (Card backgrounds)

### Secondary Colors
- **Neon Purple (Recruiter/Secondary):** `#A855F7` (Complementary to green, used for recruiter flow)
- **Electric Blue (Info/Tech):** `#00D2FF`
- **Alert Red (Error/Danger):** `#FF003C`
- **Warning Yellow:** `#FNEE00`

### Gradients
- **Talent Gradient:** `linear-gradient(135deg, #3CF91A 0%, #00B8FF 100%)`
- **Recruiter Gradient:** `linear-gradient(135deg, #A855F7 0%, #00D2FF 100%)`
- **Glass Effect:** `rgba(255, 255, 255, 0.05)` with backdrop-blur

## 3. Typography

### Headings
- **Font Family:** 'Space Grotesk' (Google Fonts)
- **Style:** Bold, tight letter spacing for headers.
- **Weights:** 700 (Bold), 900 (Black)

### Body
- **Font Family:** 'Space Grotesk' (Clean, readable and modern)
- **Weights:** 400 (Regular), 600 (SemiBold)

### Code / Data
- **Font Family:** 'JetBrains Mono' or 'Fira Code'
- **Use Cases:** Skill tags, bounty amounts, code snippets, analytics data.

## 4. UI Components

### Buttons
- **Primary:** Solid Neon Green background, Black text, sharp corners or slightly chamfered.
- **Secondary:** Transparent background, Neon Green border, glow effect on hover.
- **Ghost:** Minimal, text-only with underline animation.

### Cards & Panels
- **Style:** Glassmorphism (dark tint), 1px border with slight gradient or glow.
- **Hover:** Border brightness increases, subtle "lift" effect.

### Inputs
- **Style:** "Terminal" style. Dark background, neon bottom border, monospaced input text.
- **Validation:** Glows red on error, green on success.

### Data Visualization
- **Charts:** Thin lines, neon strokes, dark fill opacity.
- **Leaderboards:** High contrast rows, glowing avatars for top ranks.

## 5. Iconography
- **Style:** Thin stroke, futuristic, geometric (e.g., Lucide React or Heroicons with custom styling).

## 6. Layout & Spacing
- **Grid System:** 12-column fluid grid.
- **Spacing:** Multiples of 4px (0.25rem). Ample whitespace to avoid clutter despite "data-heavy" look.
- **Sidebar:** collapsible, icon-heavy navigation.

## 7. Animations
- **Micro-interactions:** Hover glows, button clicks (ripple), input focus (border expand).
- **Page Transitions:** Fade in + Slide up.
- **Loading:** Glitch effect or terminal typing sequence.

## 8. Development Guidelines

### Directory Structure
```
src/
├── components/
│   ├── ui/           # Reusable primitives (Buttons, Inputs, Cards)
│   ├── layout/       # Headers, Sidebars, Footers
│   └── features/     # Feature-specific components (BountyCard, TalentProfile)
├── lib/
│   ├── utils.ts      # Helper functions (cn, formatters)
│   └── constants.ts  # Global constants
├── styles/           # Additional CSS if needed
└── app/              # Next.js App Router pages
```

### Class Naming
- Use standard Tailwind utility classes.
- For complex repeated styles, use `@apply` in CSS or extract to a component.
