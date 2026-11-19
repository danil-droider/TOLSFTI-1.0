import React, { useEffect, useRef } from 'react'
import { Trash, Play, Pause, CheckCircle } from 'lucide-react'

import type { Goal, GoalStatus } from '../types'
import { useGoalStore } from '../store/useGoalStore'

interface GoalCardProps {
  goal: Goal
  onDelete: (id: string) => void
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onDelete }) => {
  const {
    monthlySalary,
    goals,
    pauseGoal,
    resumeGoal,
    syncGoals
  } = useGoalStore()

  const goalStoreState = goals.find((g) => g.id === goal.id)

  // Local state for progress tracking
  const [localAccumulated, setLocalAccumulated] = React.useState(
    goal.accumulatedAmount
  )
  const [localLastUpdated, setLocalLastUpdated] = React.useState<
    number | null
  >(goal.lastUpdatedTimestamp ?? null)
  const intervalRef = useRef<number | null>(null)

  // Sync local state with store when goal changes
  React.useEffect(() => {
    const storedGoal = goals.find((g) => g.id === goal.id)
    if (storedGoal) {
      setLocalAccumulated(storedGoal.accumulatedAmount)
      setLocalLastUpdated(storedGoal.lastUpdatedTimestamp ?? null)
    }
  }, [goals])

  // Start interval tick on mount
  React.useEffect(() => {
    // Initial sync
    if (goalStoreState) {
      setLocalAccumulated(goalStoreState.accumulatedAmount)
      setLocalLastUpdated(goalStoreState.lastUpdatedTimestamp ?? null)
    }

    const tick = () => {
      if (goalStoreState?.status === 'active' && monthlySalary) {
        syncGoals()
      }
    }

    const id = setInterval(tick, 1000)
    intervalRef.current = id

    return () => clearInterval(id)
  }, [goal.id, monthlySalary, goalStoreState, syncGoals])

  // Format progress display
  const { progress, remaining } = formatProgressDisplay(
    localAccumulated,
    goal.targetAmount
  )

  return (
    <div
      className="bg-ios-card rounded-2xl p-4 mb-3 tabular-nums"
      style={{ minHeight: 120 }}
    >
      <div className="flex justify-between items-start">
        <span className="text-ios-text font-medium text-sm">{goal.title}</span>

        {/* Lifecycle buttons */}
        {goalStoreState?.status === 'active' ? (
          <button
            onClick={() => pauseGoal(goal.id)}
            aria-label="Pause goal"
            className="p-1 rounded-lg hover:bg-ios-text-muted/10 transition-colors"
            style={{ width: 32, height: 32 }}
          >
            <Pause className="w-4 h-4" />
          </button>
        ) : goalStoreState?.status === 'paused' ? (
          <button
            onClick={() => resumeGoal(goal.id)}
            aria-label="Resume goal"
            className="p-1 rounded-lg hover:bg-ios-text-muted/10 transition-colors"
            style={{ width: 32, height: 32 }}
          >
            <Play className="w-4 h-4" />
          </button>
        ) : goalStoreState?.status === 'completed' ? (
          <CheckCircle
            className="w-4 h-4 text-iosAccentActive"
            aria-label="Goal completed"
          />
        ) : (
          <button
            onClick={() => useGoalStore.getState().startGoal(goal.id, monthlySalary ?? 0)}
            aria-label="Start saving"
            className="p-1 rounded-lg hover:bg-ios-text-muted/10 transition-colors"
            style={{ width: 32, height: 32 }}
          >
            <Play className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => onDelete(goal.id)}
          aria-label="Delete goal"
          className="p-1 rounded-lg hover:bg-ios-text-muted/10 transition-colors"
          style={{ width: 32, height: 32 }}
          ml-2
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-ios-text-muted text-xs mb-1">
          <span>
            Target: {goal.targetAmount.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
            })} USD</span>
          <span>Progress</span>
        </div>

        <div className="h-2 bg-ios-text-muted/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-iosAccentActive rounded-full transition-all duration-500"
            style={{ width: Math.min(parseFloat(progress) || 0, 100) + '%' }}
          />
        </div>

        <div className="flex justify-between text-ios-text-small mt-2">
          <span>
            {localAccumulated.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
            })} / {goal.targetAmount.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
            })} USD</span>
          <span>{progress}%</span>
        </div>
      </div>

      {/* ETA and remaining amount */}
      {goalStoreState?.status === 'active' && (
        <div className="mt-3 text-ios-text-small text-ios-text-muted">
          <span>{remaining}</span>
        </div>
      )}

      {/* Completed badge */}
      {goalStoreState?.status === 'completed' && (
        <div className="mt-3 p-2 bg-iosAccentActive/20 rounded-2xl text-iosAccentActive text-ios-text-small">
          Saved!
        </div>
      )}
    </div>
  )
}