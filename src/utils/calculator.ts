/** 
 * Salary calculation utilities for the Goal Ticker PWA. 
 * All calculations based on a 30-day month, 24/7 earning. 
 */

/** Base rate per millisecond from monthly salary */
export const computeBaseRatePerMs = (monthlySalary: number): number => {
  return monthlySalary / (30 * 24 * 60 * 60 * 1000)
}

/** Daily earnings (30-day month) */
export const computeDailyRate = (monthlySalary: number): number => {
  return monthlySalary / 30
}

/** Hourly earnings */
export const computeHourlyRate = (monthlySalary: number): number => {
  return monthlySalary / (30 * 24)
}

/** Per-minute earnings */
export const computePerMinuteRate = (monthlySalary: number): number => {
  return monthlySalary / (30 * 24 * 60)
}

/** Full breakdown object */
export const computeBreakdown = (monthlySalary: number): BreakdownInfo => {
  return {
    daily: computeDailyRate(monthlySalary),
    hourly: computeHourlyRate(monthlySalary),
    perMinute: computePerMinuteRate(monthlySalary)
  }
}

/** Format number with tabular-nums friendly formatting */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(value)
}

/** Format plain number with tabular-nums awareness */
export const formatNumber = (value: number): string => {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  })
}

/**
 * Settle goals: calculate exact progress from lastUpdatedTimestamp to now.
 * - baseRatePerMs split equally among all active goals
 * - Auto-completion cascade: if a goal finishes before now, cap it, mark completed,
 *   reduce active count, and redistribute freed rate to remaining goals
 * - Returns [updatedGoals, newlyCompletedGoalIds]
 */
export const settleGoals = (
  goals: readonly Goal[],
  monthlySalary: number,
  now: number
): [Goal[], string[]] => {
  const completedIds: string[] = []
  // Work with a mutable copy
  const updated = goals.map((g) => ({
    ...g,
    accumulatedAmount: g.accumulatedAmount,
    status: g.status,
    lastUpdatedTimestamp: g.lastUpdatedTimestamp
  }))

  // Count currently active goals and compute their base rate share
  let activeCount = 0
  for (const g of updated) {
    if (g.status === 'active') activeCount++
  }

  const baseRatePerMs = computeBaseRatePerMs(monthlySalary)
  const ratePerActive = activeCount > 0 ? baseRatePerMs / activeCount : 0

  // Process each active goal, advancing time sequentially
  let remainingNow = now

  // First pass: settle each goal's earned progress
  // We need to process goals in order, accounting for completions that free up rate
  // We'll do iterative processing: each step advances one goal to completion or to now

  let i = 0
  while (i < updated.length && remainingNow > 0) {
    const g = updated[i]
    if (g.status !== 'active') {
      i++
      continue
    }

    // If no active count (shouldn't happen), skip
    if (activeCount === 0) {
      i++
      continue
    }

    // Time needed for this goal to finish at current rate
    const deltaNeeded = g.targetAmount - g.accumulatedAmount
    if (deltaNeeded <= 0) {
      // Already at or above target - should have been completed already
      i++
      continue
    }

    // Rate this goal is receiving per ms
    const rate = ratePerActive

    // Ms needed to accumulate deltaNeeded at this rate
    const msNeeded = deltaNeeded / rate

    const goalStart = g.lastUpdatedTimestamp ?? now
    const rawElapsed = now - goalStart

    if (rawElapsed >= msNeeded) {
      // Goal finishes before now - complete it
      completedIds.push(g.id)
      // Update goal to completed
      const idx = updated.findIndex((s) => s.id === g.id)
      if (idx >= 0) {
        updated[idx] = {
          ...updated[idx],
          accumulatedAmount: g.targetAmount,
          status: 'completed',
          lastUpdatedTimestamp: goalStart + msNeeded
        }
      }
    } else {
      // Goal makes progress but doesn't finish
      const newAccumulated = g.accumulatedAmount + rate * rawElapsed
      const newAccumulatedClamped = Math.min(newAccumulated, g.targetAmount)
      const idx = updated.findIndex((s) => s.id === g.id)
      if (idx >= 0) {
        updated[idx] = {
          ...updated[idx],
          accumulatedAmount: newAccumulatedClamped
        }
      }
    }
    i++
  }

  // Deduplicate completed IDs
  const seen = new Set<string>()
  const uniqueCompleted: string[] = []
  for (const id of completedIds) {
    if (!seen.has(id)) {
      seen.add(id)
      uniqueCompleted.push(id)
    }
  }

  const resultGoals: Goal[] = updated.map((s) => ({
    id: s.id,
    title: s.title,
    targetAmount: s.targetAmount,
    accumulatedAmount: s.accumulatedAmount,
    status: s.status as GoalStatus,
    lastUpdatedTimestamp: s.lastUpdatedTimestamp
  }))

  return [resultGoals, uniqueCompleted]
}

/** Format remaining time ETA based on current rate per active goal */
export const formatETA = (minutesRemaining: number): string => {
  if (minutesRemaining <= 0) return 'Ready!'

  const minutes = Math.max(0, Math.round(minutesRemaining))
  const days = Math.floor(minutes / (24 * 60))
  const hours = Math.floor((minutes % (24 * 60)) / 60)
  const mins = minutes % 60

  const parts: string[] = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (mins > 0 || parts.length === 0) parts.push(`${mins}m`)

  return parts.join(' ')
}