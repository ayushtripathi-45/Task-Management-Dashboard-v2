<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&height=280&color=0:0F172A,25:4F46E5,50:7C3AED,75:06B6D4,100:14B8A6&text=Task%20Dashboard%20V2&fontSize=52&fontColor=ffffff&animation=fadeIn&fontAlignY=40" width="100%"/>

<br>

<img src="https://readme-typing-svg.demolab.com?font=Poppins&weight=700&size=24&duration=2500&pause=1000&color=7C3AED&center=true&vCenter=true&width=900&lines=Premium+SaaS+Task+Management+Platform;Firebase+Authentication+%26+Firestore;Kanban+Board+with+Drag+and+Drop;Productivity+Analytics+%26+Streak+Tracking;Built+with+React+%2B+Firebase+%2B+Framer+Motion" />

<br><br>

<a href="https://task-management-dashboard-v2.web.app" target="_blank">
  <img src="https://img.shields.io/badge/🚀_Live_Demo-Click_Here-success?style=for-the-badge" />
</a>

<img src="https://img.shields.io/badge/Version-2.0.0-blueviolet?style=for-the-badge"/>

<img src="https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge"/>

<img src="https://img.shields.io/badge/License-MIT-orange?style=for-the-badge"/>

<img src="https://komarev.com/ghpvc/?username=ayushtripathi-45&label=Repository%20Views&color=7C3AED&style=for-the-badge"/>

</div>

---

# ✨ Overview

Task Dashboard V2 is a modern SaaS-inspired productivity platform designed to help users organize tasks, track progress, improve productivity, and visualize performance through a premium dashboard experience.

Built using modern frontend technologies, Firebase Authentication, Firestore, Framer Motion animations, and Recharts analytics.

---

# 🎥 Dashboard Preview

<p align="center">
<img src="./assets/demo.gif" width="100%">
</p>



https://github.com/user-attachments/assets/aae7bf72-77ea-4654-98b6-cb84e117295b



---

# 📸 Screenshots

## 🌞 Light Theme

<img width="1365" height="628" alt="image" src="https://github.com/user-attachments/assets/666ca3b2-b032-4051-8684-cb86d6770095" />


## 🌙 Dark Theme

<img width="1365" height="635" alt="image" src="https://github.com/user-attachments/assets/091196e7-29e9-4cd1-a12c-8dc0191755ba" />

---

# 🚀 Core Features

### 🔐 Authentication

* Firebase Authentication
* Email & Password Login
* Signup & Registration
* Password Reset
* Protected Routes

### 📋 Task Management

* Create Tasks
* Update Tasks
* Delete Tasks
* Status Updates
* Priority Levels
* Due Dates

### 🎯 Productivity System

* Daily Streak Counter
* Best Streak Tracker
* Productivity Score
* Achievement Badges
* Completion Confetti

### 📊 Analytics Dashboard

* Status Distribution Pie Chart
* Priority Analysis Bar Chart
* Productivity Trends
* Task Completion Insights

### 🎨 Premium UI/UX

* Glassmorphism Design
* Neumorphism Components
* Animated Background
* Floating Particles
* Dark / Light Mode
* Skeleton Loading States
* Empty States
* Smooth Page Transitions

---

---

# 🕘 Previous Release

## 📦 Task Dashboard V1

Task Dashboard V1 was the foundation of this project, focused on delivering a clean and responsive Kanban-style task management experience with core CRUD functionality and drag-and-drop workflow management.

### ✨ V1 Highlights

- 📝 Create, Edit & Delete Tasks
- 🎯 Task Status Management
- 🔄 Drag & Drop Kanban Board
- 🏷️ Categories & Priorities
- 📱 Fully Responsive Design
- 🌙 Dark Mode Support
- ⚡ TypeScript + Express Architecture

### 🔗 Explore Version 1

<p align="center">

<a href="[LIVE_LINK](https://task-management-dashboard-ochre.vercel.app/)">
<img src="https://img.shields.io/badge/🌐_Live_Demo_V1-Visit-success?style=for-the-badge"/>
</a>

<a href="https://github.com/ayushtripathi-45/Task_Management_Dashboard">
<img src="https://img.shields.io/badge/📂_Source_Code_V1-GitHub-181717?style=for-the-badge&logo=github"/>
</a>

</p>

### 🚀 Evolution to V2

Version 2 introduces a complete SaaS-style experience with:

- 🔐 Firebase Authentication
- ☁️ Firestore Database Integration
- 📊 Productivity Analytics
- 🔥 Streak Tracking System
- 👤 Account Center
- 🎨 Premium UI/UX Design
- ⚡ Real-time Updates
- 📈 Advanced Dashboard Statistics

---


# 🛠 Tech Stack

<p align="center">

<img src="https://skillicons.dev/icons?i=react,firebase,js,html,css,vite,git,github,vscode,npm" />

</p>

| Category       | Technology        |
| -------------- | ----------------- |
| Frontend       | React             |
| Routing        | React Router      |
| Authentication | Firebase Auth     |
| Database       | Firestore         |
| Charts         | Recharts          |
| Animations     | Framer Motion     |
| Notifications  | React Toastify    |
| Drag & Drop    | @hello-pangea/dnd |
| Icons          | React Icons       |
| Deployment     | Firebase / Vercel |

---

# 🏗 Application Architecture

```mermaid
flowchart TD

A[User] --> B[React Frontend]

B --> C[Firebase Authentication]

B --> D[Firestore Database]

B --> E[Analytics Engine]

D --> F[Tasks Collection]

D --> G[Users Collection]

D --> H[Activities Collection]

E --> I[Charts & Insights]
```

---

# 🔄 User Workflow

```mermaid
flowchart LR

A[Sign Up] --> B[Login]

B --> C[Access Dashboard]

C --> D[Create Tasks]

D --> E[Manage Status]

E --> F[Track Progress]

F --> G[Increase Productivity]

G --> H[View Analytics]
```

---

# 📂 Database Structure

```txt
users/{userId}
│
├── profile
│   ├── firstName
│   ├── lastName
│   ├── username
│   ├── email
│   └── avatarLetter
│
├── stats
│   ├── currentStreak
│   ├── bestStreak
│   └── lastCompletedDate
│
└── settings
    └── theme

tasks/{taskId}
│
├── userId
├── title
├── description
├── priority
├── status
├── dueDate
├── createdAt
├── updatedAt
└── completedAt

activities/{activityId}
│
├── userId
├── action
└── timestamp
```

---

# 📊 Dashboard Modules

| Module         | Description                        |
| -------------- | ---------------------------------- |
| Home           | Landing page with project overview |
| Explore        | Feature showcase and workflow      |
| Dashboard      | Main task management workspace     |
| Analytics      | Productivity insights              |
| Account Center | User profile and activity history  |
| Settings       | Theme and account preferences      |

---

# 🔥 Dashboard Features

## 📈 Statistics Cards

* Total Tasks
* Completed Tasks
* Upcoming Tasks
* In Progress Tasks
* Productivity Score
* Current Streak

---

## 📋 Kanban Board

* Upcoming
* In Progress
* Completed

Supports:

✅ Drag & Drop

✅ Status Updates

✅ Real-time UI Refresh

✅ Search & Filters

---

## 🎯 Account Center

Displays:

* User Information
* Account Creation Date
* Total Tasks
* Productivity Percentage
* Streak Statistics
* Activity Timeline

---

# ⚙️ Environment Variables

```env
VITE_FIREBASE_API_KEY=

VITE_FIREBASE_AUTH_DOMAIN=

VITE_FIREBASE_PROJECT_ID=

VITE_FIREBASE_STORAGE_BUCKET=

VITE_FIREBASE_MESSAGING_SENDER_ID=

VITE_FIREBASE_APP_ID=
```

---

# 🚀 Local Development

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

---

# 🔮 Future Roadmap

### Version 2.1

* Team Collaboration
* Shared Workspaces
* User Mentions
* Task Assignment

### Version 2.5

* Calendar View
* Recurring Tasks
* Push Notifications
* Email Reminders

### Version 3.0

* AI Task Suggestions
* AI Productivity Insights
* Smart Categorization
* Voice Commands

---

# 👨‍💻 Developer

### Ayush Tripathi

B.Tech Computer Science Engineering Student

<p align="center">

<a href="https://github.com/ayushtripathi-45">
<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github"/>
</a>

<a href="https://my-portfolio-basic-version.vercel.app/" target="_blank">
  <img src="https://img.shields.io/badge/Portfolio-7C3AED?style=for-the-badge&logo=vercel&logoColor=white"/>
</a>

</p>

---

# ⭐ Support

If you find this project useful:

⭐ Star the Repository

🍴 Fork the Repository

📢 Share with Other Developers

💡 Contribute to Future Releases

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&height=180&section=footer&color=0:0F172A,25:4F46E5,50:7C3AED,75:06B6D4,100:14B8A6"/>

### Made with ❤️ by Ayush Tripathi

### React • Firebase • Framer Motion • Firestore

</div>
