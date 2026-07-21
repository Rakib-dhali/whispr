<div align="center">

# Whispr Client 🎨📱

> **whispr-client** is the frontend application for Whispr, built with React 19, TypeScript, Vite, Tailwind CSS v4, and Zustand. It provides a real-time messaging user interface with audio feedback, image preview uploads, online presence indicators, and a seamless chat experience across desktop and mobile browsers.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-5-764ABC?style=for-the-badge)](https://zustand-demo.pmnd.rs/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 💎 UI/UX Philosophy

The frontend was designed not just to be functional, but to be a delight to use.
- **Micro-interactions:** Subtle hover states, smooth entry animations (`animate-in`), and custom scrollbars elevate the standard chat interface.
- **Sensory Feedback:** A bespoke audio system (toggleable via the UI) provides satisfying mechanical keystrokes and distinct notification chimes, bridging the gap between digital and physical interaction.
- **Fluid Layouts:** The transition between the sidebar contact list and active chat view is handled natively via Tailwind's responsive breakpoints, ensuring a native-app feel on mobile devices.

---

## 🔥 Key Frontend Features

### 1. **State-Driven Real-Time Chat Engine**
- Integrated with `Socket.io-client` for instant message delivery and live presence updates.
- Real-time event handling using Zustand store actions with memory-leak-safe subscription cleanups (`subscribeToMessage`).

### 2. **WhatsApp-Inspired Aesthetic Design**
- Warm visual layout using tailored color palettes (`#EDE7DD`, `#F6F0E8`, `#0F3D2E`, `#22C55E`).
- Grouped date separators ("TODAY", "YESTERDAY", formatted dates) matching chat app design standards.
- Custom thin scrollbars, smooth auto-scroll to latest messages (`scrollIntoView`), and dynamic bubble tail SVG paths.

### 3. **Auditory Keystroke & Notification System**
- **Mechanical Keystroke Soundscape**: Plays randomized mechanical keyboard typing sounds as users type messages.
- **Auditory Notifications**: Plays subtle chime sound effects when new real-time messages arrive.
- User-controlled toggle for sound effects with local storage persistence.

### 4. **Rich Media Upload & Preview**
- Base64 client-side image reader for dynamic image previews before sending.
- Smooth image modal previews and remove handlers.

### 5. **Fully Responsive Mobile Interface**
- Dual view setup: auto-toggles between Sidebar contact list and active Chat view on mobile breakpoints (`md:hidden` / `md:flex`).

---

## 🏗️ Architecture & State Management

```
whispr-client/src/
├── assets/
│   └── sounds/              # Mechanical typing audio & notification chimes
├── components/
│   ├── Chat.tsx             # Main Chat Interface (Sidebar, ContactItem, ChatArea)
│   ├── Home.tsx             # Marketing & Product Landing Page
│   ├── Login.tsx            # Form validation, error handling, & login auth
│   ├── Signup.tsx           # User registration form with validation
│   └── Loader.tsx           # Accessible full-page spinner
├── lib/
│   ├── axioxInstance.ts     # Pre-configured Axios with credentials & base URL
│   ├── keyStrokeSound.ts    # Web Audio / HTML5 audio player functions
│   ├── useAuthStore.ts      # Authentication & Socket connection state manager
│   └── useChatStore.ts      # Contacts, active chat, messages, & real-time socket events
├── App.tsx                  # Client router, protected routes, & auth check initialization
└── main.tsx                 # React DOM mount point
```

### Store Highlights

#### `useAuthStore`
Handles global authentication state, checking cookie-based sessions on app load (`checkAuth`), maintaining connected Socket.io client instances, and updating the array of `onlineUsers`.

#### `useChatStore`
Manages contact lists, active chat user (`selectedUser`), message history, sending messages with base64 images, and managing socket subscriptions for real-time `"newMessage"` event processing.

---

## 🛠️ Tech Stack

- **Framework**: React 19 (Hooks, Context, Functional Components)
- **Language**: TypeScript 6 (Strict types, Interface definitions)
- **Build Tool**: Vite 8 with HMR
- **State Management**: Zustand 5
- **Icons**: React Icons (`react-icons/hi2`)
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios

---

## 🚀 Getting Started

### Prerequisites
Make sure `whispr-server` is configured and running locally or deployed.

### Installation

```bash
# Navigate to the client folder
cd whispr-client

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

The app will start at `http://localhost:5173`.

### Production Build

```bash
npm run build
```

This compiles TypeScript using `tsc -b` and builds optimized static assets via `vite build` into the `dist/` directory.

---

## 📜 Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite development server with HMR |
| `npm run build` | Compiles TypeScript and builds production dist |
| `npm run lint` | Executes ESLint analysis across codebase |
| `npm run preview` | Serves production build locally for verification |
