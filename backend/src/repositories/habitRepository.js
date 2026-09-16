import { prisma } from '../db/prisma.js';
const detail = { schedule: { orderBy: { weekday: 'asc' } }, completions: { orderBy: { completionDate: 'desc' } } };
export const habitRepository = {
  findByIdForUser: (id, userId) => prisma.habit.findFirst({ where: { id, userId }, include: detail }),
  listForUser: ({ userId, archived, search, skip, take }) => prisma.habit.findMany({ where: { userId, archivedAt: archived ? { not: null } : null, ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}) }, include: detail, orderBy: { createdAt: 'desc' }, skip, take }),
  countForUser: ({ userId, archived, search }) => prisma.habit.count({ where: { userId, archivedAt: archived ? { not: null } : null, ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}) } }),
  create: ({ userId, name, description, scheduleType, weekdays }) => prisma.habit.create({ data: { userId, name, description, scheduleType, schedule: scheduleType === 'CUSTOM' ? { create: weekdays.map((weekday) => ({ weekday })) } : undefined }, include: detail }),
  update: (id, data) => prisma.habit.update({ where: { id }, data, include: detail }),
  archive: (id, archivedAt) => prisma.habit.update({ where: { id }, data: { archivedAt }, include: detail }),
  completionForDate: (habitId, completionDate) => prisma.habitCompletion.findUnique({ where: { habitId_completionDate: { habitId, completionDate } } }),
  addCompletion: (habitId, completionDate) => prisma.habitCompletion.upsert({ where: { habitId_completionDate: { habitId, completionDate } }, update: {}, create: { habitId, completionDate } }),
  removeCompletion: (habitId, completionDate) => prisma.habitCompletion.deleteMany({ where: { habitId, completionDate } }),
  listCompletions: (habitId, skip, take) => prisma.habitCompletion.findMany({ where: { habitId }, select: { completionDate: true, createdAt: true }, orderBy: { completionDate: 'desc' }, skip, take }),
  countCompletions: (habitId) => prisma.habitCompletion.count({ where: { habitId } })
};
