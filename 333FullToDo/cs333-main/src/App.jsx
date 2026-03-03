import Workouts from './components/Workouts/Workouts'

function App() {
  return (
    <div className='app'>
      <section className='workouts'>
        <header>
          <h1>Workout Tracker</h1>
        </header>
        <Workouts />
      </section>
    </div>
  )
}

export default App