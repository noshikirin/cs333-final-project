import { useState } from 'react'
import { Button } from '../common/Button'

export function CreateWorkout({ handleCreate }) {
  // state for each form field
  const [exercise, setExercise] = useState('')
  const [sets, setSets] = useState('')
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')
  const [category, setCategory] = useState('other')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]) // default to today's date
  const [notes, setNotes] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    // only require the core fields
    if (!exercise || !sets || !reps || !weight) return

    const newWorkout = {
      exercise,
      sets: Number(sets), // convert string inputs to numbers
      reps: Number(reps),
      weight: Number(weight),
      category,
      date,
      notes,
    }

    await handleCreate(newWorkout)

    // reset form but keep the date and category
    // (users would probably be logging multiple exercises on the same day)
    setExercise('')
    setSets('')
    setReps('')
    setWeight('')
    setNotes('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={exercise}
        onChange={(e) => setExercise(e.target.value)}
        placeholder="Exercise name" required />

      <input type="number" value={sets}
        onChange={(e) => setSets(e.target.value)}
        placeholder="Sets" min="1" required />

      <input type="number" value={reps}
        onChange={(e) => setReps(e.target.value)}
        placeholder="Reps" min="1" required />

      <input type="number" value={weight}
        onChange={(e) => setWeight(e.target.value)}
        placeholder="Weight" min="0" required />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="push">Push</option>
        <option value="pull">Pull</option>
        <option value="legs">Legs</option>
        <option value="cardio">Cardio</option>
        <option value="other">Other</option>
      </select>

      <input type="date" value={date}
        onChange={(e) => setDate(e.target.value)} required />

      <input type="text" value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)" />

      <Button type="submit">Log Workout</Button>
    </form>
  )
}