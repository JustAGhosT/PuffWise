import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Onboarding } from '@/components/onboarding';

describe('Onboarding', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders the onboarding overlay when not yet onboarded', () => {
    render(<Onboarding />);
    expect(screen.getByText('Welcome to PuffWise')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('does not render when already onboarded (localStorage key set)', () => {
    localStorage.setItem('puffwise-onboarded', '1');
    const { container } = render(<Onboarding />);
    expect(container.firstChild).toBeNull();
  });

  it('dismisses when "Get Started" is clicked', async () => {
    const user = userEvent.setup();
    render(<Onboarding />);
    expect(screen.getByText('Welcome to PuffWise')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /get started/i }));
    expect(screen.queryByText('Welcome to PuffWise')).not.toBeInTheDocument();
    expect(localStorage.getItem('puffwise-onboarded')).toBe('1');
  });

  it('dismisses when "Skip" is clicked', async () => {
    const user = userEvent.setup();
    render(<Onboarding />);

    await user.click(screen.getByRole('button', { name: /skip/i }));
    expect(screen.queryByText('Welcome to PuffWise')).not.toBeInTheDocument();
    expect(localStorage.getItem('puffwise-onboarded')).toBe('1');
  });

  it('saves selected products to localStorage on dismiss', async () => {
    const user = userEvent.setup();
    render(<Onboarding />);

    await user.click(screen.getByText('Cigarette'));
    await user.click(screen.getByText('Vape'));
    await user.click(screen.getByRole('button', { name: /get started/i }));

    const saved = JSON.parse(localStorage.getItem('puffwise-onboarding-selections') ?? '[]');
    expect(saved).toContain('cigarette');
    expect(saved).toContain('vape');
  });

  it('toggles product selection on and off', async () => {
    const user = userEvent.setup();
    render(<Onboarding />);

    const cigaretteButton = screen.getByText('Cigarette').closest('button')!;
    await user.click(cigaretteButton);
    expect(cigaretteButton).toHaveClass('border-emerald-500');

    await user.click(cigaretteButton);
    expect(cigaretteButton).not.toHaveClass('border-emerald-500');
  });
});
