import { describe, expect, it } from 'vitest';
import { calculateBestStreak, calculateCurrentStreak } from '../src/domain/streaks.js';
const habit = (scheduleType, weekdays, dates) => ({ scheduleType, schedule: weekdays.map((weekday) => ({ weekday })), completions: dates.map((completionDate) => ({ completionDate: new Date(`${completionDate}T12:00:00Z`) })) });
describe('streak engine', () => {
  it('counts a daily consecutive streak and resets after a miss', () => { const h = habit('DAILY', [], ['2024-02-26', '2024-02-28', '2024-02-29']); expect(calculateCurrentStreak(h, '2024-02-29')).toBe(2); expect(calculateBestStreak(h)).toBe(2); });
  it('does not let weekends break a weekday streak', () => { const h = habit('CUSTOM', [1,2,3,4,5], ['2024-03-01', '2024-03-04']); expect(calculateCurrentStreak(h, '2024-03-04')).toBe(2); });
  it('uses scheduled occurrences for custom schedules across a year boundary', () => { const h = habit('CUSTOM', [1,3,6], ['2023-12-30', '2024-01-01', '2024-01-03']); expect(calculateCurrentStreak(h, '2024-01-03')).toBe(3); expect(calculateBestStreak(h)).toBe(3); });
  it('returns zero when today is incomplete even when it is scheduled', () => { const h = habit('DAILY', [], ['2024-05-01']); expect(calculateCurrentStreak(h, '2024-05-02')).toBe(0); });
});
