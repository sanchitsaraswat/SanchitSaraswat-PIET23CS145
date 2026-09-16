import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client.js';
import { HabitCard } from '../components/HabitCard.jsx';

export function DashboardPage() {
  const client = useQueryClient();
  const [reminderDismissed, setReminderDismissed] = useState(true);
  const query = useQuery({ queryKey: ['dashboard'], queryFn: () => api.get('/api/dashboard/today') });
  const toggle = useMutation({
    mutationFn: (habit) => habit.completedToday
      ? api.delete(`/api/habits/${habit.id}/completions/${query.data.date}`)
      : api.post(`/api/habits/${habit.id}/completions`, { date: query.data.date }),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['dashboard'] });
      client.invalidateQueries({ queryKey: ['habits'] });
    }
  });
  const { date, habits = [], summary } = query.data || {};

  useEffect(() => {
    if (!date) return;
    setReminderDismissed(localStorage.getItem(`habitly-reminder-${date}`) === 'dismissed');
  }, [date]);

  if (query.isLoading) return <section aria-busy="true" className="space-y-6"><div className="h-4 w-16 animate-pulse rounded bg-emerald-100"/><div className="h-10 w-64 animate-pulse rounded-xl bg-slate-200"/><div className="card h-32 animate-pulse bg-slate-100"/></section>;
  if (query.isError) return <p role="alert" className="status-message border-red-200 bg-red-50 text-red-800">{query.error.message}</p>;

  const remainingHabits = habits.filter((habit) => !habit.completedToday);
  const sortedHabits = [...habits].sort((first, second) => Number(first.completedToday) - Number(second.completedToday));
  const remaining = remainingHabits.length;
  const progress = summary.total ? Math.round((summary.completed / summary.total) * 100) : 0;
  const visibleNames = remainingHabits.slice(0, 3).map((habit) => habit.name);
  const hiddenCount = remaining - visibleNames.length;
  const remainingLabel = visibleNames.length === 1
    ? visibleNames[0]
    : `${visibleNames.slice(0, -1).join(', ')}${visibleNames.length > 1 ? ` and ${visibleNames[visibleNames.length - 1]}` : ''}`;
  const namedReminder = hiddenCount > 0 ? `${remainingLabel}, and ${hiddenCount} more` : remainingLabel;
  const showReminder = remaining > 0 && !reminderDismissed;
  const dismissReminder = () => {
    localStorage.setItem(`habitly-reminder-${date}`, 'dismissed');
    setReminderDismissed(true);
  };

  return <section>
    <p className="eyebrow">Today</p>
    <div className="mt-1 flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Your daily rhythm</h1><p className="mt-2 text-sm text-slate-600">A little consistency goes a long way.</p></div><p className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">{summary.completed} of {summary.total} complete</p></div>
    <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 sm:p-5"><div className="flex items-center justify-between gap-4"><div><p className="text-sm font-bold text-emerald-950">Today's progress</p><p className="mt-1 text-sm text-emerald-800">{progress === 100 ? 'Everything on your list is done. Nicely held.' : `${remaining} ${remaining === 1 ? 'habit' : 'habits'} left to log.`}</p></div><span className="text-2xl font-bold tracking-tight text-mint">{progress}%</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-emerald-100" role="progressbar" aria-label="Today's habit progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}><div className="h-full rounded-full bg-mint transition-all duration-500" style={{ width: `${progress}%` }}/></div></div>
    {showReminder && <aside className="mt-5 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950 sm:flex-row sm:items-center sm:justify-between" aria-label="Unlogged habit reminder" aria-live="polite"><div className="flex gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-100 text-lg" aria-hidden="true">!</span><div><p className="text-sm font-bold">You still have habits to log</p><p className="mt-0.5 text-sm leading-5 text-amber-900">{namedReminder} {remaining === 1 ? 'is' : 'are'} waiting for today.</p></div></div><button className="self-start rounded-lg px-2 py-1 text-sm font-bold text-amber-900 hover:bg-amber-100 sm:self-auto" onClick={dismissReminder}>Dismiss</button></aside>}
    <div className="mt-7 space-y-3">{sortedHabits.length ? sortedHabits.map((habit) => <HabitCard key={habit.id} habit={habit} onToggle={toggle.mutate} busy={toggle.isPending}/>) : <div className="card py-10 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-xl">✦</div><h2 className="mt-4 font-bold">Nothing scheduled for today</h2><p className="mt-1 text-sm text-slate-600">Add a habit, or enjoy the breathing room.</p></div>}</div>
  </section>;
}
