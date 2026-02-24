import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RecentLogs } from '@/components/recent-logs';
import type { LogEvent } from '@/lib/db';

describe('RecentLogs', () => {
  it('shows empty state when no logs', () => {
    render(<RecentLogs logs={[]} loading={false} />);
    expect(screen.getByText(/no log entries yet/i)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<RecentLogs logs={[]} loading={true} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders log entries with product info and time', () => {
    const logs: LogEvent[] = [
      { id: 1, productType: 'cigarette', amount: 3, timestamp: '2026-02-24T10:30:00Z' },
      { id: 2, productType: 'vape', amount: 5, timestamp: '2026-02-24T14:15:00Z' },
    ];
    render(<RecentLogs logs={logs} loading={false} />);

    expect(screen.getByText('3 cigarettes')).toBeInTheDocument();
    expect(screen.getByText('5 puffs')).toBeInTheDocument();
  });

  it('renders notes when present', () => {
    const logs: LogEvent[] = [
      { id: 1, productType: 'cigarette', amount: 1, timestamp: '2026-02-24T10:00:00Z', notes: 'After lunch' },
    ];
    render(<RecentLogs logs={logs} loading={false} />);
    expect(screen.getByText('After lunch')).toBeInTheDocument();
  });
});
