import React from 'react'
import { Settings } from 'lucide-react'

export const Header: React.FC = ({
  onOpenModal,
  monthlySalary,
}: {
  onOpenModal: () => void
  monthlySalary: number | null
}) => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-2xl font-bold text-ios-dark--light">
        Goal Ticker
      </span>

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
