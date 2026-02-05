# Phase 7: Pixel Art Styling & Settings Screen

## Overview

This phase enhances the visual identity of GYLR with authentic pixel art styling and creates a functional Settings screen where users can sign out, change judge personality, and manage their data.

**Note**: The original Phase 7 (Judgment Display) was completed during Phases 5-6. This phase combines original Phase 8 (Pixel Art Styling) with Settings screen functionality from Phase 9.

---

## Prerequisites

- Phase 6 completed (Claude API integration)
- All three screens exist (Calendar, Life, Settings)
- Color palette and PixelButton already implemented

---

## Tasks

### Task 1: Install and Configure Pixel Font

Install and configure a pixel-style font for the retro aesthetic.

**Font Options:**
- Press Start 2P (Google Fonts)
- VT323
- Silkscreen
- Or use system fonts with pixel-like styling

**Implementation:**
```bash
npx expo install expo-font @expo-google-fonts/press-start-2p
```

**Usage:**
- Use pixel font for headers and buttons
- Keep readable fonts for body text (longer content)
- Create font utility for consistent usage

---

### Task 2: Create PixelCard Component

Create a reusable card component with pixel art borders.

**Features:**
- Chunky pixel-style border (3-4px)
- Inner shadow/highlight effect
- Multiple variants (default, highlighted, error)
- Optional header section

**Visual Style:**
```
┌──────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  ← Highlight edge
│▓                    ░│
│▓    Content Area    ░│
│▓                    ░│
│░░░░░░░░░░░░░░░░░░░░░░│  ← Shadow edge
└──────────────────────┘
```

---

### Task 3: Create Pixel Art Category Icons

Create or configure pixel-style icons for each category.

**Categories:**
| Category | Icon Concept | Emoji Fallback |
|----------|--------------|----------------|
| Work | Briefcase/Computer | 💼 |
| Play | Game controller | 🎮 |
| Health | Heart/Dumbbell | 💪 |
| Romance | Heart/Rose | 💕 |
| Study | Book/Graduation cap | 📚 |

**Implementation Options:**
1. Use emoji with pixel-style container
2. Use icon library with pixelated styling
3. Create custom SVG pixel icons

---

### Task 4: Create Judge Character Sprites

Create visual representations for each judge personality.

**Personalities:**
| Personality | Visual | Description |
|-------------|--------|-------------|
| Sarcastic Friend | 😏 | Smirking face, casual pose |
| Cruel Comedian | 🎭 | Comedy/tragedy mask |
| Disappointed Parent | 😔 | Crossed arms, sighing |

**Implementation:**
- Use emoji in pixel-style frames as MVP
- Design simple 32x32 or 64x64 pixel sprites (future)
- Create speaking/idle animation states (future)

---

### Task 5: Build Settings Screen

Create the Settings screen with all configuration options.

**Sections:**

#### Account Section
- Google account info display (email, profile picture)
- Sign Out button

#### Judge Settings
- Personality picker (radio buttons or cards)
- Preview of selected personality

#### Data Management
- Clear category cache button
- Clear judgment cache button
- "About categorization" info text

#### App Info
- App version
- "Powered by Claude" attribution
- Link to privacy policy (placeholder)
- Link to give feedback

**Layout:**
```
┌─────────────────────────┐
│      ⚙️ Settings        │
├─────────────────────────┤
│ 📧 user@email.com       │
│ [Sign Out]              │
├─────────────────────────┤
│ 🎭 Judge Personality    │
│ ○ 😏 Sarcastic Friend   │
│ ● 🎭 Cruel Comedian     │
│ ○ 😔 Disappointed Parent│
├─────────────────────────┤
│ 🗑️ Data                 │
│ [Clear Category Cache]  │
│ [Clear All Data]        │
├─────────────────────────┤
│ ℹ️ About                │
│ Version 1.0.0           │
│ Powered by Claude       │
└─────────────────────────┘
```

---

### Task 6: Create PersonalityPicker Component

Create a reusable component for selecting judge personality.

**Features:**
- Card-style selection (not dropdown)
- Shows personality icon, name, and description
- Visual feedback for selected state
- Pixel art border style

**Props:**
```typescript
interface PersonalityPickerProps {
  selected: JudgePersonality;
  onSelect: (personality: JudgePersonality) => void;
}
```

---

### Task 7: Enhance Existing Components with Pixel Styling

Update existing components with more pixel art flair.

**Components to update:**
- `CategoryBadge` - Add pixel border style
- `TimePeriodSelector` - Pixel button style
- `CategoryLegend` - Pixel card container
- `StatsSummary` - Enhance borders
- `JudgmentCard` - Add judge sprite area

**Style Updates:**
- Sharper corners (borderRadius: 2-4)
- Thicker borders (3-4px)
- Hard shadows (no blur)
- High contrast colors

---

### Task 8: Add Sign Out Functionality

Implement complete sign out flow.

**Steps:**
1. Clear access token from Redux
2. Clear refresh token from secure storage
3. Clear persisted categories (optional - ask user)
4. Navigate to auth/login screen
5. Show confirmation before sign out

**Confirmation Dialog:**
```
┌─────────────────────────┐
│    Sign Out?            │
│                         │
│ Your categorizations    │
│ will be kept locally.   │
│                         │
│ [Cancel]  [Sign Out]    │
└─────────────────────────┘
```

---

## File Structure

```
src/
├── components/
│   ├── PixelCard.tsx           # NEW: Reusable pixel-style card
│   ├── PersonalityPicker.tsx   # NEW: Personality selection
│   ├── SettingsRow.tsx         # NEW: Settings list row
│   └── [existing components]   # UPDATED: Pixel styling
├── screens/
│   └── SettingsScreen.tsx      # UPDATED: Full implementation
├── constants/
│   └── fonts.ts                # NEW: Font configuration
└── hooks/
    └── useFonts.ts             # NEW: Font loading hook
```

---

## Design Specifications

### Pixel Art Border Style

```typescript
const pixelBorder = {
  borderWidth: 3,
  borderRadius: 2,
  borderColor: colors.border,
  // Top-left highlight
  borderTopColor: colors.bgTertiary,
  borderLeftColor: colors.bgTertiary,
  // Bottom-right shadow
  borderBottomColor: '#1A1520',
  borderRightColor: '#1A1520',
};
```

### Hard Shadow Style

```typescript
const pixelShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 0.5,
  shadowRadius: 0, // Key: no blur for pixel effect
  elevation: 4,
};
```

### Typography Scale

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Screen Title | Pixel | 18px | Bold |
| Section Title | System | 12px | Bold + Uppercase |
| Body Text | System | 14px | Regular |
| Button Text | Pixel | 12px | Bold |
| Caption | System | 11px | Regular |

---

## Color Usage Guide

| Element | Color | Hex |
|---------|-------|-----|
| Card Background | bgSecondary | #3D2944 |
| Card Border | border | #5D4954 |
| Card Highlight | bgTertiary | #4A3550 |
| Card Shadow | - | #1A1520 |
| Selected State | accent | #FFD93D |
| Danger Action | error | #E85D75 |

---

## Settings State Management

Add to `settingsSlice.ts`:

```typescript
// Actions needed
- setJudgePersonality(personality)  // Already exists
- clearAuth()                        // Sign out
- resetSettings()                    // Clear all settings

// Selectors needed
- selectUserEmail()
- selectUserProfilePicture()
```

---

## Testing Checklist

- [ ] Pixel font loads correctly
- [ ] Font fallback works if loading fails
- [ ] PixelCard renders with correct borders
- [ ] Personality picker updates Redux state
- [ ] Sign out clears tokens and navigates correctly
- [ ] Clear cache buttons work
- [ ] All components have consistent pixel styling
- [ ] UI looks good on both iOS and Android

---

## Accessibility Notes

1. **Font Legibility**: Pixel fonts can be hard to read
   - Only use for short text (headers, buttons)
   - Keep body text in system font
   - Ensure sufficient contrast

2. **Touch Targets**: Pixel buttons should still be
   - Minimum 44x44 points
   - Have adequate spacing

3. **Color Contrast**: Verify WCAG compliance
   - Text on bgPrimary: ✓
   - Text on bgSecondary: ✓

---

## Success Criteria

1. App has distinct pixel art visual identity
2. Settings screen is fully functional
3. User can change judge personality
4. User can sign out successfully
5. Components have consistent pixel styling
6. Typography uses pixel font appropriately
7. All existing functionality still works
