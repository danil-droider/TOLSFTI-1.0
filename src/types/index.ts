export interface SalaryInput {
  monthlySalary: number | null
  dailyRate: number | null
  hourlyRate: number | null
  perMinuteRate: number | null
}

export interface BreakdownInfo {
  daily: number
  hourly: number
  perMinute: number
}

export type GoalStatus = 'idle' | 'active' | 'paused' | 'completed'

export interface Goal {
  id: string
  title: string
  targetAmount: number
  accumulatedAmount: number
  status: GoalStatus
  lastUpdatedTimestamp: number | null
}