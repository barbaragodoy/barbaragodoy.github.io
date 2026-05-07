---
name: testing-portfolio
description: Test the static portfolio site end-to-end. Use when verifying HTML/CSS/JS changes, navigation, or content updates.
---

# Testing the Portfolio Site

## Prerequisites
- Node.js and npm installed
- Run `npm install` in the repo root to install Jest + jsdom

## Unit Tests
```bash
npm test
```
- Runs 51 Jest tests covering JS functions, HTML structure, and content
- Tests use `@jest-environment jsdom` for DOM simulation
- Expected output: "51 passed, 51 total"

## Visual E2E Testing

### 1. Start local server
```bash
python3 -m http.server 8080
```

### 2. Open in browser
Navigate to `http://localhost:8080`

### 3. Checklist
- [ ] Hero section: name "Bárbara Godoy", subtitle, "Ver Projetos" button visible
- [ ] Particles: cyan dots with connecting lines animating in background
- [ ] Navbar: click Sobre, Projetos, Tecnologias, Contato — each scrolls to correct section
- [ ] CTA button: "Ver Projetos" scrolls to projects section
- [ ] Project cards: 6 cards (Sappens AI, EVA AI Assistant, Cora AI Agent, Luke AI Platform, MCP AI Server, Framework Dev AI)
- [ ] Tech items: 16 items in grid (Python, Dart/Flutter, JavaScript, C#, Machine Learning, LLMs, Gemini AI, OpenAI, Google Cloud, Docker, Supabase, Firebase, Streamlit, n8n, APIs, DevOps)
- [ ] Hover effects: cards lift on hover, tech items get cyan background
- [ ] Contact links: GitHub and LinkedIn links are clickable with `target="_blank"` and `rel="noopener noreferrer"`
- [ ] Footer: "© 2026 Bárbara Godoy" and "AI Engineer • Software Developer"

## Notes
- The site is a single-page static portfolio. No backend or API.
- CSS is in `css/styles.css`, JS in `js/main.js`, tests in `tests/main.test.js`.
- particles.js is loaded via CDN; if CDN is unreachable, particles won't render but the rest of the site will work.
- The `console.warn` messages in test output (e.g., "particles.js library not loaded") are expected — they come from negative-path tests.
