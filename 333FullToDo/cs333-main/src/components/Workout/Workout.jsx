import { useState } from 'react'
import { Button } from '../common/Button'

export function Workout({ id, workout, fetchData, isPR }) {
  const [isEdit, setIsEdit] = useState(false)

  // standard fields
  const [tempExercise, setTempExercise] = useState(workout.exercise)
  const [tempSets, setTempSets] = useState(workout.sets)
  const [tempReps, setTempReps] = useState(workout.reps)
  const [tempWeight, setTempWeight] = useState(workout.weight)
  const [tempCategory, setTempCategory] = useState(workout.category)
  const [tempNotes, setTempNotes] = useState(workout.notes)

  // cardio fields
  const [tempDuration, setTempDuration] = useState(workout.duration)
  const [tempDistance, setTempDistance] = useState(workout.distance)

  // unilateral fields
  const [tempLeftSets, setTempLeftSets] = useState(workout.leftSets)
  const [tempLeftReps, setTempLeftReps] = useState(workout.leftReps)
  const [tempLeftWeight, setTempLeftWeight] = useState(workout.leftWeight)
  const [tempRightSets, setTempRightSets] = useState(workout.rightSets)
  const [tempRightReps, setTempRightReps] = useState(workout.rightReps)
  const [tempRightWeight, setTempRightWeight] = useState(workout.rightWeight)

  const isCardio = workout.category === 'cardio'
  const isUnilateral = workout.isUnilateral

  async function handleUpdate(updatedFields) {
    try {
      await fetch(`http://localhost:3000/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      })
      await fetchData()
    } catch (error) {
      console.log(error)
    }
  }

  async function handleEditClick() {
    if (isEdit) {
      const updates = {
        exercise: tempExercise,
        category: tempCategory,
        notes: tempNotes,
      }

      if (isCardio) {
        updates.duration = Number(tempDuration)
        updates.distance = tempDistance ? Number(tempDistance) : null
      } else if (isUnilateral) {
        updates.leftSets = Number(tempLeftSets)
        updates.leftReps = Number(tempLeftReps)
        updates.leftWeight = Number(tempLeftWeight)
        updates.rightSets = Number(tempRightSets)
        updates.rightReps = Number(tempRightReps)
        updates.rightWeight = Number(tempRightWeight)
      } else {
        updates.sets = Number(tempSets)
        updates.reps = Number(tempReps)
        updates.weight = Number(tempWeight)
      }

      await handleUpdate(updates)
    }
    setIsEdit(isEdit => !isEdit)
  }

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
          <div className='workout__edit'>
            <input type="text" value={tempExercise}
              onChange={(e) => setTempExercise(e.target.value)}
              placeholder="Exercise" />

            {isCardio ? (
              <>
                <input type="number" value={tempDuration || ''}
                  onChange={(e) => setTempDuration(e.target.value)}
                  placeholder="Minutes" />
                <input type="number" value={tempDistance || ''}
                  onChange={(e) => setTempDistance(e.target.value)}
                  placeholder="Distance" />
              </>
            ) : isUnilateral ? (
              <div className="unilateral-fields">
                <div className="unilateral-row">
                  <span className="unilateral-label">L</span>
                  <input type="number" value={tempLeftSets || ''}
                    onChange={(e) => setTempLeftSets(e.target.value)}
                    placeholder="Sets" />
                  <input type="number" value={tempLeftReps || ''}
                    onChange={(e) => setTempLeftReps(e.target.value)}
                    placeholder="Reps" />
                  <input type="number" value={tempLeftWeight || ''}
                    onChange={(e) => setTempLeftWeight(e.target.value)}
                    placeholder="Weight" />
                </div>
                <div className="unilateral-row">
                  <span className="unilateral-label">R</span>
                  <input type="number" value={tempRightSets || ''}
                    onChange={(e) => setTempRightSets(e.target.value)}
                    placeholder="Sets" />
                  <input type="number" value={tempRightReps || ''}
                    onChange={(e) => setTempRightReps(e.target.value)}
                    placeholder="Reps" />
                  <input type="number" value={tempRightWeight || ''}
                    onChange={(e) => setTempRightWeight(e.target.value)}
                    placeholder="Weight" />
                </div>
              </div>
            ) : (
              <>
                <input type="number" value={tempSets || ''}
                  onChange={(e) => setTempSets(e.target.value)}
                  placeholder="Sets" />
                <input type="number" value={tempReps || ''}
                  onChange={(e) => setTempReps(e.target.value)}
                  placeholder="Reps" />
                <input type="number" value={tempWeight || ''}
                  onChange={(e) => setTempWeight(e.target.value)}
                  placeholder="Weight" />
              </>
            )}

            <select value={tempCategory}
              onChange={(e) => setTempCategory(e.target.value)}>
              <option value="push">Push</option>
              <option value="pull">Pull</option>
              <option value="legs">Legs</option>
              <option value="cardio">Cardio</option>
              <option value="other">Other</option>
            </select>
            <input type="text" value={tempNotes || ''}
              onChange={(e) => setTempNotes(e.target.value)}
              placeholder="Notes" />
          </div>
        ) : (
          <div className='workout__info'>
            <strong>{workout.exercise}</strong>
            {isPR && <span className='workout__pr-badge'>PR</span>}

            {isCardio ? (
              <span>
                {workout.duration}min
                {workout.distance ? ` · ${workout.distance}mi` : ''}
              </span>
            ) : isUnilateral ? (
              <span>
                <span className='unilateral-inline-label'>L </span>
                {workout.leftSets}×{workout.leftReps} @ {workout.leftWeight}lbs
                <span className='unilateral-divider'>|</span>
                <span className='unilateral-inline-label'>R </span>
                {workout.rightSets}×{workout.rightReps} @ {workout.rightWeight}lbs
              </span>
            ) : (
              <span>{workout.sets} x {workout.reps} @ {workout.weight}lbs</span>
            )}

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