# Prompts Page Fixes

## Issues Fixed

### 1. Constraint Level Responsiveness ❌ → ✅
**Problem**: Clicking on strict/moderate/free constraint buttons did nothing - they only copied to clipboard.

**Solution**: 
- Added `useState` to track selected constraint level
- Changed button `onClick` to call `setConstraint(c)` instead of `copyToClipboard`
- Added active state styling with ring highlight
- Changed text from "to copy" to "click to toggle"

### 2. Difficulty Preset Selector ❌ → ✅  
**Problem**: The preset was hardcoded to 'medium' with no way for users to change it.

**Solution**:
- Added `useState` to track selected difficulty (easy/medium/hard)
- Added interactive difficulty selector buttons
- Added active state styling with ring highlight
- Updated system prompts to show selected preset dynamically

### 3. Constraint Rules Visibility ❌ → ✅
**Problem**: Persona constraint rules were only shown as static HTML, not as editable/viewable content.

**Solution**:
- Added dedicated "Constraint Rules" section that displays the currently selected constraint
- Shows dynamic title with selected constraint level (e.g., "Constraint Rules (strict)")
- Pre-rendered content from `PERSONA_CONSTRAINT_RULES[constraint]` which updates on selection
- Added copy button for the constraint rules

## Technical Changes

### New Imports
```typescript
import React from 'react';
```

### New State Variables
```typescript
const [constraint, setConstraint] = React.useState<CONSTRAINT>('moderate');
const [difficulty, setDifficulty] = React.useState<'easy' | 'medium' | 'hard'>('medium');
```

### Updated Components
1. **Constraint Selector**: Now toggles visibility instead of just copying
2. **Difficulty Selector**: New interactive component
3. **Constraint Rules Display**: New section showing active constraint rules
4. **System Prompts**: Unchanged (display Mafia/TOWN role prompts)
5. **Persona Prompts**: Unchanged (display theme information)

## UI Patterns Used
- Active state with ring highlight: `bg-primary ring-2 ring-primary ring-offset-2`
- Hover states: `hover:bg-muted-foreground/80`
- Inline actions: Copy buttons with icons
- Responsive flex layouts

## Files Modified
- `frontend/app/routes/prompts.tsx`