# Workout App

A personal home workout tracker built with Expo + TypeScript.

## Setup

```bash
npx create-expo-app@latest workout-app --template blank-typescript
cd workout-app
```

## Install dependencies

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
npx expo install react-native-gesture-handler react-native-reanimated
npx expo install react-native-svg
npx expo install @react-native-async-storage/async-storage
npm install zustand
```

## File structure

Copy the provided files into your project:

```
app/
  _layout.tsx
  (tabs)/
    _layout.tsx
    index.tsx         ← Today screen (default)
    program.tsx       ← Week browser
    progress.tsx      ← Rep charts
    history.tsx       ← Session log
components/
  ExerciseRow.tsx     ← Checkable exercise row with rep editor
  WeekBanner.tsx      ← Phase/week header banner
constants/
  program.ts          ← All workout data
store/
  useWorkoutStore.ts  ← Zustand store (persisted to AsyncStorage)
types/
  index.ts            ← TypeScript interfaces
```

## app.json – add expo-router entry point

Make sure your `app.json` has:

```json
{
  "expo": {
    "scheme": "workout-app",
    "web": { "bundler": "metro" },
    "plugins": ["expo-router"]
  }
}
```

And in `package.json` main field:

```json
{
  "main": "expo-router/entry"
}
```

## Run

```bash
npx expo start
```

Scan the QR code with **Expo Go** on your phone.

---

## Features

| Screen | What it does |
|---|---|
| **Today** | Shows morning/night session for your current week. Tap to check off exercises. Tap rep number to edit. |
| **Program** | Browse all weeks. Your current week is highlighted. Read-only reference. |
| **Progress** | Line chart per exercise showing rep count over time. Summary stats: streak, weekly rate, total sessions. |
| **History** | All completed sessions grouped by date. Shows which exercises you completed. Swipe/tap to delete. |

## Key behaviours

- **Auto-advances weeks** based on your start date
- **Tap any rep number** in Today screen to update it (saved permanently for that week/exercise)
- **Partial sessions** can be logged — you don't need to complete all exercises
- **Streak** counts consecutive days with at least one session
- **Deload weeks** are flagged with a badge so you know to take it easier
- All data is stored **locally on device** via AsyncStorage — no account needed

## Coming next (suggestions)

- `expo-notifications` for morning/night reminders at set times
- Rest timer between exercises
- Dark mode support
- iCloud / Google Drive backup
