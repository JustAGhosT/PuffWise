'use client';

import {
  type Challenge,
  addChallenge,
  completeChallenge,
  failChallenge,
  getActiveChallenges,
  getAllChallenges,
} from '@/lib/db';
import { useCallback, useEffect, useState } from 'react';

export function useActiveChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getActiveChallenges();
      setChallenges(data);
    } catch (err) {
      console.error('Failed to load active challenges', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    refresh().then(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const create = useCallback(
    async (challenge: Omit<Challenge, 'id'>) => {
      await addChallenge(challenge);
      await refresh();
    },
    [refresh]
  );

  const complete = useCallback(
    async (id: number) => {
      await completeChallenge(id);
      await refresh();
    },
    [refresh]
  );

  const fail = useCallback(
    async (id: number) => {
      await failChallenge(id);
      await refresh();
    },
    [refresh]
  );

  return { challenges, loading, refresh, create, complete, fail };
}

export function useAllChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllChallenges();
      setChallenges(data);
    } catch (err) {
      console.error('Failed to load all challenges', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    refresh().then(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  return { challenges, loading, refresh };
}
