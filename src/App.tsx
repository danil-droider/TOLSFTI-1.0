import React, { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { SettingsModal } from './components/SettingsModal'
import { GoalCard } from './components/GoalCard'
import { AddGoalModal } from './components/AddGoalModal'
import { useGoalStore } from './store/useGoalStore'
import { computeBreakdown, formatCurrency, formatNumber } from './utils/calculator'

export const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false)
  const { monthlySalary, setMonthlySalary, goals, addGoal, deleteGoal } = useGoalStore()

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const modal = document.querySelector('.settings-modal')
      if (modal && !modal.contains(event.target as Node)) {
        setIsModalOpen(false)
      }
      const addModal = document.querySelector('.add-goal-modal')
      if (addModal && !addModal.contains(event.target as Node)) {
        setIsAddGoalModalOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSaveSalary = (salary: number) => {
    setMonthlySalary(salary)
    setIsModalOpen(false)
  }

  const handleAddGoal = (title: string, targetAmount: number) => {
    addGoal(title, targetAmount)
    setIsAddGoalModalOpen(false)
  }

  const handleDeleteGoal = (id: string) => {
    deleteGoal(id)
  }

  const breakdown = monthlySalary
    ? computeBreakdown(monthlySalary)
    : { daily: 0, hourly: 0, perMinute: 0 }

  return (
    <div className="min-h-screen">

      {/* Header section */}
      <header className="border-b border-ios-text-muted/10 bg-ios-dark py-3 px-4">
        <Header onOpenModal={() => setIsModalOpen(true)} />
      </header>

      {/* Main content */}
      <main className="p-4">

        {/* Settings Modal */}
        <SettingsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveSalary}
          monthlySalary={monthlySalary ?? 0}
          dailyRate={breakdown.daily ?? 0}
          hourlyRate={breakdown.hourly ?? 0}
          perMinuteRate={breakdown.perMinute ?? 0}
        />

        {/* Add Goal Modal */}
        <AddGoalModal
          isOpen={isAddGoalModalOpen}
          onClose={() => setIsAddGoalModalOpen(false)}
          onSave={handleAddGoal}
        />

        {/* Goals List Section */}
        <div className="mt-6">

          {/* Empty state */}
          {goals.length === 0 && (
            <div className="text-center py-8">
              <p className="text-ios-text-muted text-lg">
                No goals yet — add your first goal above
              </p>
            </div>
          )}

          {/* Goals cards */}
          {!goals.length === 0 ? null : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onDelete={(id) => handleDeleteGoal(id)}
                />
              ))}
            </div>
          )}

        </div>

        {/* placeholder for future ticking section */}
        <div className="mt-8 pt-8 border-t border-ios-text-muted/10">
          <h2 className="text-ios-text muted bottom-xl-spacing">
            Live ticking progress — coming in Step 3
          </h2>
        </div>

      </main>
    </div>
  )
}
export default App