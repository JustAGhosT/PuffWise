'use client';

import {
  type LogEvent,
  addLogEvent,
  deleteLogEvent,
  getAllLogEvents,
  getLogEventsForDate,
  getRecentLogEvents,
} from '@/lib/db';
import { useCallback, useEffect, useRef, useState } from 'react';

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useTodayLogs() {
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    getLogEventsForDate(todayString()).then((data) => {
      if (!cancelled) {
        setLogs(data);
        setLoading(false);
      }
    });
    mountedRef.current = true;
    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = useCallback(async () => {
    const data = await getLogEventsForDate(todayString());
    setLogs(data);
  }, []);

  const addLog = useCallback(
    async (event: Omit<LogEvent, 'id'>) => {
      await addLogEvent(event);
      await refresh();
    },
    [refresh]
  );

  return { logs, loading, refresh, addLog };
}

export function useRecentLogs(limit: number = 7) {
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getRecentLogEvents(limit).then((data) => {
      if (!cancelled) {
        setLogs(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [limit]);

  const refresh = useCallback(async () => {
    const data = await getRecentLogEvents(limit);
    setLogs(data);
  }, [limit]);

  return { logs, loading, refresh };
}

export function useAllLogs() {
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getAllLogEvents().then((data) => {
      if (!cancelled) {
        setLogs(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = useCallback(async () => {
    const data = await getAllLogEvents();
    setLogs(data);
  }, []);

  const removeLog = useCallback(
    async (id: number) => {
      await deleteLogEvent(id);
      await refresh();
    },
    [refresh]
  );

  return { logs, loading, refresh, removeLog };
}
