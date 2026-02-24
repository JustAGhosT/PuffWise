'use client';

import { DailySummary } from '@/components/daily-summary';
import { DailyTarget } from '@/components/daily-target';
import { LogEntryForm } from '@/components/log-entry-form';
import { Onboarding } from '@/components/onboarding';
import { RecentLogs } from '@/components/recent-logs';
import { StreakIndicator } from '@/components/streak-indicator';
import { useActiveChallenges } from '@/lib/hooks/use-challenges';
import { useRecentLogs, useTodayLogs } from '@/lib/hooks/use-logs';

export default function Home() {
  const { logs: todayLogs, loading: todayLoading, addLog } = useTodayLogs();
  const { logs: recentLogs, loading: recentLoading, refresh: refreshRecent } = useRecentLogs(10);
  const { challenges } = useActiveChallenges();

  const handleLog = async (entry: {
    productType: string;
    amount: number;
    timestamp: string;
    notes?: string;
  }) => {
    await addLog(entry);
    await refreshRecent();
  };

  return (
    <div className="space-y-6">
      <Onboarding />
      <div className="grid gap-4 sm:grid-cols-2">
        <DailySummary logs={todayLogs} loading={todayLoading} />
        <StreakIndicator logs={recentLogs} />
      </div>

      <DailyTarget challenges={challenges} todayLogs={todayLogs} />

      <div>
        <h2 className="mb-3 text-lg font-semibold">Log Usage</h2>
        <LogEntryForm onSubmit={handleLog} />
      </div>

      <RecentLogs logs={recentLogs} loading={recentLoading} />
    </div>
  );
}
