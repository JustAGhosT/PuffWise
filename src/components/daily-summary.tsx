'use client';

import { Cigarette, CloudHail, Circle, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { LogEvent } from '@/lib/db';
import { DEFAULT_PRODUCTS } from '@/lib/products';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Cigarette,
  CloudHail,
  Circle,
  Flame,
};

interface DailySummaryProps {
  logs: LogEvent[];
  loading: boolean;
}

export function DailySummary({ logs, loading }: DailySummaryProps) {
  const totals = DEFAULT_PRODUCTS.map((product) => {
    const productLogs = logs.filter((l) => l.productType === product.id);
    const total = productLogs.reduce((sum, l) => sum + l.amount, 0);
    return { ...product, total };
  }).filter((p) => p.total > 0);

  const grandTotal = logs.reduce((sum, l) => sum + l.amount, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Today</CardTitle>
          <Badge variant="secondary">{grandTotal} total</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-zinc-500">Loading…</p>
        ) : totals.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No usage logged today. Tap below to log.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {totals.map((item) => {
              const Icon = ICON_MAP[item.icon] ?? Circle;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-2 rounded-lg bg-zinc-50 p-2.5 dark:bg-zinc-900"
                >
                  <Icon className={cn('h-5 w-5', item.color)} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {item.total} {item.unit}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
