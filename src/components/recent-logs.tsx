'use client';

import { Cigarette, CloudHail, Circle, Flame, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LogEvent } from '@/lib/db';
import { getProductById } from '@/lib/products';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Cigarette,
  CloudHail,
  Circle,
  Flame,
};

function formatTime(timestamp: string): string {
  const d = new Date(timestamp);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

interface RecentLogsProps {
  logs: LogEvent[];
  loading: boolean;
}

export function RecentLogs({ logs, loading }: RecentLogsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-zinc-500" />
          <CardTitle>Recent</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-zinc-500">Loading…</p>
        ) : logs.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No log entries yet.</p>
        ) : (
          <ul className="space-y-2">
            {logs.map((log) => {
              const product = getProductById(log.productType);
              const Icon = product ? (ICON_MAP[product.icon] ?? Circle) : Circle;
              const color = product?.color ?? 'text-zinc-500';
              return (
                <li
                  key={log.id}
                  className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-900"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn('h-4 w-4', color)} />
                    <div>
                      <p className="text-sm font-medium">
                        {log.amount} {product?.unit ?? 'units'}
                      </p>
                      {log.notes && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{log.notes}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    {formatTime(log.timestamp)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
