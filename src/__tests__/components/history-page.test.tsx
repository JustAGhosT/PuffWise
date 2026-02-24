import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock next/navigation before importing the page
vi.mock('next/navigation', () => ({
  usePathname: () => '/history',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
}));

// Mock the useAllLogs hook
const mockRemoveLog = vi.fn();
const mockUseAllLogs = vi.fn();
vi.mock('@/lib/hooks/use-logs', () => ({
  useAllLogs: () => mockUseAllLogs(),
}));

// Dynamically import after mocks are set up
const { default: HistoryPage } = await import('@/app/history/page');

describe('HistoryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows empty state when no logs', () => {
    mockUseAllLogs.mockReturnValue({ logs: [], loading: false, removeLog: mockRemoveLog, refresh: vi.fn() });
    render(<HistoryPage />);
    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText(/no log entries yet/i)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseAllLogs.mockReturnValue({ logs: [], loading: true, removeLog: mockRemoveLog, refresh: vi.fn() });
    render(<HistoryPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders logs grouped by date', () => {
    mockUseAllLogs.mockReturnValue({
      logs: [
        { id: 1, productType: 'cigarette', amount: 3, timestamp: '2026-02-24T10:00:00Z' },
        { id: 2, productType: 'vape', amount: 5, timestamp: '2026-02-24T14:00:00Z' },
        { id: 3, productType: 'cigarette', amount: 2, timestamp: '2026-02-23T09:00:00Z' },
      ],
      loading: false,
      removeLog: mockRemoveLog,
      refresh: vi.fn(),
    });
    render(<HistoryPage />);

    expect(screen.getByText('8 total')).toBeInTheDocument();
    expect(screen.getByText('2 total')).toBeInTheDocument();
    expect(screen.getByText('3 cigarettes')).toBeInTheDocument();
    expect(screen.getByText('5 puffs')).toBeInTheDocument();
  });

  it('filters by product type', async () => {
    const user = userEvent.setup();
    mockUseAllLogs.mockReturnValue({
      logs: [
        { id: 1, productType: 'cigarette', amount: 3, timestamp: '2026-02-24T10:00:00Z' },
        { id: 2, productType: 'vape', amount: 5, timestamp: '2026-02-24T14:00:00Z' },
      ],
      loading: false,
      removeLog: mockRemoveLog,
      refresh: vi.fn(),
    });
    render(<HistoryPage />);

    await user.click(screen.getByRole('button', { name: 'Vape' }));

    expect(screen.getByText('5 puffs')).toBeInTheDocument();
    expect(screen.queryByText('3 cigarettes')).not.toBeInTheDocument();
  });
});
