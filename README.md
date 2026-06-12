# Task Dashboard

A premium SaaS-style Task Management Dashboard built with React, Firebase Authentication, Firestore, Framer Motion, Recharts, React Toastify, React Icons, and modern CSS.

## Features

- Landing page with hero, feature overview, tech stack, version info, project highlights, and footer
- Explore page with product story, workflow, feature grid, and dashboard CTA
- Firebase Authentication with signup, login, logout, and password reset
- Firestore profile storage under `users/{userId}`
- Protected dashboard and account routes
- Real-time task CRUD under `tasks/{taskId}`
- Drag-and-drop Kanban board powered by `@hello-pangea/dnd`
- Status dropdown updates for accessibility and mobile friendliness
- Search and filters by status, priority, and due date
- Recharts analytics: status pie chart, priority bar chart, weekly productivity line chart
- Productivity score, current streak, best streak, badges, animated counters, and completion confetti
- Account center with profile details, user stats, activity timeline, edit profile, change password, and logout
- Dark/light theme toggle persisted in `localStorage`
- Responsive SaaS UI with glassmorphism, neumorphism, animated gradient background, floating particles, skeleton loaders, custom scrollbars, empty states, and floating action button
- Keyboard shortcut: `Ctrl + K` / `Cmd + K` creates a task

## Firebase Setup

1. Create a Firebase project.
2. Enable Authentication with Email/Password.
3. Create a Firestore database.
4. Copy `.env.example` to `.env`.
5. Add your Firebase web app values:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## Database Structure

```txt
users/{userId}
  profile: { firstName, lastName, username, email, avatarLetter, createdAt }
  stats: { currentStreak, bestStreak, lastCompletedDate }
  settings: { theme }

tasks/{taskId}
  userId
  title
  description
  priority
  status
  dueDate
  createdAt
  updatedAt
  completedAt

activities/{activityId}
  userId
  action
  timestamp
```

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Developer

Ayush Tripathi (B.Tech CSE Undergrad)

GitHub: https://github.com/ayushtripathi-45

