import { useState } from 'react'
import { Button } from '../common/Button'

export function CreateWorkout({ handleCreate }) {
  const [exercise, setExercise] = useState('')
  const [category, setCategory] = useState('other')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')

  // standard fields
  const [sets, setSets] = useState('')
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')

  // cardio fields
  const [duration, setDuration] = useState('')
  const [distance, setDistance] = useState('')

  // unilateral fields
  const [isUnilateral, setIsUnilateral] = useState(false)
  const [leftSets, setLeftSets] = useState('')
  const [leftReps, setLeftReps] = useState('')
  const [leftWeight, setLeftWeight] = useState('')
  const [rightSets, setRightSets] = useState('')
  const [rightReps, setRightReps] = useState('')
  const [rightWeight, setRightWeight] = useState('')

  const isCardio = category === 'cardio'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!exercise) return

    // build the workout object based on type
    const newWorkout = {
      exercise,
      category,
      date,
      notes,
    }

    if (isCardio) {
      // cardio: need at least duration
      if (!duration) return
      newWorkout.duration = Number(duration)
      if (distance) newWorkout.distance = Number(distance)
    } else if (isUnilateral) {
      // unilateral: need at least L and R weights
      if (!leftSets || !leftReps || !leftWeight || !rightSets || !rightReps || !rightWeight) return
      newWorkout.isUnilateral = true
      newWorkout.leftSets = Number(leftSets)
      newWorkout.leftReps = Number(leftReps)
      newWorkout.leftWeight = Number(leftWeight)
      newWorkout.rightSets = Number(rightSets)
      newWorkout.rightReps = Number(rightReps)
      newWorkout.rightWeight = Number(rightWeight)
    } else {
      // standard: need sets, reps, weight
      if (!sets || !reps || !weight) return
      newWorkout.sets = Number(sets)
      newWorkout.reps = Number(reps)
      newWorkout.weight = Number(weight)
    }

    await handleCreate(newWorkout)

    // reset fields but keep date and category
    setExercise('')
    setNotes('')
    setSets('')
    setReps('')
    setWeight('')
    setDuration('')
    setDistance('')
    setLeftSets('')
    setLeftReps('')
    setLeftWeight('')
    setRightSets('')
    setRightReps('')
    setRightWeight('')
  }

  // when category changes, reset type-specific fields
  const handleCategoryChange = (e) => {
    setCategory(e.target.value)
    setIsUnilateral(false)
    setSets('')
    setReps('')
    setWeight('')
    setDuration('')
    setDistance('')
    setLeftSets('')
    setLeftReps('')
    setLeftWeight('')
    setRightSets('')
    setRightReps('')
    setRightWeight('')
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* row 1: exercise name + category */}
      <input type="text" value={exercise}
        onChange={(e) => setExercise(e.target.value)}
        placeholder="Exercise name" required />

      <select value={category} onChange={handleCategoryChange}>
        <option value="push">Push</option>
        <option value="pull">Pull</option>
        <option value="legs">Legs</option>
        <option value="cardio">Cardio</option>
        <option value="other">Other</option>
      </select>

      {/* row 2: conditional fields based on type */}
      {isCardio ? (
        // CARDIO: duration + distance
        <>
          <input type="number" value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Minutes" min="1" required />
          <input type="number" value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="Distance (mi)" min="0" step="0.1" />
        </>
      ) : isUnilateral ? (
        // UNILATERAL: L/R rows
        <div className="unilateral-fields">
          <div className="unilateral-row">
            <span className="unilateral-label">L</span>
            <input type="number" value={leftSets}
              onChange={(e) => setLeftSets(e.target.value)}
              placeholder="Sets" min="1" required />
            <input type="number" value={leftReps}
              onChange={(e) => setLeftReps(e.target.value)}
              placeholder="Reps" min="1" required />
            <input type="number" value={leftWeight}
              onChange={(e) => setLeftWeight(e.target.value)}
              placeholder="Weight" min="0" required />
          </div>
          <div className="unilateral-row">
            <span className="unilateral-label">R</span>
            <input type="number" value={rightSets}
              onChange={(e) => setRightSets(e.target.value)}
              placeholder="Sets" min="1" required />
            <input type="number" value={rightReps}
              onChange={(e) => setRightReps(e.target.value)}
              placeholder="Reps" min="1" required />
            <input type="number" value={rightWeight}
              onChange={(e) => setRightWeight(e.target.value)}
              placeholder="Weight" min="0" required />
          </div>
        </div>
      ) : (
        // STANDARD: sets, reps, weight
        <>
          <input type="number" value={sets}
            onChange={(e) => setSets(e.target.value)}
            placeholder="Sets" min="1" required />
          <input type="number" value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="Reps" min="1" required />
          <input type="number" value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Weight" min="0" required />
        </>
      )}

      {/* row 3: unilateral checkbox + date + notes + submit */}
      {!isCardio && (
        <label className={`unilateral-toggle ${isUnilateral ? 'unilateral-toggle--active' : ''}`}>
          <input
            type="checkbox"
            checked={isUnilateral}
            onChange={(e) => setIsUnilateral(e.target.checked)}
          />
          Unilateral
        </label>
      )}

      <input type="date" value={date}
        onChange={(e) => setDate(e.target.value)} required />

      <input type="text" value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)" />

      <Button type="submit">Log Workout</Button>
    </form>
  )
}