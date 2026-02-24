'use client';

import { Card, CardContent } from '@/components/ui/card';
import type { LogEvent } from '@/lib/db';
import { Zap } from 'lucide-react';

interface StreakIndicatorProps {
  logs: LogEvent[];
}

function toLocalDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function StreakIndicator({ logs }: StreakIndicatorProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const logDates = new Set(logs.map((l) => toLocalDateStr(new Date(l.timestamp))));

  let streak = 0;
  const d = new Date(today);
  while (logDates.has(toLocalDateStr(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }

  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
          <Zap className="h-5 w-5 text-amber-500" />
        </div>
        <div>
          <p className="text-2xl font-bold tabular-nums">{streak}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {streak === 1 ? 'day' : 'days'} tracking streak
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
