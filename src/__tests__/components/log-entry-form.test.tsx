import { LogEntryForm } from '@/components/log-entry-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

describe('LogEntryForm', () => {
  it('renders all product type buttons', () => {
    render(<LogEntryForm onSubmit={vi.fn()} />);
    expect(screen.getByText('Cigarette')).toBeInTheDocument();
    expect(screen.getByText('Vape')).toBeInTheDocument();
    expect(screen.getByText('Pouch / Snus')).toBeInTheDocument();
    expect(screen.getByText('Heated Tobacco')).toBeInTheDocument();
  });

  it('renders amount controls defaulting to 1', () => {
    render(<LogEntryForm onSubmit={vi.fn()} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
  });

  it('increments and decrements amount', async () => {
    const user = userEvent.setup();
    render(<LogEntryForm onSubmit={vi.fn()} />);

    const buttons = screen.getAllByRole('button');
    const minusBtn = buttons.find((b) => b.querySelector('.lucide-minus'));
    const plusButton = buttons.find((b) => b.querySelector('.lucide-plus'));

    if (plusButton) {
      await user.click(plusButton);
      expect(screen.getByText('2')).toBeInTheDocument();
    }

    if (minusBtn) {
      await user.click(minusBtn);
      expect(screen.getByText('1')).toBeInTheDocument();
    }
  });

  it('calls onSubmit with correct data when Log Usage is clicked', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<LogEntryForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: /log usage/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const call = onSubmit.mock.calls[0][0];
    expect(call.productType).toBe('cigarette');
    expect(call.amount).toBe(1);
    expect(call.timestamp).toBeDefined();
  });

  it('clears notes after submission', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<LogEntryForm onSubmit={onSubmit} />);

    const notesInput = screen.getByPlaceholderText(/notes/i);
    await user.type(notesInput, 'Test note');
    expect(notesInput).toHaveValue('Test note');

    await user.click(screen.getByRole('button', { name: /log usage/i }));

    expect(notesInput).toHaveValue('');
  });
});
