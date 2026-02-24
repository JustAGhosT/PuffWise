import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/settings',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
}));

// Mock db functions
vi.mock('@/lib/db', () => ({
  getAllLogEvents: vi.fn().mockResolvedValue([]),
  clearAllData: vi.fn().mockResolvedValue(undefined),
  db: { logEvents: { add: vi.fn() } },
}));

const { default: SettingsPage } = await import('@/app/settings/page');

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all settings sections', () => {
    render(<SettingsPage />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Export Data')).toBeInTheDocument();
    expect(screen.getByText('Import Data')).toBeInTheDocument();
    expect(screen.getAllByText(/clear all data/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('shows PuffWise version in About section', () => {
    render(<SettingsPage />);
    expect(screen.getByText('v0.1.0')).toBeInTheDocument();
    expect(screen.getByText(/no cloud/i)).toBeInTheDocument();
  });

  it('opens clear data confirmation dialog', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    await user.click(screen.getByRole('button', { name: /clear all data/i }));

    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete everything/i })).toBeInTheDocument();
  });
});
