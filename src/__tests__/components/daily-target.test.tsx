import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DailyTarget } from '@/components/daily-target';
import type { Challenge, LogEvent } from '@/lib/db';

const makeChallenge = (overrides: Partial<Challenge> = {}): Challenge => ({
  id: 1,
  type: 'target',
  status: 'active',
  productType: 'cigarette',
  dailyLimit: 10,
  startDate: '2026-01-01',
  ...overrides,
});

const makeLog = (productType: string, amount: number): LogEvent => ({
  id: 1,
  productType,
  amount,
  timestamp: new Date().toISOString(),
});

describe('DailyTarget', () => {
  it('renders nothing when there are no target challenges', () => {
    const { container } = render(<DailyTarget challenges={[]} todayLogs={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing for streak challenges (no target type)', () => {
    const challenge = makeChallenge({ type: 'streak', dailyLimit: undefined });
    const { container } = render(<DailyTarget challenges={[challenge]} todayLogs={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the Daily Targets card for a target challenge', () => {
    const challenge = makeChallenge();
    render(<DailyTarget challenges={[challenge]} todayLogs={[]} />);
    expect(screen.getByText('Daily Targets')).toBeInTheDocument();
    expect(screen.getByText('Cigarette')).toBeInTheDocument();
    expect(screen.getByText('0 / 10 cigarettes')).toBeInTheDocument();
  });

  it('shows correct count based on today logs', () => {
    const challenge = makeChallenge({ dailyLimit: 10 });
    const logs = [makeLog('cigarette', 4), makeLog('cigarette', 2)];
    render(<DailyTarget challenges={[challenge]} todayLogs={logs} />);
    expect(screen.getByText('6 / 10 cigarettes')).toBeInTheDocument();
  });

  it('shows over-limit state when todayCount exceeds dailyLimit', () => {
    const challenge = makeChallenge({ dailyLimit: 5 });
    const logs = [makeLog('cigarette', 8)];
    render(<DailyTarget challenges={[challenge]} todayLogs={logs} />);
    const countText = screen.getByText('8 / 5 cigarettes');
    expect(countText).toHaveClass('text-red-500');
  });

  it('progress bar fills to 100% when at limit', () => {
    const challenge = makeChallenge({ dailyLimit: 5 });
    const logs = [makeLog('cigarette', 5)];
    const { container } = render(<DailyTarget challenges={[challenge]} todayLogs={logs} />);
    const progressBar = container.querySelector('.h-full.rounded-full') as HTMLElement;
    expect(progressBar.style.width).toBe('100%');
  });

  it('progress bar shows 0% when no logs and limit is positive', () => {
    const challenge = makeChallenge({ dailyLimit: 10 });
    const { container } = render(<DailyTarget challenges={[challenge]} todayLogs={[]} />);
    const progressBar = container.querySelector('.h-full.rounded-full') as HTMLElement;
    expect(progressBar.style.width).toBe('0%');
  });
});
