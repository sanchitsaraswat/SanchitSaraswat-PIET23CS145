import { useState } from 'react';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const activityTemplates = [
  { name: 'Morning movement', description: 'Move your body for 20 minutes.', scheduleType: 'DAILY', weekdays: [], icon: '↗', tone: 'emerald' },
  { name: 'Read 20 pages', description: 'Read a few pages before bed.', scheduleType: 'DAILY', weekdays: [], icon: '▤', tone: 'amber' },
  { name: 'Drink more water', description: 'Finish eight glasses of water today.', scheduleType: 'DAILY', weekdays: [], icon: '◌', tone: 'sky' },
  { name: 'Meditate', description: 'Take five quiet minutes to reset.', scheduleType: 'CUSTOM', weekdays: [1, 2, 3, 4, 5], icon: '◒', tone: 'violet' },
  { name: 'Practice a language', description: 'Spend 15 minutes learning something new.', scheduleType: 'CUSTOM', weekdays: [1, 3, 5], icon: 'あ', tone: 'rose' },
  { name: 'Tidy for 10 minutes', description: 'Make one small space feel better.', scheduleType: 'DAILY', weekdays: [], icon: '✦', tone: 'orange' },
  { name: 'Plan tomorrow', description: 'Write down your three priorities.', scheduleType: 'CUSTOM', weekdays: [0, 1, 2, 3, 4], icon: '⌁', tone: 'indigo' },
  { name: 'Gratitude journal', description: 'Note one good thing from today.', scheduleType: 'DAILY', weekdays: [], icon: '♡', tone: 'pink' }
];

const toneClasses = {
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900 hover:border-emerald-300',
  amber: 'border-amber-200 bg-amber-50 text-amber-900 hover:border-amber-300',
  sky: 'border-sky-200 bg-sky-50 text-sky-900 hover:border-sky-300',
  violet: 'border-violet-200 bg-violet-50 text-violet-900 hover:border-violet-300',
  rose: 'border-rose-200 bg-rose-50 text-rose-900 hover:border-rose-300',
  orange: 'border-orange-200 bg-orange-50 text-orange-900 hover:border-orange-300',
  indigo: 'border-indigo-200 bg-indigo-50 text-indigo-900 hover:border-indigo-300',
  pink: 'border-pink-200 bg-pink-50 text-pink-900 hover:border-pink-300'
};

export function HabitForm({ onSubmit, onCancel, initial }) {
  const [name, setName] = useState(initial?.name || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [scheduleType, setScheduleType] = useState(initial?.scheduleType || 'DAILY');
  const [weekdays, setWeekdays] = useState(initial?.schedule?.map((day) => day.weekday) || [1, 2, 3, 4, 5]);
  const [error, setError] = useState('');

  const applyTemplate = (template) => {
    setName(template.name);
    setDescription(template.description);
    setScheduleType(template.scheduleType);
    setWeekdays(template.weekdays);
    setError('');
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!name.trim()) return setError('A habit name is required.');
    if (scheduleType === 'CUSTOM' && !weekdays.length) return setError('Choose at least one day.');
    setError('');
    await onSubmit({ name, description: description || null, scheduleType, weekdays: scheduleType === 'CUSTOM' ? weekdays : [] });
  };

  return <form className="card space-y-5" onSubmit={submit}>
    <div>
      <p className="eyebrow">{initial ? 'Fine tune your routine' : 'A small promise to yourself'}</p>
      <h2 className="mt-1 text-xl font-bold tracking-tight">{initial ? 'Habit details' : 'Create a habit'}</h2>
    </div>
    {!initial && <fieldset>
      <legend className="text-sm font-semibold text-slate-800">Start with an idea</legend>
      <p className="mt-1 text-xs leading-5 text-slate-500">Choose a starting point, then make it yours.</p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {activityTemplates.map((template) => <button key={template.name} type="button" className={`min-h-24 rounded-xl border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${toneClasses[template.tone]}`} onClick={() => applyTemplate(template)}>
          <span className="text-lg" aria-hidden="true">{template.icon}</span>
          <span className="mt-1 block text-xs font-bold leading-4">{template.name}</span>
        </button>)}
      </div>
    </fieldset>}
    <div><label htmlFor="habit-name" className="text-sm font-semibold text-slate-800">Habit name</label><input id="habit-name" className="field" placeholder="e.g. Read for 20 minutes" value={name} maxLength="100" onChange={(event) => setName(event.target.value)} /></div>
    <div><label htmlFor="description" className="text-sm font-semibold text-slate-800">Description <span className="font-normal text-slate-500">optional</span></label><textarea id="description" className="field" placeholder="A little context can make a habit easier to keep." value={description} maxLength="1000" onChange={(event) => setDescription(event.target.value)} /></div>
    <fieldset><legend className="text-sm font-semibold text-slate-800">Schedule</legend><select aria-label="Schedule type" className="field" value={scheduleType} onChange={(event) => setScheduleType(event.target.value)}><option value="DAILY">Every day</option><option value="CUSTOM">Selected days</option></select>{scheduleType === 'CUSTOM' && <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">{days.map((day, index) => <label key={day} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${weekdays.includes(index) ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-slate-200 hover:bg-slate-50'}`}><input className="h-4 w-4 rounded border-slate-300 text-mint focus:ring-mint" type="checkbox" checked={weekdays.includes(index)} onChange={() => setWeekdays((list) => list.includes(index) ? list.filter((dayIndex) => dayIndex !== index) : [...list, index])} />{day}</label>)}</div>}</fieldset>
    {error && <p role="alert" className="status-message border-red-200 bg-red-50 text-red-800">{error}</p>}
    <div className="flex flex-wrap gap-3"><button className="primary" type="submit">{initial ? 'Save changes' : 'Create habit'}</button>{onCancel && <button className="secondary" type="button" onClick={onCancel}>Cancel</button>}</div>
  </form>;
}
