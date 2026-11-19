import React, { useRef } from 'react'
import { useGoalStore } from '../store/useGoalStore'

import { Settings } from 'lucide-react'

interface AddGoalModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (title: string, targetAmount: number) => void
}

export const AddGoalModal: React.FC<AddGoalModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const titleRef = useRef<HTMLInputElement>(null)
  const amountRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    const title = titleRef.current?.value.trim() || ''
    const amount = parseFloat(amountRef?.current?.value || '0')

    if (title && !isNaN(amount) && amount > 0) {
      onSave(title, amount)
      setIsModalOpen(false)
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
        aria-labelledby="add-goal-title"
      >
        <h2 id="add-goal-title" className="text-ios-text font-semibold text-xl mb-6 text-center">
          Add Goal
        </h2>

        <div className="mb-5">
          <label
            htmlFor="goal-title"
            className="block text-ios-text-muted text-sm mb-2"
          >
            Goal Name
          </label>
          <input
            id="goal-title"
            ref={titleRef}
            type="text"
            placeholder="e.g., TV, Laptop, Boat"
            className="w-full bg-iosText rounded-lg border border-ios-text-muted/30 px-4 py-3 text-ios-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-iosAccentActive"
            aria-label="Goal name"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="goal-amount"
            className="block text-ios-text-muted text-sm mb-2"
          >
            Target Cost (USD)
          </label>
          <input
            id="goal-amount"
            ref={amountRef}
            type="number"
            min="0.01"
            step="0.01"
            className="w-full bg-iosText rounded-lg border border-ios-text-muted/30 px-4 py-3 text-ios-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-iosAccentActive"
            aria-label="Target cost in USD"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleSave}
            className="bg-iosAccentActive text-white font-medium rounded-lg px-6 py-3 hover:bg-opacity-90 transition-colors"
            disabled={!titleRef.current?.value || isNaN(parseFloat(amountRef.current?.value || '0'))}
            aria-label="Add goal"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="text-ios-text-muted rounded-lg px-4 py-3 hover:bg-ios-card transition-colors"
            aria-label="Cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}