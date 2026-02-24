import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const mockGetActiveChallenges = vi.fn();
const mockGetAllChallenges = vi.fn();
const mockAddChallenge = vi.fn();
const mockCompleteChallenge = vi.fn();
const mockFailChallenge = vi.fn();

vi.mock('@/lib/db', () => ({
  getActiveChallenges: () => mockGetActiveChallenges(),
  getAllChallenges: () => mockGetAllChallenges(),
  addChallenge: (...args: unknown[]) => mockAddChallenge(...args),
  completeChallenge: (...args: unknown[]) => mockCompleteChallenge(...args),
  failChallenge: (...args: unknown[]) => mockFailChallenge(...args),
}));

const { useActiveChallenges, useAllChallenges } = await import(
  '@/lib/hooks/use-challenges'
);

const activeChallenge = {
  id: 1,
  type: 'target' as const,
  status: 'active' as const,
  productType: 'cigarette',
  dailyLimit: 10,
  startDate: '2026-01-01',
  linkedLogIds: [],
};

describe('useActiveChallenges', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetActiveChallenges.mockResolvedValue([activeChallenge]);
  });

  it('loads active challenges on mount', async () => {
    const { result } = renderHook(() => useActiveChallenges());
    expect(result.current.loading).toBe(true);
    await act(async () => {});
    expect(result.current.loading).toBe(false);
    expect(result.current.challenges).toEqual([activeChallenge]);
  });

  it('refresh reloads challenges', async () => {
    const { result } = renderHook(() => useActiveChallenges());
    await act(async () => {});

    mockGetActiveChallenges.mockResolvedValue([]);
    await act(async () => {
      await result.current.refresh();
    });
    expect(result.current.challenges).toEqual([]);
  });

  it('refresh resets loading state on error', async () => {
    const { result } = renderHook(() => useActiveChallenges());
    await act(async () => {});

    mockGetActiveChallenges.mockRejectedValue(new Error('db error'));
    await act(async () => {
      await result.current.refresh().catch(() => {});
    });
    expect(result.current.loading).toBe(false);
  });

  it('create adds a challenge and refreshes', async () => {
    mockAddChallenge.mockResolvedValue(undefined);
    const { result } = renderHook(() => useActiveChallenges());
    await act(async () => {});

    const newChallenge = { ...activeChallenge, id: undefined };
    await act(async () => {
      await result.current.create(newChallenge);
    });
    expect(mockAddChallenge).toHaveBeenCalledWith(newChallenge);
    expect(mockGetActiveChallenges).toHaveBeenCalledTimes(2);
  });

  it('complete marks challenge complete and refreshes', async () => {
    mockCompleteChallenge.mockResolvedValue(undefined);
    const { result } = renderHook(() => useActiveChallenges());
    await act(async () => {});

    await act(async () => {
      await result.current.complete(1);
    });
    expect(mockCompleteChallenge).toHaveBeenCalledWith(1);
    expect(mockGetActiveChallenges).toHaveBeenCalledTimes(2);
  });

  it('fail marks challenge failed and refreshes', async () => {
    mockFailChallenge.mockResolvedValue(undefined);
    const { result } = renderHook(() => useActiveChallenges());
    await act(async () => {});

    await act(async () => {
      await result.current.fail(1);
    });
    expect(mockFailChallenge).toHaveBeenCalledWith(1);
    expect(mockGetActiveChallenges).toHaveBeenCalledTimes(2);
  });
});

describe('useAllChallenges', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAllChallenges.mockResolvedValue([activeChallenge]);
  });

  it('loads all challenges on mount', async () => {
    const { result } = renderHook(() => useAllChallenges());
    expect(result.current.loading).toBe(true);
    await act(async () => {});
    expect(result.current.loading).toBe(false);
    expect(result.current.challenges).toEqual([activeChallenge]);
  });

  it('refresh reloads challenges', async () => {
    const { result } = renderHook(() => useAllChallenges());
    await act(async () => {});

    mockGetAllChallenges.mockResolvedValue([]);
    await act(async () => {
      await result.current.refresh();
    });
    expect(result.current.challenges).toEqual([]);
  });

  it('refresh resets loading state on error', async () => {
    const { result } = renderHook(() => useAllChallenges());
    await act(async () => {});

    mockGetAllChallenges.mockRejectedValue(new Error('db error'));
    await act(async () => {
      await result.current.refresh().catch(() => {});
    });
    expect(result.current.loading).toBe(false);
  });
});
