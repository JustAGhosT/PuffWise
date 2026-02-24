'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Challenge, LogEvent } from '@/lib/db';
import { getProductById } from '@/lib/products';
import { cn } from '@/lib/utils';
import { Target } from 'lucide-react';

interface DailyTargetProps {
  challenges: Challenge[];
  todayLogs: LogEvent[];
}

export function DailyTarget({ challenges, todayLogs }: DailyTargetProps) {
  const targetChallenges = challenges.filter(
    (c) => c.type === 'target' && c.dailyLimit != null && c.productType
  );

  if (targetChallenges.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="h-4 w-4" />
          Daily Targets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {targetChallenges.map((challenge) => {
          const product = getProductById(challenge.productType!);
          const todayCount = todayLogs
            .filter((l) => l.productType === challenge.productType)
            .reduce((sum, l) => sum + l.amount, 0);
          const limit = challenge.dailyLimit!;
          const percentage =
            limit > 0 ? Math.min((todayCount / limit) * 100, 100) : todayCount > 0 ? 100 : 0;
          const over = todayCount > limit;

          return (
            <div key={challenge.id} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className={cn('font-medium', product?.color)}>
                  {product?.name ?? challenge.productType}
                </span>
                <span className={cn('tabular-nums', over && 'text-red-500 font-semibold')}>
                  {todayCount} / {limit} {product?.unit ?? ''}
                </span>
              </div>
              <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    over ? 'bg-red-500' : percentage > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
