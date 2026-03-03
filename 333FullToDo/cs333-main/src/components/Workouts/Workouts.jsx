import { useCallback, useEffect, useState } from 'react'
import { Workout } from '../Workout/Workout'
import { CreateWorkout } from './CreateWorkout'

// helper function that groups a flat array of workouts by their date
function groupByDate(workouts) {
  const groups = {}
  workouts.forEach(workout => {
    if (!groups[workout.date]) {
      groups[workout.date] = [] // first time seeing this date, start a new array
    }
    groups[workout.date].push(workout)
  })
  return groups
}

const Workouts = () => {
  // stores all workouts as full objects (not just IDs like the todo app)
  // this makes it easier to group and display them by date
  const [workouts, setWorkouts] = useState([])

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
      });
    } catch (error) {
      console.log(error);
    }
    await fetchData();
  }, [fetchData]);

  // fetch workouts when the component first loads
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // group workouts by date and sort dates newest to oldest
  const grouped = groupByDate(workouts)
  const sortedDates = Object.keys(grouped).sort().reverse()

  return (
    <>
      <CreateWorkout handleCreate={handleCreate} />
      {workouts.length === 0 && <p>No workouts logged yet</p>}
      {/* loop through each date, then loop through workouts within that date */}
      {sortedDates.map(date => (
        <div key={date} className='workout-group'>
          <h2>{date}</h2>
          <ul>
            {grouped[date].map(workout => (
              <li key={workout._id}>
                <Workout
                  id={workout._id}
                  workout={workout}
                  fetchData={fetchData}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  )
}


export default Workouts