import { useState } from 'react'
import { Button } from '../common/Button'

export function Workout({ id, workout, fetchData }) {
  // we already have the workout data from props — no need to fetch
  const [isEdit, setIsEdit] = useState(false)

  // temp state for each field while editing
  const [tempExercise, setTempExercise] = useState(workout.exercise)
  const [tempSets, setTempSets] = useState(workout.sets)
  const [tempReps, setTempReps] = useState(workout.reps)
  const [tempWeight, setTempWeight] = useState(workout.weight)
  const [tempCategory, setTempCategory] = useState(workout.category)
  const [tempNotes, setTempNotes] = useState(workout.notes)

  // sends updated fields to the API
  async function handleUpdate(updatedFields) {
    try {
      await fetch(`http://localhost:3000/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      })
      await fetchData()  // refetch so the list reflects changes
    } catch (error) {
      console.log(error)
    }
  }

  // toggles edit mode, and saves changes when exiting edit mode
  async function handleEditClick() {
    if (isEdit) {
      await handleUpdate({
        exercise: tempExercise,
        sets: Number(tempSets),
        reps: Number(tempReps),
        weight: Number(tempWeight),
        category: tempCategory,
        notes: tempNotes,
      })
    }
    setIsEdit(isEdit => !isEdit)
  }

  // deletes the workout and refetches the list
  async function handleDelete() {
    try {
      await fetch(`http://localhost:3000/${id}`, {
        method: 'DELETE',
      })
      await fetchData()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='workout'>
      <div className='workout__details'>
        {isEdit ? (
          // edit mode — show input fields
          <div className='workout__edit'>
            <input type="text" value={tempExercise}
              onChange={(e) => setTempExercise(e.target.value)} />
            <input type="number" value={tempSets}
              onChange={(e) => setTempSets(e.target.value)} />
            <input type="number" value={tempReps}
              onChange={(e) => setTempReps(e.target.value)} />
            <input type="number" value={tempWeight}
              onChange={(e) => setTempWeight(e.target.value)} />
            <select value={tempCategory}
              onChange={(e) => setTempCategory(e.target.value)}>
              <option value="push">Push</option>
              <option value="pull">Pull</option>
              <option value="legs">Legs</option>
              <option value="cardio">Cardio</option>
              <option value="other">Other</option>
            </select>
            <input type="text" value={tempNotes}
              onChange={(e) => setTempNotes(e.target.value)} />
          </div>
        ) : (
          // view mode — just display the data
          <div className='workout__info'>
            <strong>{workout.exercise}</strong>
            <span>{workout.sets} x {workout.reps} @ {workout.weight}lbs</span>
            <span className='workout__category'>{workout.category}</span>
            {workout.notes && <p className='workout__notes'>{workout.notes}</p>}
          </div>
        )}
      </div>
      <div className='workout__buttons'>
        <Button
          className={isEdit ? 'btn-success' : 'btn-info'}
          onClick={handleEditClick}
        >
          {isEdit ? 'Save' : 'Edit'}
        </Button>
        <Button
          className='btn-danger'
          onClick={handleDelete}
          disabled={isEdit}
        >
          Delete
        </Button>
      </div>
    </div>
  )
}