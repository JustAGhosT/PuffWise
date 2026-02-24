import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StreakIndicator } from '@/components/streak-indicator';
import type { LogEvent } from '@/lib/db';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(12, 0, 0, 0);
  return d.toISOString();
}

describe('StreakIndicator', () => {
  it('shows 0 streak when no logs', () => {
    render(<StreakIndicator logs={[]} />);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText(/days tracking streak/i)).toBeInTheDocument();
  });

  it('shows 1 day streak for singular', () => {
    const logs: LogEvent[] = [
      { id: 1, productType: 'cigarette', amount: 1, timestamp: daysAgo(0) },
    ];
    render(<StreakIndicator logs={logs} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText(/day tracking streak/i)).toBeInTheDocument();
  });

  it('counts consecutive days', () => {
    const logs: LogEvent[] = [
      { id: 1, productType: 'cigarette', amount: 1, timestamp: daysAgo(0) },
      { id: 2, productType: 'cigarette', amount: 1, timestamp: daysAgo(1) },
      { id: 3, productType: 'cigarette', amount: 1, timestamp: daysAgo(2) },
    ];
    render(<StreakIndicator logs={logs} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('breaks streak on gap day', () => {
    const logs: LogEvent[] = [
      { id: 1, productType: 'cigarette', amount: 1, timestamp: daysAgo(0) },
      // gap at daysAgo(1)
      { id: 2, productType: 'cigarette', amount: 1, timestamp: daysAgo(2) },
    ];
    render(<StreakIndicator logs={logs} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
