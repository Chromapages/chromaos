# Design System: ChromaOS Premium

This document serves as the visual source of truth for the ChromaOS CRM redesign, synthesized from high-end modern dashboard aesthetics.

## 1. Visual Theme & Atmosphere
**Vibe:** Sophisticated, Airy, and High-Contrast.
The design focuses on a clean "Bento Grid" layout with generous whitespace. It uses a dark, professional sidebar contrasted against a very light, clinical workspace area, punctuated by a vibrant mint-accented primary brand color.

## 2. Color Palette & Roles

| Role | Descriptive Name | Hex Code | Purpose |
|------|------------------|----------|---------|
| **Primary** | Electric Mint | `#BCFEE8` | Primary actions, active states, brand highlights. |
| **Surface** | Pure Snow | `#FFFFFF` | Card backgrounds, elevated surfaces. |
| **App Background** | Soft Slate Wash | `#F8F9FB` | Main application background and grouping containers. |
| **Sidebar** | Deep Onyx | `#111111` | Primary navigation background for high contrast. |
| **Text (Primary)** | Midnight | `#111827` | Main headings and high-priority content. |
| **Text (Muted)** | Dusty Graphite | `#6B7280` | Secondary information, labels, and metadata. |
| **Success** | Emerald Glow | `#10B981` | Positive trends, active statues. |

## 3. Typography Rules
**Font Family:** Geist Sans / Inter (Clean, neutral geometric sans-serif)
- **Headings:** Bold weight, tight tracking (`tight`), Midnight color.
- **Body:** Regular/Medium weight, `1.5` line height for maximum readability.
- **Micro-copy:** Uppercase, Bold, `tracking-wider` for labels and headers within cards.

## 4. Component Stylings

### **Sidebar Navigation**
- **Shape:** Rounded-lg items within a vertical stack.
- **Active State:** Electric Mint (`#BCFEE8`) background with Deep Onyx (`#111111`) text/icons.
- **Density:** Spacious, with internal padding and clear separation between groups.

### **Cards (Stat & Content)**
- **Shape:** Generously rounded corners (`2rem` / `rounded-3xl`).
- **Surface:** Pure Snow (`#FFFFFF`) with no visible border in high-contrast mode, or a whisper-soft hairline border (`#F1F5F9`).
- **Shadow:** Flat or extremely subtle diffused shadow (`shadow-sm`) to maintain a clean aesthetic.

### **Inputs & Buttons**
- **Rounding:** Pill-shaped (`rounded-full`) or highly rounded.
- **Primary Button:** Electric Mint background, bold dark text.
- **Ghost Button:** Subtle hover background (`#F3F4F6`), used for secondary actions.

## 5. Layout Principles
- **Grid:** Bento Grid approach using Tailwind's `grid-cols`.
- **Spacing:** Large gaps (`gap-8`) between major sections to emphasize the "Airy" mood.
- **Margins:** Consistent inner padding (`p-6` to `p-8`) within all containers.
- **Alignment:** Strict left-alignment for text, with icon-centric visual hooks for quick scanning.
