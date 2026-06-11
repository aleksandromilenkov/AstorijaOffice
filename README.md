# Astorija React Migration

This workspace contains a migrated scaffold of the original static site into a modern Vite + React app.

Quick start:

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

Notes:
- Static assets (images) remain in the project root `img/` folder and are referenced as `/img/...`.
 - The app now uses MUI (Material UI) for layout and styling. The theme is in `src/theme.js` and the app is wrapped with `ThemeProvider` in `src/main.jsx`.
 - Components live in `src/components/` and use MUI primitives (Container, Grid, Box, Typography, Button, Drawer).
 - Legacy CSS files under `src/styles/` have been removed; styling is now handled via the MUI theme and `sx` props.
# AstorijaOffice
Real Printing company based in Sveti Nikole, Macedonia. The website is hosted here: https://astorija.netlify.app/
