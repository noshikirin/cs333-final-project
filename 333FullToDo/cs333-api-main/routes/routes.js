import express from 'express'

import { Workout } from '../models/workouts.js'

const router = express.Router()

// POST route to create a new workout
router.post('/', async (req, res) => {
  const workout = await Workout.create(req.body)
  res.status(200).send(workout)
})

// GET route to retrieve all workouts
router.get('/', async (req, res) => {
  const workouts = await Workout
    .find({})
    .sort({ date: -1 })
  res.send(workouts)
})

// GET route to retrieve a specific workout
router.get('/:id', async (req, res) => {
  const workout = await Workout.findById(req.params.id)
  res.status(200).send(workout)
})

// PUT route to update an existing workout
router.put('/:id', async (req, res) => {
  await Workout.findByIdAndUpdate(req.params.id, req.body)
  res.status(201).send()
})

// DELETE route to delete a workout
router.delete('/:id', async (req, res) => {
  await Workout.findByIdAndDelete(req.params.id)
  res.status(201).send()
})

export default router

