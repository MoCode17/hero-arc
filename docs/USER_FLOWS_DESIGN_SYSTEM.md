# CalorieTracker - User Flows, Wireframes & Design System

---

## 1. Critical User Journey Flows

### 1.1 First-Time User Flow (Acquisition → Activation)

```
┌─────────────────────────────────────────────────────────┐
│ Cold User Lands on App                                  │
│ (Not signed in)                                         │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────────┐
        │ Login / Signup Page      │
        │ - CTA: "Get Started"     │
        │ - Link: "Already have?" │
        └──────────┬───────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
    ┌────────────┐    ┌────────────┐
    │ Login Page │    │ Signup Page │
    └────┬───────┘    └───┬────────┘
         │                 │
         │                 ▼
         │        ┌─────────────────┐
         │        │ Email & Password│
         │        │ Validate input  │
         │        └────┬────────────┘
         │             │
         │             ▼ (success)
         ▼            ┌─────────────────┐
      ┌────────┐      │ Check: User had │
      │Verify  │      │ onboarded?      │
      │Login   │      └─┬────────────┬──┘
      │        │        │            │
      └─┬──────┘        │ No (new)   │ Yes (returning)
        │                ▼           │
        │        ┌──────────────┐    │
        │        │ Onboarding   │    │
        │        │ Flow (7 step)│    │
        │        └──────┬───────┘    │
        │               │            │
        │               ▼            │
        │        ┌──────────────┐    │
        │        │ Calculate    │    │
        │        │ BMR/TDEE     │    │
        │        │ Daily Goal   │    │
        │        └──────┬───────┘    │
        │               │            │
        │               ▼            │
        │        ┌──────────────────┐│
        │        │ Show Goal + Ask  ││
        │        │ "Ready to start?"││
        │        └──────┬───────────┘│
        │               │            │
        └───────────────┼────────────┘
                        │
                        ▼
                  ┌─────────────────┐
                  │ DASHBOARD       │
                  │ (Home/Main)     │
                  │ - Progress Ring │
                  │ - Empty Log Msg │
                  │ - "Add Meal" CTA│
                  └─────────┬───────┘
                            │
                   (User adds first meal)
                            │
                            ▼
                  ┌─────────────────┐
                  │ Add Meal Modal  │
                  │ Food Search     │
                  │ Quantity Input  │
                  │ Confirm Calories│
                  └─────────┬───────┘
                            │
                            ▼
                  ┌─────────────────┐
                  │ ACTIVATED!      │
                  │ Dashboard updates
                  │ - Meal shows up │
                  │ - Ring fills    │
                  │ - Macros update │
                  │ - Success toast │
                  └─────────────────┘
                  
    [Key Moment: User has just tracked their first meal
     and seen it change the dashboard in real-time]
```

### 1.2 Daily Active User Flow (Routine)

```
┌────────────────────────────────────────────┐
│ User Opens App (Next Day)                  │
│ Browser remembered them                    │
└─────────────────┬──────────────────────────┘
                  │
                  ▼
      ┌───────────────────────────┐
      │ Auto-login (localStorage) │
      │ (Refresh token silently)  │
      └─────────────┬─────────────┘
                    │
                    ▼
      ┌────────────────────────────┐
      │ DASHBOARD (today's log)    │
      │ Progress Ring: 2,100 kcal  │
      │ Meals: [empty list]        │
      │ Streak: 5 days             │
      │ "Add Meal" button ready    │
      └──┬─────────────────────────┘
         │
   ┌─────┴──────┬──────────┐
   │             │          │
   ▼             ▼          ▼
Add Meal   Check Stats  Adjust Profile
   │             │          │
   ▼             ▼          ▼
Logged! → Stats Page   → Updated target
Ring     Weekly chart  Recalculated
updates  Weight trend  goal
```

### 1.3 Onboarding Deep Dive (7-Step Goal Calculation)

```
Step 1: Gender Selection
┌──────────────────────────────┐
│ What's your gender?          │
│ [●] Male   [ ] Female        │
│ [ ] Other / Prefer not to say│
│                [Next button] │
└──────────────────────────────┘

Step 2: Age Input
┌──────────────────────────────┐
│ How old are you?             │
│ [32_____] years              │
│                [Next button] │
└──────────────────────────────┘

Step 3: Height Input (with unit toggle)
┌──────────────────────────────┐
│ What's your height?          │
│ [Metric▼] (toggle to Imperial)
│ [170____] cm                 │
│                [Next button] │
└──────────────────────────────┘

Step 4: Current Weight
┌──────────────────────────────┐
│ Current weight?              │
│ [Metric▼] (toggle)           │
│ [75.5___] kg                 │
│                [Next button] │
└──────────────────────────────┘

Step 5: Goal Weight
┌──────────────────────────────┐
│ Goal weight?                 │
│ [Metric▼] (toggle)           │
│ [70.0___] kg                 │
│ Time to goal: ~10 weeks      │
│ (based on 0.5 kg/week)       │
│                [Next button] │
└──────────────────────────────┘

Step 6: Activity Level
┌──────────────────────────────┐
│ How active are you?          │
│ [●] Sedentary (little/no)    │
│ [ ] Light (1-3x/week)        │
│ [ ] Moderate (3-5x/week)     │
│ [ ] Active (6-7x/week)       │
│ [ ] Very Active (2x/day)     │
│                [Next button] │
└──────────────────────────────┘

Step 7: Goal Setting & Confirmation
┌──────────────────────────────┐
│ What's your goal?            │
│ [●] Lose weight              │
│ [ ] Maintain weight          │
│ [ ] Gain muscle              │
│                [Next button] │
└──────────────────────────────┘
                ▼
        ┌──────────────────────┐
        │ Your Daily Goal      │
        │                      │
        │ BMR: 1,650 kcal      │
        │ TDEE: 2,475 kcal     │
        │ Your Goal: 1,975 kcal│
        │ (500 kcal deficit)   │
        │                      │
        │ BMI: 26.0 (Normal)   │
        │ Timeline: 10 weeks   │
        │                      │
        │ [Adjust goal]  [Confirm] │
        └──────────────────────┘
```

### 1.4 Meal Logging Flow

```
┌─────────────────────────────┐
│ DASHBOARD                   │
│ [Progress Ring - 1,247 left]│
│ [Macros breakdown]          │
│ [Empty meals list]          │
│                             │
│ [+ Add Meal button]    ◄────┐
└──────────────┬──────────────┘
               │
               ▼
    ┌──────────────────────────┐
    │ Add Meal Modal/Page      │
    │                          │
    │ Food Search:             │
    │ [Search chicken breast...] │
    │ ──────────────────────    │
    │ Suggestions:             │
    │ • Chicken Breast (100g)  │
    │   165 kcal, P: 31g       │
    │ • Grilled Chicken (150g) │
    │   248 kcal, P: 46.5g     │
    │ • Fried Chicken (100g)   │
    │   304 kcal, P: 20g       │
    └──────────┬───────────────┘
               │
        Click "Chicken Breast"
               │
               ▼
    ┌────────────────────────────┐
    │ Customize Meal             │
    │                            │
    │ Food: Chicken Breast   ✓  │
    │ Quantity: [150] g      ◄─┐│
    │ (Default: 100g, 165 kcal)││
    │                            │
    │ Calories: 248        │
    │ Protein: 46.5g       │
    │ Carbs: 0g            │
    │ Fat: 3.6g            │
    │                            │
    │ Meal Type: [Lunch ▼]      │
    │                            │
    │ [Cancel]  [Log Meal] ◄───┘
    └──────────┬─────────────────┘
               │
               ▼
    ┌────────────────────────────┐
    │ Dashboard updates:         │
    │                            │
    │ Progress Ring changes      │
    │ 1,247 → 999 kcal left      │
    │                            │
    │ Macro bars update          │
    │ Protein: 46.5/150g         │
    │                            │
    │ Meals list now shows:      │
    │ 🍗 Chicken Breast (150g)   │
    │   248 kcal at 12:30 PM     │
    │   [Edit] [Delete]          │
    │                            │
    │ Toast: "Meal logged! Undo?"│
    └────────────────────────────┘
```

### 1.5 Statistics Discovery Flow

```
User curious about progress
        │
        ▼
┌─────────────────────┐
│ Bottom Nav: "Stats" │
└────────┬────────────┘
         │
         ▼
┌──────────────────────────────┐
│ STATISTICS PAGE              │
│                              │
│ [Week ▼] [Month] [All-time] │
│                              │
│ 📊 Calorie Intake (Week)    │
│ [Line chart: daily intake]  │
│ - Green zone: on target     │
│ - Red zone: over            │
│ - Hovers show exact numbers │
│                              │
│ 📈 Weight Progress (Month)  │
│ [Line chart: weight trends] │
│ Starting: 80.0 kg           │
│ Current: 75.2 kg            │
│ Change: -4.8 kg (-1.2/wk)  │
│                              │
│ 🎯 Adherence Stats          │
│ Current Streak: 14 days     │
│ On-Track Rate: 78% (21/27)  │
│ Avg Daily: 2,050 kcal       │
│                              │
│ 📅 Meal History (sortable)  │
│ [Table of daily summaries]  │
└──────────────────────────────┘
```

---

## 2. Page-by-Page Wireframe Descriptions

### 2.1 Login Page

**Header**: "CalorieTracker" (logo)
**Subheading**: "Track your calories, reach your goals"

**Form**:
```
Email Address
[____________________]

Password
[____________________] 👁️

[ ] Stay signed in

[LOGIN button - full width, primary green]

─ or ─

Don't have an account?
[Sign up here]

Forgot password? [Link]
```

**Mobile**: Full viewport, centered, white background, green accent

---

### 2.2 Signup Page

**Header**: "Get Started"
**Subheading**: "Create your account to begin tracking"

**Form**:
```
Email Address
[____________________]
(must be valid email format)

Password
[____________________] 👁️
(min 8 chars, 1 uppercase, 1 number)

Confirm Password
[____________________] 👁️

[ ] I agree to Terms & Privacy

[SIGN UP button - full width, primary green]

─ or ─

Already have an account?
[Log in here]
```

---

### 2.3 Dashboard (Home Page)

**Header**: 
```
Monday, January 6
[Settings icon] [Menu]
```

**Section 1: Daily Progress**
```
┌────────────────────┐
│    ○ 1,247        │ ◄─── Large circular ring
│    kcal left      │      (80% filled, green)
└────────────────────┘
```

**Section 2: Macro Breakdown**
```
┌─────────────┬─────────────┬─────────────┐
│   Carbs     │   Protein   │     Fat     │
│   153 / 260 │   46 / 150  │   58 / 70   │
│   58%  [═══]│   30% [══]  │  82% [════] │
│   (orange)  │   (blue)    │   (purple)  │
└─────────────┴─────────────┴─────────────┘
```

**Section 3: Meals Logged Today**
```
Breakfast
  🍳 Oatmeal with Berries (150g)
  280 kcal | P: 10g | C: 48g | F: 5g
  [Edit] [Delete]

Lunch
  🍗 Chicken Breast (150g)
  248 kcal | P: 46g | C: 0g | F: 4g
  [Edit] [Delete]

Snack
  🍎 Apple (1 medium)
  95 kcal | P: 0g | C: 25g | F: 0g
  [Edit] [Delete]

─────────────────────────────

Total Logged: 623 kcal
─────────────────────────────
```

**Section 4: Water Tracker**
```
Water Intake
🥤 6 / 8 cups
[+] [+] [+] [+] [+] [+] [ ] [ ]
```

**Section 5: Quick Stats**
```
Current Streak: 5 days 🔥
Last Weight: 75.2 kg (Jan 5)

[View Full Stats] →
```

**CTA**: 
```
[+ ADD MEAL] button - sticky, always visible at bottom
```

---

### 2.4 Add Meal Page/Modal

**Header**: "Add Meal"

**Step 1: Food Search**
```
Search for a food:
[🔍 Search "chicken"...____________]

─ Recent Searches ─
• Chicken Breast
• Apple
• Rice (cooked)

─ Top Suggestions ─
✓ Chicken Breast (100g)
  165 kcal | P: 31g | C: 0g | F: 3.6g

  Grilled Chicken (150g)
  248 kcal | P: 46.5g | C: 0g | F: 5.4g

  Fried Chicken (100g)
  304 kcal | P: 20g | C: 10g | F: 17g
```

**Step 2: Customize & Confirm**
```
Food: Chicken Breast ✓

Quantity:
[150] [kg ▼]

Nutritional Info:
  248 kcal
  Protein: 46.5g
  Carbs: 0g
  Fat: 3.6g

Meal Type: [Lunch ▼]

──────────────────────
[Cancel]  [Log Meal]
```

---

### 2.5 Statistics Page

**Header**: "Your Progress"

**Date Range Selector**:
```
[ Week ] [Month] [All-time]
 ←  Mon, Jan 6 - Sun, Jan 12  →
```

**Chart 1: Daily Calorie Intake**
```
[Line chart with title "Calorie Intake vs. Goal"]
Y-axis: 0 - 2,400 kcal
X-axis: Mon - Sun
Line: user's daily total
Dashed line: daily goal (2,100 kcal)
Green zone: below goal
Red zone: above goal
```

**Chart 2: Weight Progress**
```
[Line chart with title "Weight Trend"]
Y-axis: 74 - 76 kg
X-axis: past 30 days
Line: weight entries connected
Slope downward (good!) = motivation
```

**Metrics Cards**:
```
┌──────────────────┬──────────────────┐
│ Average Daily    │ Adherence Rate   │
│ 2,045 kcal       │ 78% (21 of 27)   │
└──────────────────┴──────────────────┘

┌──────────────────┬──────────────────┐
│ Weight Change    │ Current Streak   │
│ -4.8 kg          │ 14 days 🔥       │
│ (-1.2 kg/week)   │                  │
└──────────────────┴──────────────────┘
```

**Meal History Table**:
```
Date        Calories   On-Track?
─────────────────────────────
Jan 6       2,050      ✓ (Goal: 2,100)
Jan 5       1,980      ✓ (Goal: 2,100)
Jan 4       2,230      ✗ (Over by 130)
Jan 3       2,100      ✓ (Goal: 2,100)
Jan 2       1,850      ✓ (Goal: 2,100)
```

---

### 2.6 Settings Page

**Header**: "Settings"

**Section 1: Profile**
```
Age: [32_________] years
Height: [170] cm [Toggle: ft/in]
Weight: [75.5] kg [Toggle: lbs]
Goal Weight: [70.0] kg
Activity Level: [Moderate ▼]
Primary Goal: [Lose Weight ▼]

[Recalculate Daily Goal]
Current: 2,100 kcal/day
```

**Section 2: Preferences**
```
Daily Water Goal: [8] cups
Units: [Metric ▼] / [Imperial]
Dark Mode: [Toggle: OFF]
Notifications: [Toggle: ON]
```

**Section 3: Account**
```
Email: user@example.com
Last Login: Today at 3:45 PM

[Edit Account]
[Change Password]
[Export Data]
```

**Section 4: Danger Zone**
```
[Delete Account] button (red)
(Warning: This cannot be undone)
```

**Footer**:
```
App Version: 1.0.0
[Logout]
```

---

## 3. Design System Specifications

### 3.1 Color Palette (Tailwind)

#### Primary Colors
```
Green (Achievement):
  50:  #f0fdf4
  100: #dcfce7
  200: #bbf7d0
  500: #10b981  ◄─ Primary action
  600: #059669  ◄─ Hover state
  900: #064e3b

Orange (Emphasis/Accent):
  500: #f97316  ◄─ Secondary action, alerts
  600: #ea580c  ◄─ Hover state

Purple (Tertiary):
  500: #8b5cf6  ◄─ Accent, protein macro
  600: #7c3aed

Blue (Protein macro):
  500: #3b82f6

Red (Danger/Over-limit):
  500: #ef4444  ◄─ Overages, delete actions
  600: #dc2626

Yellow (Warning):
  400: #facc15  ◄─ Close to limit

Gray (Neutral text & backgrounds):
  50:  #f8fafc
  100: #f1f5f9
  200: #e2e8f0
  400: #cbd5e1
  600: #475569
  700: #334155
  900: #0f172a
```

#### Usage
```
Buttons, CTAs, progress rings   → Green 500/600
Dashboard background            → White / Gray 50
Card backgrounds               → White
Text (primary)                 → Gray 900
Text (secondary)               → Gray 600
Borders                        → Gray 200
Macro - Carbs                  → Orange 500
Macro - Protein                → Blue 500
Macro - Fat                    → Purple 500
Over limit / Delete            → Red 500
Close to limit                 → Yellow 400
Success messages               → Green 500
Error messages                 → Red 500
```

### 3.2 Typography

#### Font Family
- **Sans-serif**: Inter, -apple-system, BlinkMacSystemFont
- **Monospace**: Menlo, Monaco, "Courier New" (for numbers)

#### Type Scale
```
H1 (Page titles)      32px Bold   Line height: 1.2
H2 (Section headers)  24px Bold   Line height: 1.3
H3 (Card titles)      18px Semibold Line height: 1.4
Body (regular text)   16px Regular Line height: 1.5
Body Small            14px Regular Line height: 1.5
Label (form labels)   12px Semibold Line height: 1.4
Caption               12px Regular Line height: 1.4 Gray 600
```

#### Weight
- Regular (400): Body text, descriptions
- Semibold (600): Labels, small headings
- Bold (700): Main headings, CTAs

### 3.3 Spacing System

**4px baseline grid:**
```
xs:    4px   (internal padding in small elements)
sm:    8px   (gap between inline elements)
md:   16px   (standard padding, margins)
lg:   24px   (section spacing)
xl:   32px   (large section gaps)
2xl:  48px   (page margins)
```

**Usage:**
```
Button padding:      md (16px) horizontal, sm (8px) vertical
Card padding:        lg (24px)
Page padding:        xl (32px)
Input height:        44px (responsive touch target)
Section gap:         lg (24px)
Row gap:             md (16px)
```

### 3.4 Component Specifications

#### Button Component
```
Primary Button (Green):
  Background: Green 500 (#10b981)
  Text: White, Semibold 16px
  Padding: 8px 16px (32px height)
  Border radius: 8px
  Hover: Green 600 background
  Disabled: Gray 300 background, Gray 400 text
  Transition: all 150ms ease

Secondary Button (Gray):
  Background: Gray 100
  Text: Gray 700, Semibold 16px
  Padding: 8px 16px
  Border radius: 8px
  Hover: Gray 200 background
  
Danger Button (Red):
  Background: Red 500
  Text: White, Semibold
  Hover: Red 600
```

#### Input Field
```
Text Input:
  Height: 44px (mobile touch-friendly)
  Padding: 12px 16px
  Border: 1px Gray 200
  Border radius: 8px
  Font: Regular 16px (prevents zoom on iOS)
  Placeholder: Gray 400
  Focus: Border Gray 400, Box shadow: blue 200
  Invalid: Border Red 500

Select/Dropdown:
  Height: 44px
  Background: White with caret icon
  Border: 1px Gray 200
  Border radius: 8px

Number Input:
  Same as text input
  Right-aligned
  Hide spinner (for cleaner mobile look)
```

#### Card Component
```
Card:
  Background: White
  Border: 1px Gray 200 (or none)
  Border radius: 12px
  Padding: 16px
  Box shadow: 0 1px 3px rgba(0,0,0,0.1)
  Hover: None (unless interactive)

Interactive Card:
  Cursor: pointer
  Hover: Box shadow increases to 0 4px 6px rgba(0,0,0,0.1)
  Transition: all 150ms ease
```

#### Progress Ring (Circular)
```
SVG Circle Progress:
  Size: 200px diameter (desktop), 160px (mobile)
  Background circle: Gray 100
  Progress circle: Green 500
  Stroke width: 12px
  Center text: Bold 32px (calories), Regular 14px (label)
  Color: Green 500 (on track), Yellow 400 (close), Red 500 (over)
  Animation: Stroke animates on load (150ms)
```

#### Progress Bar (Linear)
```
Progress Bar:
  Height: 8px
  Background: Gray 100
  Fill: Green 500 / Blue 500 / Orange 500
  Border radius: 4px
  Percentage: 0-100%
  Label: Right-aligned, 12px Gray 600

Over-goal variant:
  Fill: Red 500
  Background: Red 100
```

### 3.5 Elevation & Shadows

```
Level 0 (flat):      No shadow

Level 1 (raised):    0 1px 2px rgba(0, 0, 0, 0.05)

Level 2 (card):      0 1px 3px rgba(0, 0, 0, 0.1),
                     0 1px 2px rgba(0, 0, 0, 0.06)

Level 3 (modal):     0 10px 15px rgba(0, 0, 0, 0.1),
                     0 4px 6px rgba(0, 0, 0, 0.05)

Level 4 (dropdown):  0 20px 25px rgba(0, 0, 0, 0.1),
                     0 10px 10px rgba(0, 0, 0, 0.04)
```

### 3.6 Border Radius

```
Small (buttons, inputs):    8px
Medium (cards):             12px
Large (modals):             16px
Full (circles, progress):   50% / 100%
```

### 3.7 Transitions & Animations

```
Fast interactions:      150ms ease-in-out
  (button hover, input focus)

Standard transitions:   250ms ease-in-out
  (drawer open, modal appear)

Slow animations:        500ms ease-out
  (progress ring fill on load)

Easing functions:
  ease-in-out:  cubic-bezier(0.4, 0, 0.2, 1)
  ease-out:     cubic-bezier(0, 0, 0.2, 1)
  ease-in:      cubic-bezier(0.4, 0, 1, 1)
```

**Micro-interactions**:
```
✓ Button press: Scale 0.98 on tap
✓ Progress ring: Smooth stroke animation on load
✓ Meal logged: Toast slides up from bottom
✓ Form validation: Red border + shake animation
✓ Page transitions: Fade in 200ms
✓ Water tracker: Glass icon animates on tap
✓ Macro bars: Fill animation 500ms
```

### 3.8 Responsive Breakpoints

```
Mobile:    0px - 640px     (phones, default)
Tablet:    641px - 1024px  (iPad, large phones)
Desktop:   1025px+         (laptops, desktops)
```

**Layout changes**:
```
Mobile:
  - Single column layout
  - Full-width buttons
  - Bottom navigation bar
  - Large touch targets (44px)
  - Modal/drawer for secondary views

Tablet:
  - 2-column layout where appropriate
  - Sidebar navigation optional
  - Chart full-width

Desktop:
  - Sidebar navigation (240px)
  - Main content area
  - Charts and stats side-by-side
  - Centered max-width container (1200px)
```

### 3.9 Icons & Imagery

**Icon Library**: 
- Use Lucide React or Feather Icons (24px standard)
- Stroke width: 2px
- Color: Match text color or brand color

**Common Icons**:
```
Settings        ⚙️  (lucide-react: Settings)
Dashboard       🏠  (Home)
Stats           📊  (BarChart3)
Plus/Add        ➕  (Plus)
Edit            ✏️  (Edit)
Delete          🗑️  (Trash2)
Logout          🚪  (LogOut)
Menu            ☰   (Menu)
Close           ✕   (X)
Check/Confirm   ✓   (Check)
Search          🔍  (Search)
Water           💧  (Droplets)
Settings        ⚙️  (Settings)
```

### 3.10 Dark Mode (Optional, Phase 2)

```
Dark background:       Gray 900 (#0f172a)
Dark card:            Gray 800 (#1e293b)
Dark text primary:    White
Dark text secondary:  Gray 300
Dark borders:         Gray 700

Colors adjust:
  Green 500 → Green 400 (brighter on dark)
  Gray text → lighter gray
  Shadows: soften opacity
```

---

## 4. Mobile-First Layout Examples

### Mobile Dashboard (375px width)
```
┌─────────────────────────────┐ 24px
│ Mon, Jan 6     ⚙️  ☰       │ 16px
├─────────────────────────────┤ 16px
│    ○ 1,247 kcal left        │ (160px ring)
│                             │
├─────────────────────────────┤ 16px
│ 🥕 Carbs    🍗 Protein      │ (2 cols)
│ 153/260     46/150          │
│ [════]      [══]            │
│                             │
│ 🧈 Fat                      │
│ 58/70                       │
│ [════════]                  │
├─────────────────────────────┤ 16px
│ Breakfast (8:00 AM)         │
│  🍳 Oatmeal                 │
│  280 kcal [edit] [delete]   │
│                             │
│ Lunch (12:30 PM)            │
│  🍗 Chicken Breast          │
│  248 kcal [edit] [delete]   │
│                             │
├─────────────────────────────┤ 16px
│ 💧 Water: 6/8 cups          │
│ [🥤][🥤][🥤][🥤][🥤][🥤][ ][ ] │
│                             │
├─────────────────────────────┤ 16px
│ Streak: 5 days 🔥           │
│ Last weight: 75.2 kg        │
│ [View Stats]                │
│                             │
│ ┌─────────────────────────┐ │ 44px height
│ │  + ADD MEAL             │ │ (sticky)
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Desktop Dashboard (1200px width)

```
┌──────────────────────────────────────────────────────────┐
│ CalorieTracker                          Mon, Jan 6 ⚙️   │
├────────────────┬───────────────────────────────────────┤
│                │                                       │
│ ◀ Dashboard    │  ○ 1,247 kcal left                  │
│ ▶ Stats        │                                       │
│ ▶ Settings     │  ┌──────────┬───────────┬──────────┐ │
│ ▶ Logout       │  │ Carbs    │ Protein   │ Fat      │ │
│                │  │ 153/260  │ 46/150    │ 58/70    │ │
│                │  │ [═════]  │ [══]      │ [════]   │ │
│                │  └──────────┴───────────┴──────────┘ │
│                │                                       │
│                │  Today's Meals                       │
│                │  ┌──────────────────────────────────┐ │
│                │  │ 🍳 Breakfast (8:00 AM)           │ │
│                │  │    Oatmeal (150g) - 280 kcal     │ │
│                │  │    P: 10g C: 48g F: 5g           │ │
│                │  │    [Edit] [Delete]               │ │
│                │  └──────────────────────────────────┘ │
│                │                                       │
│                │  ┌──────────────────────────────────┐ │
│                │  │ 🍗 Lunch (12:30 PM)              │ │
│                │  │    Chicken Breast (150g)         │ │
│                │  │    248 kcal | P: 46g ...         │ │
│                │  │    [Edit] [Delete]               │ │
│                │  └──────────────────────────────────┘ │
│                │                                       │
│                │  [+ ADD MEAL]                        │
│                │                                       │
│                │  Water: 6/8 cups                     │
│                │  [🥤][🥤][🥤][🥤][🥤][🥤]            │
│                │                                       │
│                │  Streak: 5 days 🔥                   │
│                │  Weight: 75.2 kg                     │
│                │                                       │
└────────────────┴───────────────────────────────────────┘
```

---

## 5. Accessibility Checklist

- [ ] Color contrast: All text >4.5:1 (WCAG AA)
- [ ] Touch targets: 44px minimum (mobile)
- [ ] Keyboard navigation: Tab through all interactive elements
- [ ] Form labels: Every input has associated label
- [ ] Alt text: All images have descriptive alt text
- [ ] ARIA labels: Buttons without text have aria-label
- [ ] Focus indicators: Clear visible focus ring (not removed)
- [ ] Screen reader: Tested with NVDA/VoiceOver
- [ ] Semantic HTML: <button>, <input>, <form> used correctly
- [ ] Error messages: Associated with invalid fields via aria-describedby
- [ ] Loading states: Indicated visually + via aria-busy
- [ ] Skip links: Jump to main content (optional for MVP)

---

## 6. Performance Optimization Checklist

- [ ] Images optimized (WebP format, <100KB)
- [ ] Charts lazy-loaded (not on initial render)
- [ ] API calls cached (React Query)
- [ ] Unnecessary re-renders eliminated (memo, useCallback)
- [ ] Bundle size <100KB (main app)
- [ ] Fonts system stack (no custom fonts on initial load)
- [ ] No blocking CSS/JS in critical path
- [ ] Mobile-optimized images (srcset)
- [ ] Code splitting by route (Next.js automatic)
- [ ] Compression enabled (gzip, brotli)

---

End of Design System documentation. Use this as your reference guide during development.

