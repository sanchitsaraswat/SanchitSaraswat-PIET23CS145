import { authService } from '../services/authService.js';
import { habitService } from '../services/habitService.js';
import { todayInTimezone } from '../utils/date.js';
export async function today(req, res) { const user = await authService.me(req.auth.sub); const result = await habitService.list(user, { page: 1, limit: 100, archived: 'false' }); const habits = result.items.filter((habit) => habit.scheduledToday); res.json({ data: { date: todayInTimezone(user.timezone), habits, summary: { total: habits.length, completed: habits.filter((h) => h.completedToday).length } } }); }
