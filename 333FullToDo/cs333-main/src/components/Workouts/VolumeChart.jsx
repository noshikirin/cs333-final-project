import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

// calculates volume for a single workout entry
// volume = sets × reps × weight (the total lbs moved)
function getVolume(workout) {
    if (workout.category === 'cardio') {
        return 0 // cardio doesn't contribute to lifting volume
    }
    if (workout.isUnilateral) {
        // both sides count toward total volume
        const leftVol = (workout.leftSets || 0) * (workout.leftReps || 0) * (workout.leftWeight || 0)
        const rightVol = (workout.rightSets || 0) * (workout.rightReps || 0) * (workout.rightWeight || 0)
        return leftVol + rightVol
    }
    return (workout.sets || 0) * (workout.reps || 0) * (workout.weight || 0)
}

// custom tooltip that shows on hover
function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
        const count = payload[0].payload.count
        const volume = payload[0].value

        return (
            <div className='chart-tooltip'>
                <div className='chart-tooltip__label'>{label}</div>
                <div className='chart-tooltip__value'>
                    {count > 0
                        ? `${volume.toLocaleString()} lbs · ${count} exercise${count !== 1 ? 's' : ''}`
                        : 'Rest day'
                    }
                </div>
            </div>
        )
    }
    return null
}

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function VolumeChart({ workouts, weekDays }) {
    const [view, setView] = useState('daily')

    // ─── DAILY DATA: volume per day for the current week ───
    const dailyData = weekDays.map((day, i) => {
        const y = day.getFullYear()
        const m = String(day.getMonth() + 1).padStart(2, '0')
        const d = String(day.getDate()).padStart(2, '0')
        const dateKey = `${y}-${m}-${d}`

        const dayWorkouts = workouts.filter(w => w.date === dateKey)
        const dayVolume = dayWorkouts.reduce((sum, w) => sum + getVolume(w), 0)

        return {
            day: dayLabels[i],
            volume: dayVolume,
            count: dayWorkouts.length,  // track how many workouts this day had
        }
    })

    const totalWeekVolume = dailyData.reduce((sum, d) => sum + d.volume, 0)

    // ─── TREND DATA: volume per week for the last 4 weeks ───
    const trendData = []
    for (let i = 3; i >= 0; i--) {
        // figure out the start (Sunday) of each week
        const weekStart = new Date(weekDays[0])
        weekStart.setDate(weekStart.getDate() - i * 7)

        // build the 7 days of that week
        const days = []
        for (let d = 0; d < 7; d++) {
            const day = new Date(weekStart)
            day.setDate(day.getDate() + d)
            const y = day.getFullYear()
            const m = String(day.getMonth() + 1).padStart(2, '0')
            const dd = String(day.getDate()).padStart(2, '0')
            days.push(`${y}-${m}-${dd}`)
        }

        // sum volume for all workouts in that week
        const weekVolume = workouts
            .filter(w => days.includes(w.date))
            .reduce((sum, w) => sum + getVolume(w), 0)

        // label like "Mar 3"
        const label = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

        trendData.push({ week: label, volume: weekVolume })
    }

    // calculate percentage change from last week to this week
    const thisWeekVol = trendData[trendData.length - 1]?.volume || 0
    const lastWeekVol = trendData[trendData.length - 2]?.volume || 0
    const percentChange = lastWeekVol > 0
        ? Math.round(((thisWeekVol - lastWeekVol) / lastWeekVol) * 100)
        : 0

    return (
        <div className='volume-chart'>
            {/* header: toggle + summary */}
            <div className='volume-chart__header'>
                <div className='volume-chart__toggle'>
                    <button
                        className={`volume-chart__toggle-btn ${view === 'daily' ? 'volume-chart__toggle-btn--active' : ''}`}
                        onClick={() => setView('daily')}
                    >This Week</button>
                    <button
                        className={`volume-chart__toggle-btn ${view === 'trend' ? 'volume-chart__toggle-btn--active' : ''}`}
                        onClick={() => setView('trend')}
                    >Trend</button>
                </div>

                {view === 'daily' ? (
                    <span className='volume-chart__total'>
                        {totalWeekVolume.toLocaleString()} <span className='volume-chart__unit'>lbs</span>
                    </span>
                ) : (
                    lastWeekVol > 0 ? (
                        <span className={`volume-chart__change ${percentChange >= 0 ? 'volume-chart__change--up' : 'volume-chart__change--down'}`}>
                            {percentChange >= 0 ? '↑' : '↓'} {Math.abs(percentChange)}% vs last week
                        </span>
                    ) : (
                        <span className='volume-chart__unit'>Last 4 weeks</span>
                    )
                )}
            </div>

            {/* chart */}
            <ResponsiveContainer width="100%" height={140}>
                {view === 'daily' ? (
                    <BarChart data={dailyData} barSize={32}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false}
                            tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                        <YAxis hide />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                        <Bar dataKey="volume" fill="#6b8f71" radius={[4, 4, 0, 0]} />
                    </BarChart>
                ) : (
                    <BarChart data={trendData} barSize={48}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                        <XAxis dataKey="week" axisLine={false} tickLine={false}
                            tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                        <YAxis hide />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                        <Bar dataKey="volume" fill="#6b8f71" radius={[4, 4, 0, 0]} />
                    </BarChart>
                )}
            </ResponsiveContainer>
        </div>
    )
}