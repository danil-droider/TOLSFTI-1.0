import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { Goal, GoalStatus } from '../types'
import { settleGoals, formatETA } from '../utils/calculator'
import confetti from 'canvas-confetti'

export type SalaryState = {
  monthlySalary: number | null
  setMonthlySalary: (salary: number | null) => void
  resetSalary: () => void
}

export type GoalState = {
  goals: Goal[]
  addGoal: (title: string, targetAmount: number) => void
  deleteGoal: (id: string) => void
  startGoal: (id: string) => void
  pauseGoal: (id: string) => void
  resumeGoal: (id: string) => void
  syncGoals: () => void
}

export const useGoalStore = create<SalaryState & GoalState>()(
  persist(
    (set, get) => ({
      monthlySalary: null,
      setMonthlySalary: (salary) => set({ monthlySalary: salary }),
      resetSalary: () => set({ monthlySalary: null }),
      goals: [],
      addGoal: (title, targetAmount) =>
        set((state) => ({
          goals: [
            ...state.goals,
            {
              id: crypto.randomUUID(),
              title,
              targetAmount,
              accumulatedAmount: 0,
              status: 'idle',
              lastUpdatedTimestamp: null,
            },
          ]
        })),
      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id)
        })),
      startGoal: (id) => {
        const state = get()
        // Settle earned progress before changing active count
        const now = Date.now()
        const [updatedGoals, completedIds] = settleGoals(
          state.goals,
          state.monthlySalary ?? 0,
          now
        )
        // Mark newly completed goals
        const goalMap = new Map(updatedGoals.map((g) => [g.id, g]))
        const updatedGoalsWithStatus = updatedGoals.map((g) => {
          if (completedIds.includes(g.id)) {
            return { ...g, status: 'completed' }
          }
          return g
        })
        // Trigger confetti only for goals that newly completed
        if (completedIds.length > 0) {
          confetti()
        }
        // Update the store with settled goals
        set({ goals: updatedGoalsWithStatus })
      },
      pauseGoal: (id) => {
        const state = get()
        // Settle progress before pausing
        const now = Date.now()
        const [updatedGoals] = settleGoals(
          state.goals,
          state.monthlySalary ?? 0,
          now
        )
        set({ goals: updatedGoals })
      },
      resumeGoal: (id) => {
        const state = get()
        // Settle progress before resuming
        const now = Date.now()
        const [updatedGoals] = settleGoals(
          state.goals,
          state.monthlySalary ?? 0,
          now
        )
        set({ goals: updatedGoals })
      },
      syncGoals: () => {
        const state = get()
        const now = Date.now()
        const [updatedGoals, completedIds] = settleGoals(
          state.goals,
          state.monthlySalary ?? 0,
          now
        )
        set({ goals: updatedGoals })
        // Trigger confetti for any goals that completed while app was closed
        if (completedIds.length > 0) {
          confetti()
        }
      },
    }),
    {
      name: 'goal-ticker-settings'
    }
  )
)