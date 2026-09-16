import { addDays, weekday } from '../utils/date.js';
export function isHabitScheduledForDate(habit, date) { return habit.scheduleType === 'DAILY' || habit.schedule.some((item) => item.weekday === weekday(date)); }
export function getPreviousScheduledDate(habit, date) { for (let i = 1; i <= 7; i++) { const candidate = addDays(date, -i); if (isHabitScheduledForDate(habit, candidate)) return candidate; } return null; }
export function getNextScheduledDate(habit, date) { for (let i = 1; i <= 7; i++) { const candidate = addDays(date, i); if (isHabitScheduledForDate(habit, candidate)) return candidate; } return null; }
