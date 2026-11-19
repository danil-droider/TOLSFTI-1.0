import React from 'react'
import { useGoalStore } from '../store/useGoalStore'
import { computeHourlyRate } from '../utils/calculator'
import { Settings } from 'lucide-react'

interface HeaderProps {
  onOpenModal: () => void
}

export const Header: React.FC<HeaderProps> = ({ onOpenModal }) => {
  const { goals, monthlySalary } = useGoalStore()
  const activeGoals = goals.filter((g) => g.status === 'active').length
  const hourlyRatePerGoal = activeGoals > 0
    ? computeHourlyRate(monthlySalary ?? 0) / activeGoals
    : 0

  return (
    <div className="flex justify-between items-center">
      <span className="text-2xl font-bold text-ios-dark--light">
        Goal Ticker
      </span>

      <div className="flex items-center gap-4 text-ios-text-small">
        <span>
          {activeGoals} {activeGoals !== 1 ? 'goals' : 'goal'} active
        </span>
        <span>
          {formatNumber(hourlyRatePerGoal)} / hr
        </span>
      </div>

      <button
        onClick={onOpenModal}
        aria-label="Open settings"
        className="p-2 rounded-lg hover:bg-ios-card transition-colors"
        style={{ width: 44, height: 44 }}
      >
        <Settings className="w-5 h-5" />
      </button>
    </div>
  )
}
