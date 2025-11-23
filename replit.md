# FitPro - Online Gym Management System

## Overview
FitPro is a comprehensive online gym management system for administrators and clients, offering distinct dashboards and supporting Basic, Premium, and Elite subscription tiers. Clients access a video workout library, diet management, live training, and progress tracking. Administrators utilize tools for client management, video library curation, diet/workout plan generation, session scheduling, and analytics. The project aims to provide a scalable and intuitive platform for fitness businesses to manage operations and engage clientele.

## User Preferences
I prefer detailed explanations and a collaborative development process. Please ask for my input before implementing major changes or making significant architectural decisions. I value clear communication and a structured approach to problem-solving.

## System Architecture

### UI/UX Decisions
The system uses a fitness-focused Material Design with a blue, orange, and green color scheme. Inter and Montserrat fonts are used for typography. The UI is built with `shadcn/ui` and Tailwind CSS for responsiveness, featuring dark and light theme toggles.

### Technical Implementations
- **Frontend**: React with TypeScript and Vite.
- **Backend**: Express.js with TypeScript.
- **Database**: MongoDB Atlas via Mongoose.
- **UI Framework**: `shadcn/ui` and Tailwind CSS.
- **Routing**: Wouter.
- **State Management**: TanStack Query (React Query v5).

### Feature Specifications
**Client Dashboard**:
- Personalized content (videos, sessions).
- Progress tracking: weekly workout calendar, visual goal tracking (Weight & Workouts), achievements.
- Body Composition Calculator: BMI, BMR, TDEE, ideal weight, calorie recommendations.
- Interactive elements: video playback, category filtering, notifications.
- Goal Setting & Management: CRUD for weight, fitness, nutrition goals with milestone tracking and visual progress.
- Progress Tracking System: Weight tracking, body measurements, progress charts, achievements, personal records, weekly completion, monthly reports.

**Admin Dashboard**:
- Client Management: CRUD operations, search, detailed profiles.
- Content Management: Video library tools, diet/workout plan generation with export.
- Session Management: Schedule and oversee live training.
- Analytics & Revenue: Visualizations for clients, revenue, growth, package distribution, activity.
- Revenue & Payment Management: Payment tracking, invoicing, refunds, revenue analytics with various financial reports and export functionality.
- Video & Workout Library Management: CRUD for videos with advanced filtering, analytics (views, completions), draft management, equipment tracking, trainer assignment, and difficulty/intensity levels.
- Document Viewer: Reusable component for viewing client documents (ID proofs, medical certificates) directly within the application using a modal.

### System Design Choices
- **Modular Structure**: `client/` and `server/` directories.
- **API-Driven**: RESTful API endpoints for all data operations.
- **Automated Seeding**: MongoDB seeded with demo data on server startup.
- **Controlled Components**: Forms with validation.
- **Responsive Design**: Fully responsive across devices.

## Recent Changes
### November 22, 2025 - UI Streamlining and Real Data Integration
Streamlined the user interface and ensured all data displayed is from the actual database:

**Changes Made:**
1. **Client Dashboard Header Cleanup**:
   - Removed CalculatorDialog and NotificationBell components
   - Kept only SessionReminders icon for 10-minute session notifications
   - Cleaner, more focused header design

2. **Client Profile Page Redesign**:
   - Removed Payments and Preferences tabs
   - Updated to 4-tab layout: Personal, Health, Subscription, Privacy
   - Subscription tab now displays real data from database:
     - Actual package price (from `client.packageId.price`)
     - Real features list (from `client.packageId.features`)
     - Subscription end date (from `client.subscriptionEndDate`)
     - Payment method (from `client.paymentMethod`)
   - Removed unused payments query

3. **Admin Sidebar Consolidation**:
   - Merged "Analytics" and "Reports" into single "Analytics & Reports" menu item
   - Reduced from 9 to 8 total menu items
   - Both analytics pages already fetch real data from API endpoints:
     - `/api/admin/analytics/client-stats`
     - `/api/admin/analytics/video-performance`
     - `/api/admin/analytics/session-attendance`
     - `/api/admin/analytics/revenue`
     - `/api/admin/analytics/retention`
     - `/api/admin/analytics/engagement-report`

**Impact:**
- Cleaner, more streamlined UI
- All displayed data comes from actual database queries
- No mock or placeholder data in subscription information
- Better organized admin navigation

### November 21, 2025 - Critical Fix: Trainer Sessions and Clients Not Loading
Fixed a critical authentication endpoint issue that prevented trainers from seeing assigned sessions and clients:

**Root Cause:**
- All trainer and admin dashboard pages were querying `/api/me` (non-existent endpoint) instead of `/api/auth/me`
- This caused the user object to be null/undefined, making trainerId undefined
- With no trainerId, all trainer-specific data queries were disabled and never executed

**Changes Made:**
1. **Updated API Endpoint**: Changed all pages to query `/api/auth/me` instead of `/api/me`
   - trainer-dashboard.tsx
   - trainer-clients.tsx
   - trainer-analytics.tsx
   - trainer-diet.tsx
   - trainer-sessions.tsx
   - admin-dashboard.tsx

2. **Fixed User Data Extraction**: 
   - Response structure from `/api/auth/me` is `{ user: {...}, client: {...} }`
   - Extract user from `authData.user` instead of directly from response
   - Use `user?._id?.toString() || user?.id` to get trainerId as string (handles both ObjectId and string formats)

3. **Impact**: 
   - Trainers can now see sessions assigned to them by admin
   - Trainers can now see clients assigned to them
   - All trainer dashboard analytics and data now load correctly

**Technical Details:**
- `/api/auth/me` endpoint at server/routes.ts:274 returns authenticated user with proper JWT validation
- trainerId must be a string to match MongoDB queries in getTrainerSessions and getTrainerClients
- Mongoose provides both `_id` (ObjectId) and `id` (string virtual), using fallback ensures compatibility

### November 21, 2025 - Comprehensive Session Assignment Fixes
Fixed four critical issues in the live session assignment system to ensure proper UI state management and data synchronization:

1. **Trainer Dialog Persistence**: Dialog now correctly shows currently assigned trainer when reopened
   - Created new `/api/sessions/:sessionId/assignments` endpoint that returns trainer and client assignments
   - Updated useEffect to properly initialize selectedTrainer state when dialog opens and reset on close
   - Added "Currently Assigned" badge to show which trainer is assigned

2. **Batch Count Display**: Fixed batch count to show correct total (e.g., 1/10 instead of 0/10)
   - Changed calculation from `selectedClients.length` to `sessionClients.length + selectedClients.length`
   - Now accurately reflects both already assigned and newly selected clients

3. **Prevent Duplicate Trainer Assignment**: Disabled re-selection of already assigned trainer
   - Added logic to disable checkbox for currently assigned trainer
   - Trainer can only be changed to a different trainer, not re-assigned the same one

4. **Trainer Dashboard Data**: Verified proper session and client data display in trainer dashboards
   - Confirmed getTrainerSessions correctly populates clients array
   - Validated data synchronization between SessionClient records and LiveSession.clients array

### Implementation Details
- **New API Endpoint**: GET `/api/sessions/:sessionId/assignments` returns current trainer ID, trainer name, client IDs, and client count
- **Dialog State Management**: useEffect properly handles open/close lifecycle, initializing from API and resetting cleanly
- **UI Enhancements**: Added visual indicators (badges, disabled states) to improve user experience and prevent errors
- **Data Consistency**: All assignment operations maintain synchronization between SessionClient collection and LiveSession.clients array

## External Dependencies
- **MongoDB Atlas**: Cloud-hosted NoSQL database.
- **Mongoose**: ODM for MongoDB.
- **Stripe (Planned)**: For payment processing.
- **Replit Auth (Planned)**: For authentication.