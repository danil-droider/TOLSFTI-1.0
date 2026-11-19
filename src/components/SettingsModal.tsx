import React, { useRef } from 'react'
import { useGoalStore } from '../store/useGoalStore'
import { computeBreakdown, formatNumber } from '../utils/calculator'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (salary: number) => void
  monthlySalary: number
  dailyRate: number
  hourlyRate: number
  perMinuteRate: number
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  monthlySalary,
  dailyRate,
  hourlyRate,
  perMinuteRate,
}) => {
  const salaryRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    const input = salaryRef.current
    const value = input ? parseFloat(input.value) : 0
    if (value > 0) {
      onSave(value)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div
        className="bg-ios-card rounded-2xl w-full max-w-md mx-4 p-6 transform scale-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h2
          id="modal-title"
          className="text-ios-text font-semibold text-xl mb-6 text-center"
        >
          Settings
        </h2>

        {/* Monthly Salary Input */}
        <div className="mb-6">
          <label
            htmlFor="monthly-salary"
            className="block text-ios-text-muted text-sm mb-2"
          >
            Monthly Salary (30 days) in USD
          </label>
          <input
            id="monthly-salary"
            ref={salaryRef}
            type="number"
            step="0.01"
            min="0"
            value={monthlySalary}
            onChange={(e) => {
              const val = parseFloat(e.target.value) || 0
              // Update local state immediately for feedback
              // (onSave will persist the final value)
            }}
            className="w-full bg-iosDark rounded-lg border border-ios-text-muted/30 px-4 py-3 text-ios-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-iosAccentActive"
            aria-label="Monthly salary in USD"
          />
        </div>

        {/* Auto-calculated breakdown */}
        <div className="space-y-4 mb-8">
          <div>
            <span className="text-ios-text-muted text-xs uppercase tracking-wider block mb-1">
              Daily Earnings
            </span>
            <span className="text-ios-text font-medium">
              {formatNumber(dailyRate)} / day
            </span>
          </div>

          <div>
            <span className="text-ios-text-muted text-xs uppercase tracking-wider block mb-1">
              Hourly Earnings
            </span>
            <span className="text-ios-text font-medium">
              {formatNumber(hourlyRate)} / hr
            </span>
          </div>

          <div>
            <span className="text-ios-text-muted text-xs uppercase tracking-wider block mb-1">
              Per-Minute Earnings
            </span>
            <span className="text-ios-text font-medium">
              {formatNumber(perMinuteRate)} / min
            </span>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleSave}
            className="bg-iosAccentActive text-white font-medium rounded-lg px-6 py-3 hover:bg-opacity-90 transition-colors"
            disabled={monthlySalary > 0}
            aria-label="Save salary setting"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="text-ios-text-muted rounded-lg px-4 py-3 hover:bg-ios-card transition-colors"
            aria-label="Close settings"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}