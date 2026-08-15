# Task Tracker Client Application

Hi! I'm Om Maheshwari, a Full Stack Developer specializing in building modern applications with Next.js, React, Node.js, Express, MongoDB and PostgreSQL. I craft efficient, scalable solutions that bridge ideas and reality.

Beyond web development, I'm deeply immersed in mastering Data Structures & Algorithms to build a rock-solid foundation in optimized problem-solving. This dual focus helps me write cleaner code and design performance-critical systems.

🔗 **Portfolio**: [https://om-maheshwari.vercel.app/](https://om-maheshwari.vercel.app/)  
🔗 **Backend Repository**: [Task Tracker Backend Repository](https://github.com/OmMaheshwari/task-tracker-backend) *(Placeholder Link)*

---

## 🎨 Design System & Framework Choice
- **Framework**: **Next.js (App Router v16)**. Approved as a web client alternative to React Native CLI.
- **Styling & Aesthetics**: Custom **Soft Light Glassmorphism UI** using Vanilla CSS utilities (`globals.css`) + Tailwind CSS v4. Features translucent frosted glass panels (`backdrop-blur-md`), ambient colorful mesh canvas background, animated SVG analog clock widget with rotating hands, and responsive layouts.
- **Timer Accuracy**: Custom `useLiveTimer` hook calculates elapsed time dynamically from `Date.now() - new Date(startTime).getTime()`, with automatic `visibilitychange` focus re-syncing so the timer remains 100% accurate when backgrounded and reopened.
- **Optimistic UI Updates**: 0ms UI latency when starting/stopping timers or creating tasks.

---

## 📱 2. How to Run Mobile/Client App & Change API Base URL

### Step A: Prerequisites
- Node.js v20+ and npm installed
- Task Tracker Express Backend running on `http://localhost:8080`

### Step B: Environment Variable Configuration
Create a `.env.local` file in the `client` directory (refer to `.env.example`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```
> **Where to change the API base URL**: Modify the `NEXT_PUBLIC_API_URL` variable in `client/.env.local` to point to your deployed or local backend server URL.

### Step C: Install & Run Client App
```bash
# 1. Install dependencies
npm install

# 2. Start Next.js Development Server
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 💡 Why Redux Was NOT Used
- **No Unnecessary Overhead**: Redux adds heavy boilerplate, serializable state restrictions, and store subscription latency for simple CRUD/timer states.
- **Native Efficiency**: Native React `useState`, `useContext` (`AuthContext`), custom hooks (`useLiveTimer`), and typed API client (`src/lib/api.ts`) provide 0ms latency, zero boilerplate overhead, and direct Optimistic UI updates.

---

## 🔑 3. Login Details for Test Users
Password for all test users: **`password123`**

- `alex@example.com`
- `sarah@example.com`
- `dev@example.com`

---

## ⏳ 6. Time Spent
- Roughly **8 hours** total across full-stack development, UI polish, testing, and documentation.
