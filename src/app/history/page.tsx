'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAllLogs } from '@/lib/hooks/use-logs';
import { DEFAULT_PRODUCTS, getProductById } from '@/lib/products';
import { cn } from '@/lib/utils';
import { Cigarette, Circle, CloudHail, Flame, Trash2 } from 'lucide-react';
import { useState } from 'react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Cigarette,
  CloudHail,
  Circle,
  Flame,
};

function toLocalDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function HistoryPage() {
  const { logs, loading, removeLog } = useAllLogs();
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = filter ? logs.filter((l) => l.productType === filter) : logs;

  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, log) => {
    const date = toLocalDateStr(new Date(log.timestamp));
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">History</h1>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter(null)}
        >
          All
        </Button>
        {DEFAULT_PRODUCTS.map((p) => (
          <Button
            key={p.id}
            variant={filter === p.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(p.id)}
          >
            {p.name}
          </Button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-zinc-500">Loading…</p>
      ) : sortedDates.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-sm text-zinc-500">
            No log entries yet. Start logging from the dashboard.
          </CardContent>
        </Card>
      ) : (
        sortedDates.map((date) => {
          const dayLogs = grouped[date];
          const dayTotal = dayLogs.reduce((s, l) => s + l.amount, 0);
          return (
            <Card key={date}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{formatDate(date)}</CardTitle>
                  <Badge variant="secondary">{dayTotal} total</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {dayLogs.map((log) => {
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
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                {log.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-400">{formatTime(log.timestamp)}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-zinc-400 hover:text-red-500"
                            onClick={() => log.id != null && removeLog(log.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
