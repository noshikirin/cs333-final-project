import mongoose from 'mongoose'

let WorkoutSchema = new mongoose.Schema({
  exercise: { type: String, required: true },
  category: { type: String, default: 'other' },
  date: { type: String, required: true },
  notes: { type: String, default: '' },

  // standard fields (optional now — not used for cardio)
  sets: { type: Number, default: null },
  reps: { type: Number, default: null },
  weight: { type: Number, default: null },

  // cardio fields
  duration: { type: Number, default: null },  // minutes
  distance: { type: Number, default: null },  // miles

  // unilateral fields
  isUnilateral: { type: Boolean, default: false },
  leftSets: { type: Number, default: null },
  leftReps: { type: Number, default: null },
  leftWeight: { type: Number, default: null },
  rightSets: { type: Number, default: null },
  rightReps: { type: Number, default: null },
  rightWeight: { type: Number, default: null },
}, { timestamps: true })

export const Workout = mongoose.model('Workout', WorkoutSchema)

