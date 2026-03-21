# FinTrack — Personal Finance Tracker

A desktop personal finance tracker built with Electron and React.

## Features

- Track income and expense transactions
- Visual dashboard with monthly bar chart and spending pie chart
- Filter transactions by type and category
- Spending Insights panel with savings rate and monthly comparison
- Auto-update via electron-updater

## Tech Stack

- Electron + React (TypeScript)
- electron-vite (build tool)
- Tailwind CSS (styling)
- recharts (charts)
- date-fns (date formatting)
- lucide-react (icons)
- framer-motion (animations)
- electron-updater (auto-update)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build:win
```

## Package & Publish

```bash
# Build installer
npm run make

# Publish to GitHub Releases
GITHUB_TOKEN=your_token npm run publish
```

## Releases

See [GitHub Releases](https://github.com/hmmmx2/SWE40006-Portfolio-Task-1/releases) for downloadable installers.
