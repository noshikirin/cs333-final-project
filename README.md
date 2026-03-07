# Final Project - Workout Tracker

A fitness tracking web application built with React and Express/MongoDB. Users can log workouts, track exercises, and view their training history grouped by date.

## About

This project was adapted from a ToDo app skeleton provided in CS 333. The core CRUD (Create, Read, Update, Delete) pattern from the ToDo app was altered to handle workout data instead of tasks. A flat data model stores individual exercises with a date field, while the frontend groups them visually by date in a weekly calendar view.

## Features

- **Three workout types:** standard (sets/reps/weight), cardio (duration/distance), and unilateral (left/right tracking)
- **Calendar week view** with day selection and arrow navigation between weeks
- **Personal record detection** that automatically badges your current all-time best for each exercise
- **Volume chart** with a toggle between daily breakdown and 4-week trend view
- **Dark mode** toggle with smooth transitions
- **Full CRUD** — create, edit, and delete any workout entry
- **Smart form** that adapts its fields based on workout type (cardio shows duration/distance, unilateral shows L/R inputs)
- **Green dot indicators** on calendar days that have logged workouts
- **Rest day display** for days with no workouts

## Tech Stack

- **Frontend:** React (Vite), Recharts
- **Backend:** Express.js
- **Database:** MongoDB with Mongoose
- **Server:** NGINX on Jetstream Cloud

## Deployment

### Server Info

- **URL:** felicity.cis251296.projects.jetstream-cloud.org
- **IP:** 149.165.155.132
- **Path:** /var/www/html/final

### Steps to Deploy

1. **Upload files** to the server via WinSCP to `/var/www/html/final`

2. **SSH into the server:**
   ```
   ssh felicity@149.165.155.132
   ```

3. **Install backend dependencies:**
   ```
   cd /var/www/html/final/cs333-api-main
   npm install
   ```

4. **Install frontend dependencies and build:**
   ```
   cd /var/www/html/final/cs333-main
   npm install
   npm run build
   ```

5. **Start/restart the backend with PM2:**
   ```
   cd /var/www/html/final/cs333-api-main
   pm2 start index.js --name workout-api
   ```
   Or if already running:
   ```
   pm2 restart workout-api
   ```

### Running Locally

1. Start the backend:
   ```
   cd cs333-api-main
   npm start
   ```
   The API will run on `http://localhost:3000`.

2. Start the frontend:
   ```
   cd cs333-main
   npm run dev
   ```
   The app will open at `http://localhost:5173`.


## Project Structure

```
333FullToDo/
├── cs333-api-main/               # Backend
│   ├── models/
│   │   └── workouts.js           # Mongoose schema (standard, cardio, unilateral)
│   ├── routes/
│   │   └── routes.js             # CRUD API endpoints
│   └── index.js                  # Express server setup
│
└── cs333-main/                   # Frontend
    └── src/
        ├── components/
        │   ├── common/
        │   │   └── Button.jsx    # Reusable button component
        │   ├── Workout/
        │   │   └── Workout.jsx   # Single exercise display/edit/delete
        │   └── Workouts/
        │       ├── Workouts.jsx      # Calendar view, PR detection, data fetching
        │       ├── CreateWorkout.jsx # Adaptive form for logging exercises
        │       └── VolumeChart.jsx   # Weekly volume bar chart with trend toggle
        ├── App.jsx               # Root component with dark mode state
        └── index.css             # All styles with CSS variable theming
```

## Data Model

Each workout entry can be one of three types:

### Standard
| Field    | Type   | Required | Description                        |
|----------|--------|----------|------------------------------------|
| exercise | String | Yes      | Name of the exercise               |
| sets     | Number | No       | Number of sets                     |
| reps     | Number | No       | Number of reps per set             |
| weight   | Number | No       | Weight used (lbs)                  |
| category | String | No       | Push, Pull, Legs, Cardio, or Other |
| date     | String | Yes      | Date of workout (YYYY-MM-DD)       |
| notes    | String | No       | Optional notes                     |

### Cardio
| Field    | Type   | Description          |
|----------|--------|----------------------|
| duration | Number | Time in minutes      |
| distance | Number | Distance in miles    |

### Unilateral
| Field       | Type    | Description                    |
|-------------|---------|--------------------------------|
| isUnilateral| Boolean | Flags the entry as unilateral  |
| leftSets    | Number  | Sets for left side             |
| leftReps    | Number  | Reps for left side             |
| leftWeight  | Number  | Weight for left side (lbs)     |
| rightSets   | Number  | Sets for right side            |
| rightReps   | Number  | Reps for right side            |
| rightWeight | Number  | Weight for right side (lbs)    |

## Design Decisions

- **Flat data model with visual grouping:** Chose a single flat collection over nested session documents to keep the scope manageable. The frontend groups entries by date so the user experience still feels session-based.
- **Frontend-driven PR detection:** PRs are calculated on the client side by comparing all entries for an exercise and badging only the current all-time best — no extra backend logic needed.
- **Conditional form rendering:** The create and edit forms adapt their fields based on workout type using React conditional rendering, keeping one form component that handles all three types.
- **CSS variable theming:** Dark mode is implemented entirely through CSS variables toggled by a single class, making the theme switch instant and touching zero JavaScript logic beyond the toggle state.
