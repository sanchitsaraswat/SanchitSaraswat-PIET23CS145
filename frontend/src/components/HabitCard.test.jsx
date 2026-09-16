import { render, screen } from '@testing-library/react';
import { HabitCard } from './HabitCard.jsx';
import { vi, it, expect } from 'vitest';
it('renders completion and streak information', () => { render(<HabitCard habit={{ name: 'Read', scheduleType: 'DAILY', schedule: [], currentStreak: 4, bestStreak: 8, completedToday: false }} onToggle={vi.fn()} />); expect(screen.getByText('Read')).toBeInTheDocument(); expect(screen.getByRole('button', { name: 'Complete today' })).toBeInTheDocument(); expect(screen.getByLabelText('Current streak')).toHaveTextContent('4'); });
