import { useCallback, useEffect, useState } from 'react'
import { VolumeChart } from './VolumeChart'
import { Workout } from '../Workout/Workout'
import { CreateWorkout } from './CreateWorkout'

// figures out which workouts are personal records
// a PR = heaviest weight ever for that exercise at the time it was logged
function findPRs(workouts) {
  const prIds = new Set()

  // group all workouts by exercise name
  const byExercise = {}
  workouts.forEach(workout => {
    const name = workout.exercise.toLowerCase()
    if (!byExercise[name]) byExercise[name] = []
    byExercise[name].push(workout)
  })

  // for each exercise, find the single best and badge only that one
  Object.values(byExercise).forEach(entries => {
    let bestId = null
    let bestValue = -1

    entries.forEach(w => {
      let value = 0

      if (w.category === 'cardio') {
        // best = farthest distance, or longest duration
        value = w.distance || w.duration || 0
      } else if (w.isUnilateral) {
        // best = heaviest weight on either side
        value = Math.max(w.leftWeight || 0, w.rightWeight || 0)
      } else {
        // best = heaviest weight
        value = w.weight || 0
      }

      if (value > bestValue) {
        bestValue = value
        bestId = w._id
      }
    })

    // only badge the single best entry
    if (bestId && bestValue > 0) {
      prIds.add(bestId)
    }
  })

  return prIds
}

// ─── WEEK HELPER FUNCTIONS ───

// gets the Sunday that starts the week containing a given date
function getWeekStart(date) {
  const d = new Date(date)
  const day = d.getDay() // 0 = Sunday, 6 = Saturday
  d.setDate(d.getDate() - day)
  return d
}

// builds an array of 7 dates starting from a Sunday
function getWeekDays(weekStart) {
  const days = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    days.push(d)
  }
  return days
}

// formats a Date object to "YYYY-MM-DD" string to match our workout dates
function formatDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const Workouts = () => {
  const [workouts, setWorkouts] = useState([])

  // week navigation: 0 = current week, -7 = last week, -14 = two weeks ago, etc.
  const [weekOffset, setWeekOffset] = useState(0)

  // which day is selected in the calendar grid
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(formatDateKey(today))

  // grabs all workouts from the API
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000')
      const jsonResponse = await response.json()
      setWorkouts(jsonResponse)
    } catch (error) {
      console.log(error)
    }
  }, [])

  // sends the new workout to the API, then refetches so the list updates
  const handleCreate = useCallback(async (newWorkout) => {
    try {
      await fetch("http://localhost:3000", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWorkout),
      })
    } catch (error) {
      console.log(error)
    }
    await fetchData()
  }, [fetchData])

  // fetch workouts when the component first loads
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ─── WEEK CALCULATIONS ───

  // figure out what week to display based on offset
  const currentWeekStart = getWeekStart(today)
  const shiftedStart = new Date(currentWeekStart)
  shiftedStart.setDate(shiftedStart.getDate() + weekOffset)
  const weekDays = getWeekDays(shiftedStart)

  // build the week label like "Mar 1 – Mar 7, 2026"
  const weekLabel = (() => {
    const first = weekDays[0]
    const last = weekDays[6]
    const opts = { month: 'short', day: 'numeric' }
    return `${first.toLocaleDateString('en-US', opts)} – ${last.toLocaleDateString('en-US', opts)}, ${last.getFullYear()}`
  })()

  const isCurrentWeek = weekOffset === 0

  // navigate to previous week
  const goBack = () => {
    setWeekOffset(w => w - 7)
    setSelectedDate('') // clear selection when changing weeks
  }

  // navigate to next week
  const goForward = () => {
    setWeekOffset(w => w + 7)
    setSelectedDate('')
  }

  // ─── FILTER & PR DETECTION ───

  // get workouts for the selected day only
  const selectedWorkouts = workouts.filter(w => w.date === selectedDate)

  // PR detection still uses ALL workouts so it can compare across all history
  const prIds = findPRs(workouts)

  // build a set of dates that have workouts (for the green dots)
  const datesWithWorkouts = new Set(workouts.map(w => w.date))

  // nice label for the selected day like "Thursday, March 5"
  const selectedDayLabel = selectedDate
    ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric'
    })
    : ''

  return (
    <>
      <CreateWorkout handleCreate={handleCreate} />

      {/* week navigation arrows */}
      <div className='week-nav'>
        <button className='week-nav__arrow' onClick={goBack}>←</button>
        <span className='week-nav__label'>{weekLabel}</span>
        <button
          className='week-nav__arrow'
          onClick={goForward}
          disabled={isCurrentWeek}
        >→</button>
      </div>

      {/* volume chart — sits between nav and calendar */}
      <VolumeChart workouts={workouts} weekDays={weekDays} />

      {/* 7-day calendar grid */}
      <div className='week-grid'>
        {weekDays.map((day, i) => {
          const key = formatDateKey(day)
          const isSelected = key === selectedDate
          const hasWorkouts = datesWithWorkouts.has(key)
          const isToday = key === formatDateKey(today)

          return (
            <div
              key={i}
              className={`week-grid__day ${isSelected ? 'week-grid__day--selected' : ''} ${isToday && !isSelected ? 'week-grid__day--today' : ''}`}
              onClick={() => setSelectedDate(key)}
            >
              <span className='week-grid__day-label'>{dayLabels[i]}</span>
              <span className='week-grid__day-number'>{day.getDate()}</span>
              <div className={`week-grid__dot ${hasWorkouts ? 'week-grid__dot--active' : ''}`} />
            </div>
          )
        })}
      </div>

      {/* selected day's workouts */}
      {selectedDate && (
        <div className='day-workouts'>
          <h2 className='day-workouts__label'>{selectedDayLabel}</h2>

          {selectedWorkouts.length === 0 ? (
            <div className='day-workouts__empty'>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
                style={{ display: "block", margin: "0 auto 8px auto" }}>
                <path
                  d="M20 4C13.4 4 8 9.4 8 16s5.4 12 12 12c2.2 0 4.2-.6 6-1.6C23.2 28 19.8 29 16.2 29 8.8 29 3 23 3 16S8.8 3 16.2 3c3.6 0 6.8 1.2 9.4 3.2C24 4.8 22 4 20 4z"
                  fill="none" stroke="#d6d3d1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
              <span>Rest day — no workouts logged</span>
            </div>
          ) : (
            <ul>
              {selectedWorkouts.map(workout => (
                <li key={workout._id}>
                  <Workout
                    id={workout._id}
                    workout={workout}
                    fetchData={fetchData}
                    isPR={prIds.has(workout._id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {!selectedDate && (
        <p>Select a day to view workouts</p>
      )}
    </>
  )
}

export default Workouts