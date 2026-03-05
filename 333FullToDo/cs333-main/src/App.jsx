import { useState } from 'react'
import Workouts from './components/Workouts/Workouts'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <section className='workouts'>
        <header>
          <h1>Workout Tracker</h1>
          <button
            className='theme-toggle'
            onClick={() => setDarkMode(!darkMode)}
          >
            <div className='toggle-knob' />
          </button>
        </header>
        <Workouts />
      </section>
    </div>
  )
}

export default App