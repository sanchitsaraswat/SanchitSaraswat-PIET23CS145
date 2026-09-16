const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export function assertDate(value) { if (!DATE_RE.test(value) || Number.isNaN(new Date(`${value}T12:00:00Z`).valueOf())) throw new Error('Invalid calendar date'); return value; }
export function dateToKey(date) { return date.toISOString().slice(0, 10); }
export function keyToDate(key) { assertDate(key); return new Date(`${key}T12:00:00Z`); }
export function addDays(key, days) { const d = keyToDate(key); d.setUTCDate(d.getUTCDate() + days); return dateToKey(d); }
export function weekday(key) { return keyToDate(key).getUTCDay(); }
export function todayInTimezone(timeZone) { return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
