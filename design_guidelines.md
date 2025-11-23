# Online Gym Management Platform - Design Guidelines

## Design Approach

**Selected Approach:** Design System (Material Design principles adapted for fitness/wellness)

**Justification:** This platform is utility-focused with complex data management needs (client tracking, analytics, scheduling, diet plans). Material Design provides robust patterns for dashboards, data tables, and forms while allowing customization for the fitness context.

**Key Design Principles:**
- Clarity over decoration: Information hierarchy must be immediately scanable
- Energy through motion: Use purposeful micro-interactions for engagement tracking and progress visualization
- Trust through professionalism: Clean, organized layouts that convey reliability

## Typography

**Font Stack:**
- Primary: Inter (Google Fonts) - all UI elements, body text, data tables
- Display: Montserrat Bold - dashboard headers, package names, section titles

**Hierarchy:**
- Hero/Main Headers: Montserrat Bold, 3xl-4xl, tracking-tight
- Dashboard Section Headers: Montserrat Bold, 2xl, tracking-tight
- Card/Component Titles: Inter Semi-bold, lg-xl
- Body/Data: Inter Regular, base
- Captions/Meta: Inter Regular, sm, reduced opacity

## Layout System

**Spacing Primitives:** Tailwind units of 3, 4, 6, 8, 12, 16
- Component padding: p-6 or p-8
- Section gaps: gap-6 or gap-8
- Page margins: py-12 or py-16
- Card spacing: p-6
- Form fields: p-3 or p-4

**Grid System:**
- Admin Dashboard: 12-column grid with sidebar (3 cols) + main content (9 cols)
- Client Dashboard: Full-width with max-w-7xl container
- Package Cards: grid-cols-1 md:grid-cols-3 with gap-6
- Analytics: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 for stat cards

## Component Library

### Navigation
**Admin Sidebar:**
- Fixed left sidebar (w-64) with navigation items
- Active state: filled background treatment
- Icons from Heroicons (outline for inactive, solid for active)
- Sections: Dashboard, Clients, Videos, Diet Plans, Live Sessions, Analytics

**Client Top Nav:**
- Horizontal navigation bar with user profile dropdown
- Links: My Dashboard, Workouts, Diet Plan, Live Sessions, Progress

### Dashboard Components
**Stat Cards:**
- Elevated cards (shadow-md) with icon, metric number (3xl), and label
- Grid layout for multiple stats
- Admin: Total Clients, Active Users, Revenue, Package Distribution
- Client: Workout Streak, Calories Burned, Sessions Completed, Next Session

**Data Tables:**
- Striped rows for readability
- Sortable headers with arrow indicators
- Action buttons (edit, view, delete) in right column
- Sticky header on scroll
- Used for: Client list, Video library, Diet plans, Session schedule

**Package Selection Cards:**
- Three equal-width cards with elevation
- Package name header, feature list with checkmarks, prominent price, CTA button
- Feature icons for visual scanning
- Basic: video icon | Premium: + plate icon | Elite: + calendar icon

**Video Library Grid:**
- Card-based grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Thumbnail image, duration badge, category tag, title
- Hover: subtle elevation increase

**Diet Plan Display:**
- Daily meal cards organized in timeline format
- Meal name, time, calorie count, macro breakdown (protein/carbs/fats)
- Expandable for full ingredient list

**Analytics Charts:**
- Line chart: Client growth over time
- Pie chart: Package distribution
- Bar chart: Revenue by package
- Use Chart.js library via CDN

**Live Session Cards:**
- Upcoming sessions with date/time, trainer name, capacity indicator
- Join button (for clients) or Manage button (for admin)
- Status badges: Upcoming, In Progress, Completed

### Forms
**Input Fields:**
- Floating labels
- Clear focus states (ring treatment)
- Validation feedback inline
- Forms: Client registration, Diet plan creation, Session scheduling, Video upload

**Buttons:**
- Primary: Large, prominent for main actions (Subscribe, Join Session, Save)
- Secondary: Outlined for secondary actions (Cancel, View Details)
- Icon buttons for quick actions in tables/cards
- Sizes: Small (p-2), Medium (p-3), Large (p-4)

### Overlays
**Modals:**
- Video player modal (full-screen option)
- Client detail modal with tabs (Info, Progress, Diet, Sessions)
- Confirmation dialogs for destructive actions
- Diet plan assignment with client selector

**Toasts:**
- Top-right positioned notifications
- Success, error, info states
- Auto-dismiss after 5 seconds

## Images

**Hero Section (Landing/Login Page):**
- Large hero image: Energetic gym environment with people working out
- Overlay gradient for text readability
- Placement: Full-width, min-h-screen on landing page
- CTA buttons with backdrop-blur-sm background

**Dashboard Backgrounds:**
- Subtle pattern or texture, minimal distraction
- Client dashboard: Motivational gym photo with heavy overlay in header section

**Video Thumbnails:**
- 16:9 aspect ratio thumbnails for all workout videos
- Action shots of exercises being performed
- Consistent quality and framing

**Client Profile Avatars:**
- Circular avatars (40px for tables, 80px for profiles)
- Placeholder with initials if no image uploaded

**Empty States:**
- Illustrative graphics for: No videos yet, No diet plan assigned, No upcoming sessions
- Centered with helpful text and action button

## Animations

**Micro-interactions Only:**
- Card hover: translateY(-2px) with shadow increase
- Progress bars: Smooth fill animation on data load
- Toast entrance: Slide-in from right
- Tab switching: Subtle crossfade

**No:** Page transitions, scroll animations, loading spinners beyond standard circular loaders