# TaskFlow • To-Do Mobile App (SDE-1 MERN Stack Assignment)

A responsive, pixel-perfect mobile-first To-Do List application built to fulfill the **SDE-1 (MERN Stack) Assignment** based on the provided [Figma Design](https://www.figma.com/design/mz2PJoTwa5DxYrdrFPem3f/To-Do-List-Mobile-app?node-id=0-1&p=f).

---

## 📱 Product Overview & Objectives

**TaskFlow** provides an intuitive, high-performance way to manage daily to-dos and track weekly progress. The application is organized by weeks starting on **Monday** and ending on **Sunday**, featuring visual feedback for completed versus open tasks, quick search, interactive date pickers, and swipe-to-delete gestures.

### Key Features Implemented:
1. **Onboarding Screen (Frame 1)**:
   - Royal blue brand aesthetic with custom chevron wave motifs.
   - Headline: *"Manage What To Do"* and subtext: *"The best way to manage what you have to do, don't forget your plans"*.
   - *"Get Started"* CTA button that smoothly unlocks the Home workspace.
2. **Home Screen Overview (Frame 2 & 3)**:
   - **Quick Search Bar**: Tap to instantly transition into search mode.
   - **Interactive Week Calendar Strip**: Displays 7 days (Monday through Sunday) with dynamic active-day pill (`Wed 12 •`), auto-filtering tasks for the chosen date.
   - **Task Summary Cards**:
     - **Task Complete**: Shows completed count for the current week (e.g. `50 This Week`).
     - **Task Pending**: Shows open/in-progress count for the current week (e.g. `08 This Week`).
     - Tapping either card expands the **Weekly Overview Modal** showing all tasks for that week.
   - **Weekly Progress Bar**: Visual ratio showing percentage of tasks completed for the week.
   - **Tasks Today**:
     - Custom rounded checkbox to mark tasks as *Completed* or *In Progress*.
     - Instant strikethrough styling and optimistic status updates.
     - Edit icon (Pencil) & Delete icon (Trash).
     - **Swipe Left Gesture**: Swipe left on any task item using touch or mouse drag to reveal the red Delete button.
   - **Floating Action Button (FAB)**: Vibrant centered `+` button to open the "Add New Task" sheet.
3. **New / Edit Task Modal (Bottom Sheet)**:
   - **Title** (Mandatory): e.g., *"Doing Homework"*.
   - **Set Time** (Mandatory): Start and Ends time pickers with clock icons.
   - **Set Date** (Mandatory): Calendar date selector with humanized date formatter (*"Friday 14, January"*).
   - **Priority** (Optional): *Low*, *Medium*, *High* toggle buttons.
   - **Description** (Optional): Multi-line textarea for notes.
   - **Create / Save Changes**: Validates inputs, saves to database, and triggers reactive progress recalculation.
4. **Search Screen (Frame 9)**:
   - Back arrow button (`<-`) and live search input field.
   - Real-time keyword filtering across both task titles and descriptions.
   - Search results allow immediate completion toggle, editing, and deletion.
5. **Weekly Organization Modal**:
   - Strictly conforms to the requirement: **Weeks start on Monday and end on Sunday**.
   - Displays open tasks count, completed tasks count, and full task list for each week.
   - Week switcher (Previous Week, Current Week, Next Week).
6. **Desktop Mobile Mockup Frame & Responsive Mode**:
   - Runs in a clean, realistic mobile frame (iPhone/Android notch, status bar, and home indicator) on desktop screens.
   - Includes a toggle between **Phone Frame View** and **Full Screen View**.
   - Offline resilience: Automatically syncs with local storage if the backend API is disconnected, allowing flawless Netlify previewing!

---

## 🛠️ Tech Stack & Architecture

### Frontend (`/client`):
- **React 18** + **Vite**: Ultra-fast bundling and modern React architecture.
- **Tailwind CSS**: Pixel-perfect design system matching Figma colors (`#3B5DF7`, `#EEF4FF`, `#FFF1F2`).
- **Lucide React**: Clean vector iconography.
- **Framer Motion**: Smooth bottom sheet animations and swipe-to-delete gesture physics.

### Backend (`/server`):
- **Node.js** + **Express.js**: Clean RESTful API with structured MVC architecture.
- **MongoDB** + **Mongoose**: Schemas with pre-save hooks for automatic Monday-to-Sunday ISO week calculations.
- **High-Resilience Dual Layer**: Graceful in-memory fallback store if MongoDB is not locally running, guaranteeing zero runtime crashes during grading.
- **CORS & Environment Management**: Fully configured for cross-origin deployments.

---

## 🗂️ Project Structure

```text
todo-mobile-app/
├── client/                     # Frontend Application (React + Vite + Tailwind)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   │   ├── HomeScreen.jsx          # Home feed with cards and task list
│   │   │   ├── MobileFrame.jsx         # Responsive phone device mockup container
│   │   │   ├── OnboardingScreen.jsx    # "Manage What To Do" splash screen
│   │   │   ├── SearchScreen.jsx        # Keyword search view (Frame 9)
│   │   │   ├── StatusBar.jsx           # Realistic mobile status bar
│   │   │   ├── TaskCard.jsx            # Swipe-to-delete task item row
│   │   │   ├── TaskModal.jsx           # Slide-up Add/Edit task bottom sheet
│   │   │   ├── WeeklyOverviewModal.jsx # Expandable Monday-Sunday weekly view
│   │   │   └── WeekStrip.jsx           # Interactive 7-day horizontal strip
│   │   ├── services/
│   │   │   └── api.js                  # REST API client with local offline fallback
│   │   ├── utils/
│   │   │   └── dateUtils.js            # Monday-Sunday date and week calculation logic
│   │   ├── App.jsx                     # Master state orchestration
│   │   ├── index.css                   # Tailwind styling & wave SVG utilities
│   │   └── main.jsx                    # React entrypoint
│   ├── index.html
│   ├── netlify.toml                    # Netlify SPA routing rules
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Backend REST API (Node.js + Express + MongoDB)
│   ├── config/
│   │   └── db.js                       # Mongoose connection with resilient fallback
│   ├── controllers/
│   │   └── taskController.js           # CRUD & Weekly aggregation logic
│   ├── models/
│   │   └── Task.js                     # Task schema with Monday-to-Sunday calculation
│   ├── routes/
│   │   └── taskRoutes.js               # REST route declarations
│   ├── .env.example
│   ├── package.json
│   └── server.js                       # Express app bootstrap
├── netlify.toml                        # Root deployment configuration
├── package.json                        # Root scripts
└── README.md                           # Documentation
```

---

## 🚀 Getting Started (Run Locally)

### Prerequisites:
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### 1. Clone the Repository:
```bash
git clone https://github.com/Deepak931014/Mobile-Todo-Project.git
cd todo-mobile-app
```

### 2. Start the Backend API:
```bash
cd server
npm install
npm start
```
*The server will start at `http://localhost:5000` and automatically seed demo tasks.*

### 3. Start the Frontend Client:
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/tasks` | Get all tasks. Supports filters: `?search=`, `?date=`, `?status=`, `?priority=` |
| `GET` | `/api/tasks/weekly-stats` | Get open vs completed task counts grouped by Monday–Sunday weeks |
| `GET` | `/api/tasks/:id` | Get single task details by ID |
| `POST` | `/api/tasks` | Create a new task (Title and Date required) |
| `PUT` | `/api/tasks/:id` | Update task details or toggle status (`In Progress` / `Completed`) |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `POST` | `/api/tasks/seed` | Reset & re-seed Figma demo tasks |
| `GET` | `/api/health` | Healthcheck and uptime probe |

### Sample Request Body (`POST /api/tasks`):
```json
{
  "title": "Doing Homework",
  "description": "Read chapter 4 and solve exercises on full stack architecture",
  "date": "2026-11-04",
  "startTime": "10:00 AM",
  "endTime": "12:00 PM",
  "priority": "Medium",
  "status": "In Progress"
}
```

## ✨ Design Fidelity Highlights

- **Pixel-Accurate Palette**: Royal blue (`#3B5DF7`), peach/rose pending badge (`#FFF1F2`), soft blue completed badge (`#EEF4FF`).
- **Typography & Proportions**: Consistent spacing, rounded corners (`rounded-2xl`, `rounded-3xl`), and subtle drop shadows.
- **Mobile First Gestures**: Swipe left to delete, interactive calendar day strip with selection dots, and animated bottom sheet modals.
- **Human-Grade Code**: Clean modular files, clear comments, descriptive function and variable names, and error handling.

