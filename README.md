<p align="center">
  <img src="./public/favicon.svg" width="120" height="120" alt="Orbit Logo" />
</p>

<h1 align="center">Orbit</h1>

<p align="center">
  <strong>The Next-Generation AI-Native Code Editor</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Convex-Real--time-ff69b4?style=for-the-badge&logo=convex" alt="Convex" />
  <img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk" alt="Clerk" />
  <img src="https://img.shields.io/badge/Tailwind-CSS%204-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Gemini-AI-orange?style=for-the-badge&logo=google-gemini" alt="Gemini AI" />
</p>

---

Orbit is a state-of-the-art, AI-powered IDE designed to redefine the modern development experience. By weaving advanced artificial intelligence directly into the fabric of the editor, Orbit empowers developers to transcend traditional coding boundaries—writing, debugging, and architecting complex systems with unprecedented speed and precision.

## ✨ Key Features

- 🧠 **AI-Native Core**: A deeply integrated AI assistant powered by **Google Gemini** and the **Vercel AI SDK**, offering context-aware suggestions, instant refactoring, and intelligent debugging.
- ⚡ **Instantaneous Collaboration**: Built on the **Convex** real-time engine, Orbit ensures every keystroke and file change is synchronized across the cloud in milliseconds.
- 📂 **Reactive File System**: A sleek, high-performance file explorer with support for complex nested structures, multi-folder workspaces, and real-time state management.
- 💻 **Pro-Grade Editor**: A robust **CodeMirror 6** integration featuring syntax highlighting, indentation markers, and minimaps for 10+ languages including TypeScript, Python, C++, and more.
- 🔒 **Enterprise-Grade Security**: Seamless and secure user authentication, multi-tenant workspace isolation, and profile management handled by **Clerk**.
- 🎨 **Aesthetic Excellence**: A premium, glassmorphic UI crafted with **Tailwind CSS v4** and **Radix UI**, designed for focus, speed, and visual delight.
- 🛠️ **Integrated Toolchain**: Built-in terminal simulation, breadcrumb navigation, and customizable themes to create the perfect development environment.

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/) |
| **Backend** | [Convex](https://www.convex.dev/) (Real-time DB & Serverless) |
| **Authentication** | [Clerk](https://clerk.com/) |
| **AI Engine** | [Google Gemini](https://ai.google.dev/), [Vercel AI SDK](https://sdk.vercel.ai/) |
| **Editor** | [CodeMirror 6](https://codemirror.net/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/), [Shadcn/UI](https://ui.shadcn.com/) |
| **State** | [Zustand](https://zustand-demo.pmnd.rs/) |

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **Package Manager**: npm, yarn, or pnpm
- **Accounts**: Convex, Clerk, and Google AI Studio (for API keys)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vivek-736/AI-Code-Editor.git
   cd Orbit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
   ```

4. **Launch the Engine**
   Start the development server and the Convex backend:
   ```bash
   npm run dev
   # In a separate terminal
   npx convex dev
   ```

## 📂 Architecture

- `src/app`: The heart of the application, containing routes and layouts.
- `src/components`: Highly optimized, reusable UI components.
- `src/hooks`: Custom hooks managing editor state and AI interactions.
- `convex`: Backend schema definitions and serverless functions.
- `src/store`: Centralized global state management with Zustand.

---

<p align="center">
  Made with passion by Vivek
</p>