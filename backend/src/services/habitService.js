import { habitRepository } from '../repositories/habitRepository.js';
import { AppError } from '../errors/AppError.js';
import { calculateBestStreak, calculateCurrentStreak } from '../domain/streaks.js';
import { isHabitScheduledForDate } from '../domain/scheduling.js';
import { todayInTimezone, keyToDate } from '../utils/date.js';
const serialize = (habit, today) => ({ ...habit, completions: undefined, schedule: habit.schedule, currentStreak: calculateCurrentStreak(habit, today), bestStreak: calculateBestStreak(habit), completedToday: habit.completions.some((c) => c.completionDate.toISOString().slice(0, 10) === today), scheduledToday: isHabitScheduledForDate(habit, today) });
async function owned(id, userId) { const habit = await habitRepository.findByIdForUser(id, userId); if (!habit) throw new AppError(404, 'HABIT_NOT_FOUND', 'Habit not found'); return habit; }
export const habitService = {
  async list(user, query) { const archived = query.archived === 'true'; const [items, total] = await Promise.all([habitRepository.listForUser({ userId: user.id, archived, search: query.q, skip: (query.page - 1) * query.limit, take: query.limit }), habitRepository.countForUser({ userId: user.id, archived, search: query.q })]); const today = todayInTimezone(user.timezone); return { items: items.map((h) => serialize(h, today)), pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) } }; },
  async get(user, id) { return serialize(await owned(id, user.id), todayInTimezone(user.timezone)); },
  create: (user, data) => habitRepository.create({ userId: user.id, ...data }),
  async update(user, id, data) { const habit = await owned(id, user.id); const update = { ...data }; if (data.weekdays) { update.schedule = { deleteMany: {}, create: data.weekdays.map((weekday) => ({ weekday })) }; delete update.weekdays; } return habitRepository.update(habit.id, update); },
  async archive(user, id, shouldArchive) { const habit = await owned(id, user.id); return habitRepository.archive(habit.id, shouldArchive ? new Date() : null); },
  async complete(user, id, date) { const habit = await owned(id, user.id); if (habit.archivedAt) throw new AppError(409, 'HABIT_ARCHIVED', 'Archived habits cannot be completed'); if (!isHabitScheduledForDate(habit, date)) throw new AppError(422, 'UNSCHEDULED_DATE', 'This habit is not scheduled for that date'); return habitRepository.addCompletion(habit.id, keyToDate(date)); },
  async undo(user, id, date) { const habit = await owned(id, user.id); await habitRepository.removeCompletion(habit.id, keyToDate(date)); },
  async completions(user, id, query) { const habit = await owned(id, user.id); const [items, total] = await Promise.all([habitRepository.listCompletions(habit.id, (query.page - 1) * query.limit, query.limit), habitRepository.countCompletions(habit.id)]); return { items, pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) } }; }
};
