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
    const data = await getActiveChallenges();
    setChallenges(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    getActiveChallenges().then((data) => {
      if (!cancelled) {
        setChallenges(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

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
    const data = await getAllChallenges();
    setChallenges(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    getAllChallenges().then((data) => {
      if (!cancelled) {
        setChallenges(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { challenges, loading, refresh };
}
