import mongoose from 'mongoose'

let WorkoutSchema = new mongoose.Schema({
  exercise: { type: String, required: true }, // name of the exercise like "Bench Press"
  sets: { type: Number, required: true }, // number of sets  
  reps: { type: Number, required: true }, // number of reps per set
  weight: { type: Number, required: true }, // weight for exercise in pounds
  category: { type: String, default: 'other' }, // category of exercise like "upper body", "lower body", "cardio", etc.
  date: { type: String, required: true }, // date of the workout in ISO format (e.g., "2026-03-01T12:00:00Z")
  notes: { type: String, default: '' }, // optional notes about the workout, like "Felt strong today!" or "Struggled with the last set."
}, {
  timestamps: true // automatically adds createdAt and updatedAt fields
})

export const Workout = mongoose.model('Workout', WorkoutSchema)

