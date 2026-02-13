# 💝 Digital Valentine's Project

A customizable, interactive Valentine's Day web experience featuring a countdown, a secret riddle lock, a playful "chase" question, and a personalized celebration dashboard.

## 🚀 Quick Start

1. **Clone the repo**
2. **Install dependencies:** `npm install`
3. **Configure your content:** 
   - Copy `.env.example` to `.env`
   - Fill in your personal messages, secret code, and special dates.
4. **Run locally:** `npm run dev`
5. **Build for production:** `npm run build`

## 🛠️ Customization Guide

All personal content can be managed via the `.env` file without touching the code:

- **Secret Code:** Set `VITE_LOCK_CODE` and a matching `VITE_LOCK_HINT`.
- **Countdown:** Set `VITE_UNLOCK_DATE` (YYYY-MM-DD) to ensure it opens exactly when you want.
- **Memories:** Add a comma-separated list of image URLs to `VITE_MEMORIES_IMAGES` to populate the gallery.
- **Messages:** Update the titles and personal notes in the Dashboard.

## 🤫 Giving a Preview (Without Spoilers)

If you're sharing this with other techy people, we recommend:
1. **Screenshot the Lock Screen:** It looks great but keeps the contents a secret.
2. **Debug Mode:** You can bypass the countdown by adding `?debug=true` to the URL.
3. **Social Preview:** The project is set up with a clean aesthetic that works well for "Work in Progress" screenshots!

## 📦 Tech Stack
- React + Vite
- Tailwind CSS
- Framer Motion (Animations)
- Lucide React (Icons)
- Canvas Confetti

---
*Created with ❤️ for Valentine's Day*
