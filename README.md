# Final Project - Workout Tracker

A fitness tracking web application built with React and Express/MongoDB. Users can log workouts, track exercises, and view their training history grouped by date.

## About

This project was adapted from a ToDo app skeleton provided in CS 333. The core CRUD (Create, Read, Update, Delete) pattern from the ToDo app was reshaped to handle workout data instead of tasks. The flat data model stores individual exercises with a date field, while the frontend groups them visually by date to create a session-based experience — balancing simplicity on the backend with a clean user experience on the frontend.

## Features

- Log exercises with name, sets, reps, weight, and category
- Categorize exercises (Push, Pull, Legs, Cardio, Other)
- Workouts are automatically grouped and displayed by date
- Edit and delete individual exercises
- Date defaults to today for quick logging
- Category and date persist between entries for faster multi-exercise logging

## Getting Started

### Prerequisites

- Node.js
- MongoDB running locally

### Installation

1. Install backend dependencies:
   ```
   cd cs333-api-main
   npm install
   ```

2. Install frontend dependencies:
   ```
   cd cs333-main
   npm install
   ```

### Running the App

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
├── cs333-api-main/          # Backend
│   ├── models/
│   │   └── workouts.js      # Mongoose schema for workout entries
│   ├── routes/
│   │   └── routes.js        # CRUD API endpoints
│   └── index.js             # Express server setup
│
└── cs333-main/              # Frontend
    └── src/
        ├── components/
        │   ├── common/
        │   │   └── Button.jsx
        │   ├── Workout/
        │   │   └── Workout.jsx       # Single exercise display/edit
        │   └── Workouts/
        │       ├── Workouts.jsx      # Main list with date grouping
        │       └── CreateWorkout.jsx # Form to log new exercises
        └── App.jsx
```

## Data Model

Each workout entry contains:

| Field    | Type   | Required | Description                          |
|----------|--------|----------|--------------------------------------|
| exercise | String | Yes      | Name of the exercise                 |
| sets     | Number | Yes      | Number of sets                       |
| reps     | Number | Yes      | Number of reps per set               |
| weight   | Number | Yes      | Weight used (lbs)                    |
| category | String | No       | Push, Pull, Legs, Cardio, or Other   |
| date     | String | Yes      | Date of workout (YYYY-MM-DD)         |
| notes    | String | No       | Optional notes                       |
