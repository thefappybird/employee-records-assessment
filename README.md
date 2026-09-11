<div align="center">
  <img height="150" src="https://media.giphy.com/media/M9gbBd9nbDrOTu1Mqx/giphy.gif"  />
</div>

###

<div align="center">
  <a href="https://linkedin.com/in/alexander-banaag" target="_blank">
    <img src="https://img.shields.io/static/v1?message=LinkedIn&logo=linkedin&label=&color=0077B5&logoColor=white&labelColor=&style=for-the-badge" height="25" alt="linkedin logo"  />
  </a>
  <a href="+971 50 423 4592" target="_blank">
    <img src="https://img.shields.io/static/v1?message=Whatsapp&logo=whatsapp&label=&color=25D366&logoColor=white&labelColor=&style=for-the-badge" height="25" alt="whatsapp logo"  />
  </a>
  <a href="alex.banaag1@gmail.com" target="_blank">
    <img src="https://img.shields.io/static/v1?message=Gmail&logo=gmail&label=&color=D14836&logoColor=white&labelColor=&style=for-the-badge" height="25" alt="gmail logo"  />
  </a>
</div>

###

<div align="center">
  <img src="https://visitor-badge.laobi.icu/badge?page_id=thefappybird.thefappybird&"  />
</div>

###

<h1 align="center">Hello Suadeo Team!</h1>

###

<h3 align="center">🛠 Language and tools used 🛠</h3>

###

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="40" alt="react logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original-wordmark.svg" height="40" alt="tailwindcss logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg" height="40" alt="sass logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" height="40" alt="github logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="40" alt="javascript logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" height="40" alt="typescript logo"  />
  <img width="12" />
  <img src="https://devicons.io/devicons/icons/react-query-icon.svg" height="40" alt="typescript logo"  />
  <img width="12" />
  <img src="https://devicons.io/devicons/icons/axios.svg" height="40" alt="typescript logo"  />
</div>

###

<h3 align="center">👩‍💻  About the Machine Test Project</h3>

###

<p align="left">This repository is my submission for the React front-end technical assessment: a modular <strong>Employee Records</strong> management app built with React 19, TypeScript, Vite, Tailwind CSS, Sass, TanStack Query, TanStack Virtual, Zustand, and Axios. It supports the full employee workflow: search and multi-select department filtering, newest-first pagination with selectable page sizes, create/edit/delete actions, CSV/JSON export, inline form validation, confirmation dialogs, and toast feedback for successful changes.</p>

<p align="left">Employee data is served through a typed service layer backed by an in-memory mock REST API implemented as a custom Axios adapter. The application remains a single-process front-end with no environment variables or separate backend, while preserving genuine asynchronous loading, success, and error states through TanStack Query. Changes persist for the active browser session and reset on refresh or restart.</p>

<p align="left">The current interface is responsive by design: the desktop table uses a sticky header, virtualized rows, aligned fixed action-column sizing, and horizontal scrolling when its 1120px minimum width cannot fit. Below the desktop breakpoint, the same records are shown as mobile cards rather than a compressed table.</p>

###

<h3 align="center">🚀 Getting Started</h3>

###

<p align="left">Requirements: Node.js 18+ and npm.</p>

```bash
npm install
npm run dev
```

<p align="left">Open the printed local URL (default <code>http://localhost:5173</code>). No environment variables or separate backend are needed — the mock API runs in-process. Other scripts: <code>npm run build</code> (type-check + production build), <code>npm run lint</code>, <code>npm run preview</code>.</p>

###

<h3 align="center">✅ Key Requirements Addressed</h3>

###

<p align="left">
- <strong>State management</strong>: TanStack Query owns fetched employee data, caching, and mutations. Zustand owns UI-only state for search, filters, pagination, modal/confirmation state, and the ephemeral toast queue; employee records are never duplicated in Zustand.<br>
- <strong>Performance</strong>: the employee table is virtualized with TanStack Virtual; rows are memoized with primitive props; filtering, newest-first sorting, and pagination are derived through memoized hooks rather than stored; search is debounced by 300ms; and the form is code-split with <code>React.lazy</code>.<br>
- <strong>Responsive table behavior</strong>: the desktop header and rows share one grid definition with a fixed actions track, preventing header/body drift. The scroll container owns both axes and preserves the table's 1120px minimum width instead of allowing columns to overlap. Mobile renders accessible employee cards.<br>
- <strong>Forms and feedback</strong>: create and edit use one validated form with normalization, real-time field feedback, a debounced duplicate-email check, disabled unchanged edits, submit errors, delete confirmation, and dismissible auto-expiring success/delete toasts.<br>
- <strong>Security</strong>: text input is normalized and validated client-side; duplicate emails are rejected by the mock API with a <code>409</code>; CSV export neutralizes formula injection by prefixing values starting with <code>=</code>, <code>+</code>, <code>-</code>, or <code>@</code>; the app does not use <code>dangerouslySetInnerHTML</code>; and it contains no hardcoded secrets or API keys.<br>
- <strong>Error and edge cases</strong>: explicit loading, error, empty, and no-results states; a visible 500ms mock request delay; page clamping after deleting the final record on a page; page-size changes that reset to page 1; disabled exports for an empty filtered set; and browser downloads for both CSV and JSON exports.
</p>

###
