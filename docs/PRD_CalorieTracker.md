# CalorieTracker - Product Requirements Document (PRD)

**Document Version**: 1.0  
**Last Updated**: December 2025  
**Status**: Ready for Development  

---

## 1. Executive Summary

CalorieTracker is a mobile-first web application that helps users track their daily caloric and macronutrient intake with the goal of supporting weight loss, maintenance, or muscle gain goals. The app prioritizes simplicity and intuitive design over feature complexity, making calorie tracking accessible to everyone.

**Core Value Proposition**: Get personalized daily calorie targets in minutes, then track your meals and progress with minimal friction.

**Target Users**: Health-conscious individuals (ages 18-50) who want to lose weight, maintain fitness, or build muscle without complex tools.

**Go-to-Market Strategy**: Free app with potential premium features in the future (meal planning, advanced analytics, integrations).

---

## 2. Product Vision & Goals

### 2.1 Vision Statement
A beautifully designed, friction-free calorie tracker that turns nutrition insight into daily habit through simplicity and delight.

### 2.2 Key Objectives
1. **Onboard users in <5 minutes** with their personalized daily calorie target
2. **Make meal logging faster** than competitors (target: <20 seconds per meal)
3. **Keep users engaged** with daily streak tracking and visual progress
4. **Build trust** through accurate calculations and data persistence
5. **Design for mobile-first** without sacrificing desktop experience

### 2.3 Success Metrics
- Onboarding completion rate: >80%
- Week 1 retention: >60%
- Month 1 retention: >30%
- Average meals logged per active user: >5 per day
- Session persistence success: 100% (users stay logged in)
- Avg. time to add meal: <30 seconds
- API response time: <200ms (90th percentile)

---

## 3. User Personas

### Persona 1: Sarah (Weight Loss Beginner)
- **Age**: 32, working professional
- **Goal**: Lose 25 lbs over 6 months
- **Tech Comfort**: Moderate (uses apps daily)
- **Pain Points**: Overwhelmed by calorie counting, wants simple, not complex. Hates apps that feel like homework.
- **Needs**: Clear daily target, easy meal logging, weekly progress check-in
- **Success Criteria**: Sees her progress trending down, stays motivated for 3+ months

### Persona 2: Marcus (Fitness Enthusiast)
- **Age**: 26, gym-goer 4x/week
- **Goal**: Build muscle, track macros (protein focus)
- **Tech Comfort**: High (early adopter)
- **Pain Points**: Wants clean, modern design. Tired of bloated apps like MyFitnessPal. Wants real-time sync with phone.
- **Needs**: Fast logging, macro breakdowns, mobile-first interface
- **Success Criteria**: Logs every day, uses stats to optimize protein intake

### Persona 3: Jennifer (Maintenance Mindset)
- **Age**: 45, busy parent
- **Goal**: Maintain weight, develop healthier habits
- **Tech Comfort**: Low-to-moderate
- **Pain Points**: Doesn't want to obsess over calories. Wants to "check in" without stress.
- **Needs**: Simple daily overview, gentle reminders, motivation
- **Success Criteria**: Logs 3-4x per week, stays aware of eating habits

---

## 4. User Stories & Acceptance Criteria

### 4.1 Authentication Flow

**US-1: User Signs Up for an Account**
```
As a new user,
I want to create an account with my email and password,
So that I can start tracking my calorie intake.

Acceptance Criteria:
- User can enter email, password, and confirm password on signup page
- Validation: email format, password strength (min 8 chars, 1 uppercase, 1 number)
- On success: User is logged in and redirected to onboarding
- On error: Clear error message displayed (e.g., "Email already in use")
- Password confirmation must match password field
- Signup completes in <2 seconds
- User receives confirmation email (optional for MVP, nice-to-have)
```

**US-2: User Logs Into Existing Account**
```
As a returning user,
I want to log in with my email and password,
So that I can access my tracked data.

Acceptance Criteria:
- User can enter email and password on login page
- "Stay signed in" checkbox available (default unchecked)
- On success: User is logged in and redirected to dashboard
- On error: "Incorrect email or password" message displayed
- On success with "Stay signed in" checked: Browser stores session token in localStorage
- Session persists across browser closes/reopen (valid for 30 days)
- Login completes in <2 seconds
```

**US-3: User Stays Signed In After Closing Browser**
```
As a mobile user,
I want to stay signed in when I reopen the app,
So that I don't have to re-enter credentials every time.

Acceptance Criteria:
- User logs in with "Stay signed in" checked
- User closes browser/app completely
- User reopens browser/app
- User is automatically logged in (no login screen)
- Session is refreshed silently in the background
- If session has expired (>30 days), user is redirected to login
- localStorage contains secure session token (HttpOnly would be ideal but localStorage is acceptable for web)
- Logout clears localStorage token immediately
```

**US-4: User Logs Out**
```
As a user,
I want to log out of my account,
So that I can secure my account on shared devices.

Acceptance Criteria:
- Logout button present on settings/profile page
- On click: Session token cleared from localStorage and backend
- User redirected to login page
- Subsequent refresh sends user to login (not dashboard)
- Logout completes in <1 second
```

### 4.2 Onboarding & Goal Calculation

**US-5: User Completes Onboarding and Gets Daily Calorie Target**
```
As a new user,
I want to answer a few questions about my body and goals,
So that the app calculates my personalized daily calorie target.

Acceptance Criteria:
- Onboarding is a multi-step form (7 steps total)
- Steps 1-6 collect: gender, age, height, weight, goal weight, activity level
- Step 7 shows calculated daily target, BMI, and time-to-goal estimate
- User can review and manually adjust daily target before confirming
- On confirm: User is taken to dashboard
- Calculation uses Mifflin-St Jeor Formula for BMR, then applies activity multiplier for TDEE
- Weight loss goal: TDEE - 500 kcal (1 lb/week deficit)
- Maintenance goal: TDEE
- Muscle gain goal: TDEE + 300 kcal
- Display shows: "Your daily goal: 2,100 calories" prominently
- All data saved to database immediately after confirmation
- Users can re-enter onboarding from settings to recalculate
```

**US-6: User Sees Personalized Daily Goal**
```
As a user who completed onboarding,
I want to see my personalized daily calorie goal,
So that I know how many calories I can eat today.

Acceptance Criteria:
- Dashboard displays: "2,100 kcal daily goal" or similar
- Goal is clearly visible at top of dashboard
- Goal persists across sessions
- Goal is used to calculate remaining calories throughout the day
- User can see their goal in settings and request recalculation
```

### 4.3 Dashboard & Daily Tracking

**US-7: User Views Daily Calorie Progress**
```
As an active user,
I want to see my remaining calories for the day,
So that I can decide if I can eat more.

Acceptance Criteria:
- Dashboard displays large circular progress ring at top
- Ring shows: "1,247 kcal remaining" (or similar)
- Ring color changes based on status:
  - Green: on track (>100 kcal remaining)
  - Yellow: close to limit (0-100 kcal remaining)
  - Red: over limit (negative)
- Ring is filled proportionally to calories consumed vs. goal
- Remaining = Daily Goal - Consumed Calories
- Displays update in real-time as meals are logged
- Mobile layout optimizes ring size for readability
```

**US-8: User Sees Macronutrient Breakdown**
```
As a user,
I want to see my carbs, protein, and fat breakdown,
So that I can track macros in addition to total calories.

Acceptance Criteria:
- Dashboard displays three cards below progress ring: Carbs, Protein, Fat
- Each card shows:
  - Macro name
  - Grams consumed / daily goal
  - Percentage of daily goal (e.g., "65% of daily protein")
  - Visual progress bar
- Macro goals calculated from daily calorie target (default: 40% carbs, 30% protein, 30% fat)
- User can adjust macro split in settings (optional for MVP)
- Macros update in real-time as meals are logged
- Cards are color-coded (e.g., protein = blue, carbs = orange, fat = purple)
```

**US-9: User Logs a Meal Manually**
```
As a user,
I want to quickly add a meal to my daily log,
So that I can track what I've eaten.

Acceptance Criteria:
- Dashboard has prominent "Add Meal" button
- Clicking button opens add meal modal or page
- Form has fields: meal name (required), quantity (required), calories (auto-filled)
- User can search for food by name (autocomplete from food database)
- App suggests calorie estimate based on quantity (e.g., "1 cup cooked rice" = ~200 kcal)
- User can manually override calorie estimate before logging
- Macro breakdown shown based on estimated calories (using USDA defaults or food-specific data)
- Submit button saves meal to database
- Meal appears in daily log immediately
- Success message: "Meal logged!" with undo option (5-second window)
- Form validates: food name required, quantity required, calories must be number >0
- Add meal flow completes in <30 seconds
- Meal is saved even if user navigates away
```

**US-10: User Edits a Logged Meal**
```
As a user,
I want to edit or correct a meal I've already logged,
So that I can fix mistakes.

Acceptance Criteria:
- Each meal card on dashboard has edit icon
- Clicking edit opens modal with pre-filled meal data
- User can change meal name, quantity, or calories
- Submitting updates meal in database
- Dashboard updates immediately without page refresh
- Meal history shows both original and updated entry (or just the latest)
- Edit preserves meal timestamp
```

**US-11: User Deletes a Logged Meal**
```
As a user,
I want to remove a meal from my daily log,
So that I can undo mistakes.

Acceptance Criteria:
- Each meal card has delete/trash icon
- Clicking delete shows confirmation: "Remove [meal name]?"
- Confirming deletes meal from database
- Dashboard updates immediately
- Undo available for 5 seconds (shows toast: "Meal deleted. Undo?")
- After undo window, meal is permanently removed
- Remaining calories and macros recalculate in real-time
```

**US-12: User Logs Water Intake**
```
As a user,
I want to track my daily water intake,
So that I can stay hydrated.

Acceptance Criteria:
- Dashboard has water tracker section (below meals)
- Shows: "6 cups / 8 cups" (default daily goal)
- Click glass icon to add 8 oz increments
- Each click animates and adds count
- Visual indicator (e.g., glass fills up)
- Goal customizable in settings
- Water logging does not affect calorie calculation
- Data saved immediately
```

### 4.4 Statistics & Progress Tracking

**US-13: User Views Weekly Calorie Intake**
```
As a user,
I want to see my calorie intake over the past week,
So that I can assess if I'm on track.

Acceptance Criteria:
- Statistics page accessible from main navigation
- Line chart displays daily calorie intake for the past 7 days
- X-axis: dates (Mon, Tue, Wed, etc.)
- Y-axis: calories (0 to 1.5x daily goal)
- Line shows actual intake
- Horizontal dashed line shows daily goal
- Area below goal line shaded green, above shaded red
- Tooltip on hover shows exact date and calorie count
- User can select different date ranges: week, month, all-time
- Chart is interactive and responsive on mobile
```

**US-14: User Tracks Weight Progress**
```
As a user,
I want to log my weight and see it trending over time,
So that I can monitor my progress.

Acceptance Criteria:
- Statistics page has "Weight" section
- User can log today's weight with a date picker
- Weight history displayed as line chart (date vs. weight)
- Chart shows trend line
- Stats displayed: starting weight, current weight, weight lost/gained, average loss per week
- User can edit past weight entries
- Delete weight entry option available
- Weight measured in user's preferred unit (lbs or kg)
- Data persists across sessions
```

**US-15: User Sees Adherence Stats**
```
As a user,
I want to see metrics about my tracking consistency,
So that I can stay motivated.

Acceptance Criteria:
- Statistics page displays: "Current Streak: 14 days"
- Shows: "Days on track: 18 out of last 30 days" (60% adherence)
- Shows: "Average daily calories: 2,050"
- Streak increments when user logs meals each day
- Streak resets if user has a full day with zero logging
- Percentage calculated as: (days on or under goal) / (total days tracked) * 100
```

### 4.5 Settings & Account Management

**US-16: User Updates Profile Information**
```
As a user,
I want to update my personal information,
So that I can recalculate my daily calorie goal.

Acceptance Criteria:
- Settings page accessible from main menu
- User can edit: age, height, weight, goal weight, activity level, primary goal
- Each field has validation (e.g., age 18-120, height >0)
- Save button recalculates daily calorie target based on new data
- Shows modal: "Your daily goal has changed to 2,150 kcal"
- User can confirm or adjust manually
- All changes saved to database
- Updates reflected on dashboard immediately
```

**US-17: User Deletes Account**
```
As a user,
I want to permanently delete my account,
So that my data is removed from the system.

Acceptance Criteria:
- Settings page has "Delete Account" button
- Button shows warning: "This action cannot be undone"
- Requires password confirmation for security
- On confirm: User account and all associated data deleted from database
- User logged out and redirected to login page
- Cannot re-login with same email (email is freed up)
- Deletion completes within 24 hours (can be synchronous or async)
```

**US-18: User Customizes Settings**
```
As a user,
I want to customize the app to my preferences,
So that it works better for me.

Acceptance Criteria:
- Settings page includes options for:
  - Units (imperial/metric)
  - Daily water goal (default 8 cups, customizable)
  - Macro split (optional, default 40/30/30)
  - Dark mode toggle (optional for MVP)
  - Notifications (optional for MVP)
  - Calorie rounding (optional)
- All settings persist across sessions
- Changes apply immediately to dashboard
```

---

## 5. Features & Requirements

### 5.1 Core Features (MVP)

#### Authentication & Authorization
- [x] Email/password signup
- [x] Email/password login
- [x] Session persistence (localStorage + refresh tokens)
- [x] Logout functionality
- [x] Password reset (optional for MVP)
- [x] OAuth integration (future: Google, Apple Sign-In)

#### Onboarding
- [x] Multi-step form (7 steps)
- [x] BMR calculation (Mifflin-St Jeor)
- [x] TDEE calculation with activity multiplier
- [x] Daily goal calculation based on primary goal (loss/maintenance/gain)
- [x] Goal adjustment UI
- [x] BMI calculation and display
- [x] Time-to-goal estimate

#### Dashboard
- [x] Circular progress ring (remaining calories)
- [x] Macro breakdown cards (carbs/protein/fat)
- [x] Daily meal list
- [x] Add meal button/form
- [x] Edit meal functionality
- [x] Delete meal functionality
- [x] Water tracker (cups)
- [x] Quick stats (streak, last weight)

#### Meal Tracking
- [x] Food database search (USDA or local)
- [x] Calorie lookup and estimation
- [x] Quantity input (cups, grams, oz, etc.)
- [x] Macro estimation
- [x] Meal logging with timestamp
- [x] Meal history persistence

#### Statistics
- [x] Daily intake line chart
- [x] Date range selector (week/month/all-time)
- [x] Weight tracking & chart
- [x] Adherence metrics (streak, on-track %)
- [x] Average daily intake
- [x] Weight loss/gain velocity

#### Settings
- [x] Profile editing (age, height, weight, goal)
- [x] Goal recalculation
- [x] Unit preference (imperial/metric)
- [x] Daily water goal customization
- [x] Account deletion
- [x] Logout

### 5.2 Phase 2 Features (Post-MVP)
- [ ] Barcode scanning (via camera)
- [ ] Food photo recognition (AI)
- [ ] Meal suggestions/recipes
- [ ] Exercise logging & calorie burn calculation
- [ ] Social features (share progress, friends)
- [ ] Badges & achievements
- [ ] Dark mode
- [ ] Notification reminders
- [ ] Data export (CSV)
- [ ] User-defined custom foods

### 5.3 Non-Functional Requirements

#### Performance
- Page load time: <2 seconds (Lighthouse >90)
- API response time: <200ms (p90)
- Dashboard interaction response: <100ms
- Chart rendering: <500ms
- No jank on iOS Safari

#### Security
- HTTPS only (enforce via CSP)
- Passwords hashed with bcrypt (Supabase handles)
- CSRF protection (Supabase sessions handle)
- XSS prevention (React default + CSP)
- SQL injection prevention (Supabase parameterized queries)
- Rate limiting on auth endpoints (5 attempts/15 min)
- Session timeout after 30 days

#### Accessibility
- WCAG 2.1 AA compliance
- Color contrast ratio >4.5:1 for text
- Keyboard navigation (Tab, Enter, Escape)
- ARIA labels on interactive elements
- Semantic HTML (proper headings, form labels)
- Screen reader support tested (NVDA, VoiceOver)

#### Reliability
- 99.5% uptime SLA (via Supabase + Vercel)
- Real-time sync (Supabase Realtime, optional for MVP)
- Offline graceful degradation (show cached data)
- Error handling & user-friendly error messages
- Data backup (Supabase daily backups)

#### Browser Support
- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+
- iOS Safari 14+
- Chrome Mobile (Android 9+)

---

## 6. Data Model & Database Schema

### 6.1 Core Tables

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Onboarding data
  gender TEXT NOT NULL, -- 'male', 'female', 'other'
  age INT NOT NULL, -- 18-120
  height_cm INT NOT NULL, -- centimeters
  weight_kg DECIMAL(5, 2) NOT NULL, -- current weight in kg
  goal_weight_kg DECIMAL(5, 2) NOT NULL, -- target weight in kg
  activity_level TEXT NOT NULL, -- 'sedentary', 'light', 'moderate', 'active', 'very_active'
  primary_goal TEXT NOT NULL, -- 'lose', 'maintain', 'gain'
  daily_calorie_goal INT NOT NULL, -- calculated from BMR + TDEE
  
  -- Settings
  unit_preference TEXT DEFAULT 'metric', -- 'metric' or 'imperial'
  daily_water_goal_cups INT DEFAULT 8,
  macro_carbs_pct INT DEFAULT 40,
  macro_protein_pct INT DEFAULT 30,
  macro_fat_pct INT DEFAULT 30,
  
  -- Calculated fields
  bmr INT, -- basal metabolic rate
  tdee INT, -- total daily energy expenditure
  last_login TIMESTAMP,
  
  CONSTRAINT age_valid CHECK (age >= 18 AND age <= 120),
  CONSTRAINT height_valid CHECK (height_cm > 0),
  CONSTRAINT weight_valid CHECK (weight_kg > 0),
  CONSTRAINT goal_weight_valid CHECK (goal_weight_kg > 0)
);
```

#### Meals Table
```sql
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  food_name TEXT NOT NULL,
  quantity DECIMAL(8, 2) NOT NULL,
  quantity_unit TEXT NOT NULL, -- 'grams', 'cups', 'oz', 'ml', etc.
  calories INT NOT NULL,
  
  -- Macros (in grams)
  protein_g DECIMAL(5, 1),
  carbs_g DECIMAL(5, 1),
  fat_g DECIMAL(5, 1),
  
  meal_type TEXT, -- 'breakfast', 'lunch', 'dinner', 'snack' (optional)
  logged_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX (user_id, logged_at)
);
```

#### Weight Entries Table
```sql
CREATE TABLE weight_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  weight_kg DECIMAL(5, 2) NOT NULL,
  recorded_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE (user_id, recorded_at),
  INDEX (user_id, recorded_at)
);
```

#### Food Database Table (Optional Local Cache)
```sql
CREATE TABLE foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  food_name TEXT NOT NULL,
  brand TEXT,
  serving_size_g DECIMAL(8, 2),
  calories_per_serving INT,
  protein_g DECIMAL(5, 1),
  carbs_g DECIMAL(5, 1),
  fat_g DECIMAL(5, 1),
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE (food_name, brand, serving_size_g),
  INDEX (food_name)
);
```

### 6.2 Data Access Patterns
- **Dashboard Load**: Fetch today's meals + user daily goal (single query)
- **Weekly Stats**: Aggregate meals by date for past 7 days (SQL GROUP BY)
- **Weight Chart**: Fetch weight entries ordered by date (range query)
- **Food Search**: Full-text search on foods table (Postgres FTS)

---

## 7. User Interface & Design

### 7.1 Page Hierarchy

```
/login
/signup
/onboarding
  ├── step-1 (gender)
  ├── step-2 (age)
  ├── step-3 (height)
  ├── step-4 (weight)
  ├── step-5 (goal weight)
  ├── step-6 (activity level)
  └── step-7 (confirm goal)

/dashboard (main home page)
  ├── progress ring
  ├── macro breakdown
  ├── meals list
  ├── add meal modal
  └── water tracker

/stats
  ├── calorie chart
  ├── weight chart
  ├── adherence metrics
  └── date range selector

/settings
  ├── profile edit
  ├── goal recalculation
  ├── preferences
  └── account deletion

/add-meal (alternative: modal from dashboard)
  ├── food search
  ├── quantity input
  └── calorie confirmation
```

### 7.2 Color Palette (Tailwind)

```javascript
{
  'primary': '#10b981', // Green (achievement, on-track)
  'primary-dark': '#059669',
  'secondary': '#f97316', // Orange (emphasis)
  'secondary-dark': '#ea580c',
  'accent': '#8b5cf6', // Purple (accent, secondary actions)
  'danger': '#ef4444', // Red (over limit)
  'warning': '#eab308', // Yellow (close to limit)
  'success': '#10b981', // Green
  'neutral': '#64748b', // Gray text
  'bg-light': '#f8fafc',
  'bg-default': '#ffffff',
  'bg-dark': '#1e293b'
}
```

### 7.3 Typography
- **Headings**: Geist or Inter Bold, 24px-32px
- **Body**: Inter Regular, 14px-16px
- **Labels**: Inter Semibold, 12px-14px
- **Line height**: 1.5 (body), 1.2 (headings)

### 7.4 Component Library
- Progress ring (custom SVG or Recharts)
- Macro cards (flex cards with progress bars)
- Meal card (deletable, editable, timestamp)
- Input fields (text, number, date, select)
- Button (primary, secondary, danger)
- Modal/dialog (overlay, form container)
- Toast notifications (success, error, info)
- Chart (line chart with Recharts)
- Navigation (bottom tab bar on mobile, sidebar on desktop)

### 7.5 Mobile-First Considerations
- Touch targets min 48px x 48px
- Bottom navigation for main pages (dashboard, stats, settings)
- Full-width buttons and inputs
- Readable font sizes (min 16px input to avoid iOS zoom)
- Optimized for landscape and portrait
- Safe area padding on notch devices

---

## 8. API Specification

### 8.1 Authentication Endpoints

#### POST /api/auth/signup
Request:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```
Response (201):
```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "session_token": "jwt_token",
  "expires_at": "2025-01-06T12:00:00Z"
}
```

#### POST /api/auth/login
Request:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```
Response (200):
```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "session_token": "jwt_token",
  "expires_at": "2025-01-06T12:00:00Z"
}
```

#### POST /api/auth/logout
Request: (authenticated)
Response (200): `{ "message": "Logged out" }`

### 8.2 User Endpoints

#### GET /api/users/me
Request: (authenticated)
Response (200):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "age": 32,
  "height_cm": 170,
  "weight_kg": 75.5,
  "goal_weight_kg": 70,
  "activity_level": "moderate",
  "primary_goal": "lose",
  "daily_calorie_goal": 2100,
  "bmr": 1650,
  "tdee": 2475
}
```

#### PATCH /api/users/me
Request:
```json
{
  "age": 33,
  "activity_level": "active",
  "daily_calorie_goal": 2150
}
```
Response (200): Updated user object

#### DELETE /api/users/me
Request: (authenticated, requires password confirmation)
Response (204): No content

### 8.3 Meals Endpoints

#### GET /api/meals?date=2025-01-06
Request: (authenticated)
Response (200):
```json
{
  "date": "2025-01-06",
  "meals": [
    {
      "id": "uuid",
      "food_name": "Chicken Breast",
      "quantity": 150,
      "quantity_unit": "grams",
      "calories": 280,
      "protein_g": 53,
      "carbs_g": 0,
      "fat_g": 6,
      "logged_at": "2025-01-06T12:30:00Z"
    }
  ],
  "totals": {
    "calories": 1850,
    "protein_g": 120,
    "carbs_g": 150,
    "fat_g": 65
  }
}
```

#### POST /api/meals
Request:
```json
{
  "food_name": "Grilled Salmon",
  "quantity": 200,
  "quantity_unit": "grams",
  "calories": 420,
  "protein_g": 45,
  "carbs_g": 0,
  "fat_g": 25,
  "logged_at": "2025-01-06T18:00:00Z"
}
```
Response (201): Created meal object

#### PATCH /api/meals/{id}
Request: (authenticated)
Response (200): Updated meal object

#### DELETE /api/meals/{id}
Request: (authenticated)
Response (204): No content

### 8.4 Statistics Endpoints

#### GET /api/stats/week
Request: (authenticated, optional: ?date=2025-01-06)
Response (200):
```json
{
  "week_start": "2025-01-01",
  "days": [
    {
      "date": "2025-01-01",
      "calories": 1900,
      "goal": 2100,
      "on_track": true
    }
  ]
}
```

#### GET /api/stats/weight?range=month
Request: (authenticated)
Response (200):
```json
{
  "entries": [
    { "date": "2025-01-06", "weight_kg": 75.2 },
    { "date": "2025-01-05", "weight_kg": 75.5 }
  ],
  "stats": {
    "current": 75.2,
    "starting": 80.0,
    "change": -4.8,
    "change_per_week": -1.2
  }
}
```

#### POST /api/stats/weight
Request:
```json
{
  "weight_kg": 75.2,
  "recorded_at": "2025-01-06"
}
```
Response (201): Created weight entry

### 8.5 Food Database Endpoints

#### GET /api/foods/search?q=chicken
Request: (authenticated)
Response (200):
```json
{
  "results": [
    {
      "id": "uuid",
      "food_name": "Chicken Breast",
      "serving_size_g": 100,
      "calories_per_serving": 165,
      "protein_g": 31,
      "carbs_g": 0,
      "fat_g": 3.6
    }
  ]
}
```

---

## 9. Technical Architecture

### 9.1 Tech Stack
- **Frontend**: Next.js 15+ (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4+
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: Supabase (PostgreSQL, Auth, Realtime)
- **Charts**: Recharts
- **Forms**: React Hook Form (minimal)
- **HTTP**: fetch API + TanStack Query (React Query)
- **State**: React Context + Zustand (minimal)
- **Hosting**: Vercel
- **Analytics**: Vercel Analytics
- **Error Tracking**: Sentry (optional)

### 9.2 Authentication Flow
1. User signs up → Supabase Auth creates user + session
2. Session token stored in localStorage (with "Remember me")
3. Token included in Authorization header for all API requests
4. Token refreshed before expiry (Supabase handles)
5. On logout: token cleared from localStorage + backend

### 9.3 Data Flow
```
UI Component
  ↓ (User action)
React Hook / Context
  ↓ (Fetch/Mutation)
Next.js API Route
  ↓ (Authenticate)
Supabase Client
  ↓ (SQL Query)
PostgreSQL Database
  ↓ (Response)
API Route
  ↓ (Return JSON)
React Hook (refetch)
  ↓ (State update)
UI Component (re-render)
```

### 9.4 Folder Structure
```
calorie-tracker/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── page.tsx (dashboard)
│   │   ├── stats/page.tsx
│   │   ├── settings/page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/route.ts
│   │   │   ├── login/route.ts
│   │   │   └── logout/route.ts
│   │   ├── meals/route.ts
│   │   ├── meals/[id]/route.ts
│   │   ├── users/route.ts
│   │   ├── stats/route.ts
│   │   └── foods/search/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── dashboard/
│   │   ├── ProgressRing.tsx
│   │   ├── MacroCards.tsx
│   │   ├── MealList.tsx
│   │   ├── AddMealModal.tsx
│   │   └── WaterTracker.tsx
│   ├── stats/
│   │   ├── CalorieChart.tsx
│   │   ├── WeightChart.tsx
│   │   └── MetricsCards.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Toast.tsx
│   └── shared/
│       ├── Navigation.tsx
│       ├── Header.tsx
│       └── ProtectedRoute.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useMeals.ts
│   ├── useStats.ts
│   ├── useLocalStorage.ts
│   └── useSessionPersistence.ts
├── lib/
│   ├── supabase.ts
│   ├── calculations.ts (BMR, TDEE, macro math)
│   ├── fooddb.ts (USDA API or local data)
│   └── utils.ts
├── types/
│   └── index.ts
├── styles/
│   ├── globals.css
│   └── animations.css
├── public/
│   └── (images, icons)
├── .env.local (secrets)
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
└── package.json
```

---

## 10. Implementation Roadmap

### Phase 1: MVP (Weeks 1-8)
- Week 1-2: Setup, database schema, authentication
- Week 3-4: Onboarding flow & calculations
- Week 5-6: Dashboard & meal tracking
- Week 7: Statistics page
- Week 8: Settings, polish, testing, deployment

### Phase 2: Post-MVP (Weeks 9-12)
- Barcode scanning
- AI photo recognition
- Meal suggestions
- Exercise logging

### Phase 3: Growth (Weeks 13+)
- Social features
- Premium features
- Mobile app wrapper (React Native)
- Advanced analytics
- Integration with wearables

---

## 11. Success Criteria & Metrics

### Launch Metrics
- [ ] Zero critical bugs in first week
- [ ] 100% session persistence on mobile
- [ ] <2s dashboard load time
- [ ] 80% onboarding completion rate
- [ ] <30s meal logging time

### Month 1 Targets
- 100+ signups
- 60% Day 1 retention
- 30% Day 7 retention
- 100+ active daily users
- 500+ meals logged

### Longer-term Goals
- 10,000+ active monthly users by month 6
- 4.5+ star rating (if mobile app)
- <5% churn rate post-onboarding
- 50% of users logging meals 4+ days/week

---

## 12. Appendix: References & Resources

### Calorie Calculation Formulas
**Mifflin-St Jeor Formula for BMR:**
```
Men: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
Women: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161
```

**Activity Multipliers (TDEE = BMR × multiplier):**
- Sedentary (little/no exercise): 1.2
- Light (1-3 days/week): 1.375
- Moderate (3-5 days/week): 1.55
- Active (6-7 days/week): 1.725
- Very Active (2x per day/heavy labor): 1.9

**Goal-Based Adjustments:**
- Weight Loss: TDEE - 500 kcal (1 lb/week or ~0.5 kg/week)
- Maintenance: TDEE
- Muscle Gain: TDEE + 300 kcal

**Macro Split (default, customizable):**
- Carbs: 40% of daily calories
- Protein: 30% of daily calories (min 0.7g per lb body weight)
- Fat: 30% of daily calories

### Design Inspiration
- Cal AI (Screensdesign.com)
- Lifesum (Screensdesign.com)
- FitHub (Screensdesign.com)
- BiteSize (Apple App Store)
- MyFitnessPal (reference competitor)

### Food Database Sources
- USDA FoodData Central API (free, 350k+ foods)
- Nutritionix API (alternative)
- Spoonacular (premium, requires API key)
- Local CSV dataset (easiest, limited foods)

### Typography & Color Tools
- Tailwind CSS: tailwindcss.com
- Geist Font: vercel.com/font
- Inter Font: rsms.me/inter
- Color Contrast Checker: webaim.org/contrast

---

**Document Status**: Ready for Development  
**Next Action**: Schedule kickoff meeting, assign developer, begin sprinting

