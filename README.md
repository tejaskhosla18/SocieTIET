# 🏛️ SocieTIET

> **Centralized society recruitment portal, branch-to-club match engine, and live interview scheduler for Thapar Institute of Engineering & Technology (TIET).**

[![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](https://opensource.org/licenses/MIT)
[![TIET Campus Tech](https://img.shields.io/badge/Campus-TIET%20Patiala-red.svg)](#)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#)

---

## ⚡ The Problem

Every semester at TIET, recruitment drives for technical, cultural, and leadership societies devolve into administrative friction for both freshers and executive boards:

* **Form Fatigue & Lost Deadlines:** Students fill 10–15 distinct Google Forms across Linktree bios, losing track of deadlines buried under Instagram stories and WhatsApp group spam.
* **Interview Clashes & Ghosting:** Auditions and task interviews are scheduled manually. A student frequently gets called to LP (Learning Plaza) and C-Hall simultaneously by two different societies.
* **Information Asymmetry:** First-year students often don't know which chapters align with their technical or creative goals (e.g., distinguishing between CCS, GDG, MLSC, or OWASP for software tracks).

---

## 🚀 The Solution: What is SocieTIET?

**SocieTIET** centralizes the entire induction lifecycle into a single, responsive web dashboard:

1. 🎯 **Personalized Society Matcher:** Takes input on your branch, graduation year, technical/creative interests, and weekly commitment bandwidth to calculate an affinity match score (%) for campus chapters.
2. 📋 **One-Click Unified Application:** Auto-fills verified student credentials, portfolios, and department choices across active recruitment drives without repetitive form-filling.
3. 📍 **Live Interview Pipeline & Venue Tracker:** Track application progress (`Applied` ➔ `Task Review` ➔ `Interview Scheduled` ➔ `Decision`) complete with exact campus landmarks (e.g., *LP-102*, *Tan Auditorium Basement*), time slots, and calendar export tools.
4. 📚 **Rich Society Archive:** Browse authentic society profiles, leadership rosters, flagship fests (Saturnalia, Urja, HackMol, Makeathon), and past workshops.

---

## 🛠️ Tech Stack

* **Framework:** React / Vite, TypeScript
* **Styling & UI:** Tailwind CSS, Lucide React Icons
* **State & Persistence:** React Hooks / Context API + `localStorage` (Instant zero-backend demo)
* **Deployment:** Vercel / Netlify

---

## 📂 Project Structure

```text
src/
├── components/
│   ├── layout/          # Navbar, Footer, Notification Drawer
│   ├── matcher/         # Onboarding questionnaire & Match Score engine
│   ├── directory/       # Society cards, filters, and rich profile modals
│   ├── application/     # Dynamic induction form & domain selectors
│   └── tracker/         # Interview timeline cards, venue badges, calendar sync
├── data/
│   ├── societies.ts     # Seed data for TIET technical, cultural & media societies
│   └── venues.ts        # TIET landmarks (LP, C-Hall, T-Block, Auditorium)
├── types/
│   └── index.ts         # TypeScript interfaces for societies, applications & interviews
└── App.tsx              # Main dashboard routing and state container
