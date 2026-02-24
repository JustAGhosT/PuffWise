import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DailySummary } from '@/components/daily-summary';
import type { LogEvent } from '@/lib/db';

describe('DailySummary', () => {
  it('shows empty state when no logs', () => {
    render(<DailySummary logs={[]} loading={false} />);
    expect(screen.getByText(/no usage logged today/i)).toBeInTheDocument();
    expect(screen.getByText('0 total')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<DailySummary logs={[]} loading={true} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows aggregated totals by product type', () => {
    const logs: LogEvent[] = [
      { id: 1, productType: 'cigarette', amount: 3, timestamp: '2026-02-24T10:00:00Z' },
      { id: 2, productType: 'cigarette', amount: 2, timestamp: '2026-02-24T14:00:00Z' },
      { id: 3, productType: 'vape', amount: 10, timestamp: '2026-02-24T12:00:00Z' },
    ];
    render(<DailySummary logs={logs} loading={false} />);

    expect(screen.getByText('15 total')).toBeInTheDocument();
    expect(screen.getByText('Cigarette')).toBeInTheDocument();
    expect(screen.getByText('5 cigarettes')).toBeInTheDocument();
    expect(screen.getByText('Vape')).toBeInTheDocument();
    expect(screen.getByText('10 puffs')).toBeInTheDocument();
  });
});
