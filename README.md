# 🎬 AI Videos v1 — Neural Cinema & AI Video Generation Studio

**AI Videos v1** is a next-generation web application for creating, parameterizing, scrubbing, rendering, and remixing AI-generated videos.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Design_System-1572B6?logo=css3&logoColor=white)

---

## ✨ Features

- 🧙‍♂️ **Prompt & Parameter Studio**: Magic AI prompt enhancer, negative prompts, seed controls, camera motion matrix (Pan, Zoom, Orbit 360°, FPV Drone), aspect ratios (16:9, 9:16, 1:1, 4:5), and FPS selector.
- 🤖 **Multi-Model Support**: Select between Sora v2, Runway Gen-3 Alpha, Luma Dream Machine, Flux Video, and Pika 2.0.
- 🎞️ **Interactive Canvas & Scrubbing Timeline**: HTML5 Video player with live frame scrubbing, position timestamp tracking, resolution switcher (720p, 1080p, 4K), and MP4 export.
- ⚡ **Neural Render Pipeline Queue**: Real-time multi-stage render job simulation with stage indicators and progress percentage.
- 🌌 **Showcase Gallery & Prompt Remix Engine**: Filterable video cards with auto-play on hover and one-click prompt remixing.
- 💎 **Modern Dark Glassmorphism UI**: High-contrast studio theme with glowing neon accents, custom scrollbars, and smooth micro-animations.

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/yvano-code/ai-videos-v1.git
cd ai-videos-v1
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 📂 Project Structure

```
ai-videos-v1/
├── src/
│   ├── components/
│   │   ├── Header.tsx         # Top studio navigation & credits indicator
│   │   ├── VideoStudio.tsx    # Prompt builder, model selector, & parameter matrix
│   │   ├── VideoCanvas.tsx    # HD Video player & scrubbing timeline
│   │   ├── GenerationQueue.tsx# Neural render job status monitor
│   │   └── VideoGallery.tsx   # Curated showcase feed & remix engine
│   ├── data/
│   │   └── mockVideos.ts      # Models, presets, & video library dataset
│   ├── App.tsx                # Main layout & state orchestrator
│   ├── index.css              # Glassmorphism design tokens & styles
│   └── main.tsx               # Entrypoint
└── package.json
```
