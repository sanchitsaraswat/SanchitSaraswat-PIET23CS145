import { isHabitScheduledForDate, getPreviousScheduledDate } from './scheduling.js';
const completionKeys = (habit) => new Set(habit.completions.map((c) => typeof c === 'string' ? c : c.completionDate.toISOString().slice(0, 10)));
export function calculateCurrentStreak(habit, referenceDate) {
  const completed = completionKeys(habit); let cursor = isHabitScheduledForDate(habit, referenceDate) ? referenceDate : getPreviousScheduledDate(habit, referenceDate);
  let count = 0; while (cursor && completed.has(cursor)) { count++; cursor = getPreviousScheduledDate(habit, cursor); } return count;
}
export function calculateBestStreak(habit) {
  const completed = completionKeys(habit); if (!completed.size) return 0;
  let best = 0;
  for (const end of completed) best = Math.max(best, calculateCurrentStreak(habit, end));
  return best;
}
