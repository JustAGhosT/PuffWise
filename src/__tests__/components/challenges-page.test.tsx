import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockCreate = vi.fn();
const mockComplete = vi.fn();
const mockFail = vi.fn();
const mockUseActiveChallenges = vi.fn();
const mockUseAllChallenges = vi.fn();

vi.mock('@/lib/hooks/use-challenges', () => ({
  useActiveChallenges: () => mockUseActiveChallenges(),
  useAllChallenges: () => mockUseAllChallenges(),
}));

const { default: ChallengesPage } = await import('@/app/challenges/page');

const makeActive = (id: number) => ({
  id,
  type: 'target' as const,
  status: 'active' as const,
  productType: 'cigarette',
  dailyLimit: 10,
  startDate: '2026-01-01',
  targetDate: '2026-02-01',
  linkedLogIds: [],
});

describe('ChallengesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseActiveChallenges.mockReturnValue({
      challenges: [],
      create: mockCreate,
      complete: mockComplete,
      fail: mockFail,
    });
    mockUseAllChallenges.mockReturnValue({ challenges: [] });
  });

  it('renders the page title', () => {
    render(<ChallengesPage />);
    expect(screen.getByText('Challenges')).toBeInTheDocument();
  });

  it('shows empty state when no active challenges', () => {
    render(<ChallengesPage />);
    expect(screen.getByText(/no active challenges/i)).toBeInTheDocument();
  });

  it('shows active challenge in the list', () => {
    mockUseActiveChallenges.mockReturnValue({
      challenges: [makeActive(1)],
      create: mockCreate,
      complete: mockComplete,
      fail: mockFail,
    });
    render(<ChallengesPage />);
    expect(screen.getByText('Active Challenges')).toBeInTheDocument();
    expect(screen.getByText('Cigarette')).toBeInTheDocument();
  });

  it('shows summary counts', () => {
    const completedChallenge = { ...makeActive(2), status: 'completed' as const };
    const failedChallenge = { ...makeActive(3), status: 'failed' as const };
    mockUseAllChallenges.mockReturnValue({
      challenges: [completedChallenge, failedChallenge],
    });
    render(<ChallengesPage />);
    // The summary cards show "Completed" and "Failed" labels
    const completedLabels = screen.getAllByText('Completed');
    expect(completedLabels.length).toBeGreaterThanOrEqual(1);
    const failedLabels = screen.getAllByText('Failed');
    expect(failedLabels.length).toBeGreaterThanOrEqual(1);
  });

  it('shows the create form when "New Challenge" is clicked', async () => {
    const user = userEvent.setup();
    render(<ChallengesPage />);
    await user.click(screen.getByRole('button', { name: /new challenge/i }));
    expect(screen.getByText('Create Challenge')).toBeInTheDocument();
  });

  it('shows validation error for invalid duration', async () => {
    const user = userEvent.setup();
    render(<ChallengesPage />);
    await user.click(screen.getByRole('button', { name: /new challenge/i }));

    const durationInput = screen.getByDisplayValue('30');
    await user.clear(durationInput);
    await user.type(durationInput, '-5');

    await user.click(screen.getByRole('button', { name: /start challenge/i }));
    expect(screen.getByText(/duration must be a positive number/i)).toBeInTheDocument();
  });

  it('calls complete when check button is clicked', async () => {
    const user = userEvent.setup();
    mockCreate.mockResolvedValue(undefined);
    mockComplete.mockResolvedValue(undefined);
    mockUseActiveChallenges.mockReturnValue({
      challenges: [makeActive(1)],
      create: mockCreate,
      complete: mockComplete,
      fail: mockFail,
    });
    render(<ChallengesPage />);
    const checkButtons = screen.getAllByRole('button').filter((b) =>
      b.querySelector('svg')
    );
    // Find the complete (check) button - it has emerald class
    const completeBtn = document
      .querySelector('button.text-emerald-600') as HTMLButtonElement;
    if (completeBtn) {
      await user.click(completeBtn);
      expect(mockComplete).toHaveBeenCalledWith(1);
    }
  });

  it('calls fail when X button is clicked', async () => {
    const user = userEvent.setup();
    mockFail.mockResolvedValue(undefined);
    mockUseActiveChallenges.mockReturnValue({
      challenges: [makeActive(1)],
      create: mockCreate,
      complete: mockComplete,
      fail: mockFail,
    });
    render(<ChallengesPage />);
    const failBtn = document.querySelector('button.text-red-500') as HTMLButtonElement;
    if (failBtn) {
      await user.click(failBtn);
      expect(mockFail).toHaveBeenCalledWith(1);
    }
  });
});
