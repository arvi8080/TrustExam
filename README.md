# TrustExam - Secure Online Examination System

**SDE Goal:** Build scalable, secure exam platform with real-time anti-cheating, role-based dashboards, achievements system, Docker-ready. Demonstrate full-stack skills (React/Node/Mongo), auth/JWT, middleware, models, Tailwind UI.

**SDG Goal:** SDG 4 - Quality Education: Accessible online exams for remote learning, skill certification in underserved areas, promoting equitable education access worldwide.

## Overview
TrustExam is a full-stack online exam platform with anti-cheating, badges, achievements, trust scores, audit logs, and admin controls. Built with React/Vite/Tailwind (frontend), Node/Express/MongoDB (backend).

## Features
- **Student**: Dashboard, exams, progress save, results, achievements, profile, trust score.
- **Admin**: Create exams/questions/badges, monitor live sessions, manage students (block), view results/audit logs.
- **Security**: Anti-cheating (tab switches, IP tracking), JWT auth, role-based access, blocked users.
- **Advanced**: Auto-submit on cheating/timeup, PDF results, ranks, email invites/permissions.

## UI/UX Design Principles

### Current UI/UX Concepts Used:
- **Utility-First Styling (TailwindCSS)**: Enables rapid development of consistent, responsive designs across devices using utility classes.
- **Component-Based Architecture (React)**: Modular, reusable components for dashboards, login, and exam interfaces ensuring maintainability and smooth user flows.
- **Mobile-Responsive Layouts**: Flexbox and CSS Grid for adaptive interfaces that work seamlessly on desktop, tablet, and mobile.
- **Intuitive User Feedback**: Real-time progress indicators, visual trust scores, and anti-cheat notifications to guide users effectively.
- **Minimalist Exam Interface**: Clean design focused on exam content, timers, and navigation to minimize distractions and cognitive load.

### Future UI/UX Enhancements:
- **Animations & Micro-interactions**: Integrate Framer Motion for engaging transitions like badge unlocks and loading states.
- **Dark Mode & Custom Theming**: Leverage Tailwind's dark mode variants and user preferences for better accessibility.
- **Advanced Accessibility**: Full ARIA support, keyboard navigation, screen reader compatibility, and WCAG 2.1 compliance.
- **Performance Optimizations**: Lazy loading, code splitting, and Progressive Web App (PWA) features for faster, offline-capable exams.
- **AI-Driven Personalization**: Adaptive interfaces based on user behavior, personalized dashboards, and dynamic content recommendations.
- **Data Visualization**: Interactive charts (e.g., Recharts) for results, ranks, and analytics.

## Quick Start (Development)
1. **Prerequisites**: Node.js, MongoDB (local or Atlas - set MONGO_URI in backend/.env).
2. **Backend**:
   ```
   cd backend
   npm install
   npm run dev
   ```
   - Runs on http://localhost:5001

3. **Frontend**:
   ```
   cd frontend
   npm install
   npm run dev
   ```
   - Runs on http://localhost:5173

4. **Test**:
   - Open http://localhost:5173
   - Register (student/admin) → Login → Dashboard
   - Admin: Create exam/question, invite students.
   - Student: Take exam (anti-cheating active).

## Docker Deployment
```
docker-compose up --build
```
- Frontend: Nginx (80)
- Backend: 5001
- MongoDB: 27017

## Environment Variables (backend/.env)
```
MONGO_URI=mongodb://localhost:27017/trustexam
JWT_SECRET=your_jwt_secret
PORT=5001
```

## Project Structure
```
.
├── backend/
│   ├── models/ (User, Exam, Question, Result...)
│   ├── routes/ (auth, admin, student)
│   ├── middleware/ (auth, antiCheating)
│   ├── services/ (email)
│   └── server.js
├── frontend/
│   ├── src/components/ (Login, Dashboards, Exam)
│   ├── src/App.jsx (routing/auth)
│   └── tailwind/Vite config
├── docker-compose.yml
└── README.md
```

## Database Schemas
- **User**: username, email, password, role, trustScore, isBlocked.
- **Exam**: title, duration, times, questions[], permissions.
- **Result**: answers, score, anti-cheating flags.
- **Badge/Achievement**: criteria-based rewards.

## Anti-Cheating
- Tab switches tracked.
- Progress auto-save.
- Auto-submit on time/cheating.
- Admin live monitoring.

## API Endpoints
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | public | Create user |
| POST | /api/auth/login | public | Login |
| GET | /api/student/exams | student | Available exams |
| POST | /api/admin/exams | admin | Create exam |
| ... | ... | ... | ... |

## Troubleshooting
- **Login fails**: Register first (no seed). "Invalid credentials" = wrong email/pass.
- **Mongo error**: Check MONGO_URI, DB connection logs.
- **Port conflict**: Kill processes (taskkill /IM node.exe /F), restart.
- **Chunk error**: Vite dev, ignore or hard reload.

## License
MIT
