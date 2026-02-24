'use client';

import { useState } from 'react';
import { Plus, Trophy, Target, X, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useActiveChallenges, useAllChallenges } from '@/lib/hooks/use-challenges';
import { DEFAULT_PRODUCTS } from '@/lib/products';
import { cn } from '@/lib/utils';

type ChallengeType = 'target' | 'streak';

export default function ChallengesPage() {
  const { challenges: active, create, complete, fail } = useActiveChallenges();
  const { challenges: all, refresh: refreshAll } = useAllChallenges();
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<ChallengeType>('target');
  const [formProduct, setFormProduct] = useState(DEFAULT_PRODUCTS[0].id);
  const [formLimit, setFormLimit] = useState('10');
  const [formDays, setFormDays] = useState('30');

  const handleCreate = async () => {
    const startDate = new Date();
    const y = startDate.getFullYear();
    const m = String(startDate.getMonth() + 1).padStart(2, '0');
    const d = String(startDate.getDate()).padStart(2, '0');
    const startStr = `${y}-${m}-${d}`;

    const targetDate = new Date(startDate);
    targetDate.setDate(targetDate.getDate() + Number(formDays));
    const ty = targetDate.getFullYear();
    const tm = String(targetDate.getMonth() + 1).padStart(2, '0');
    const td = String(targetDate.getDate()).padStart(2, '0');
    const targetStr = `${ty}-${tm}-${td}`;

    await create({
      type: formType,
      status: 'active',
      productType: formProduct,
      dailyLimit: formType === 'target' ? Number(formLimit) : undefined,
      startDate: startStr,
      targetDate: targetStr,
      linkedLogIds: [],
    });
    await refreshAll();
    setShowForm(false);
  };

  const handleComplete = async (id: number) => {
    await complete(id);
    await refreshAll();
  };

  const handleFail = async (id: number) => {
    await fail(id);
    await refreshAll();
  };

  const completedCount = all.filter((c) => c.status === 'completed').length;
  const failedCount = all.filter((c) => c.status === 'failed').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Challenges</h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-1 h-4 w-4" />
          New Challenge
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Create Challenge</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={formType === 'target' ? 'default' : 'outline'}
                onClick={() => setFormType('target')}
              >
                <Target className="mr-1 h-3 w-3" />
                Daily Target
              </Button>
              <Button
                size="sm"
                variant={formType === 'streak' ? 'default' : 'outline'}
                onClick={() => setFormType('streak')}
              >
                <Trophy className="mr-1 h-3 w-3" />
                Streak
              </Button>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Product</label>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_PRODUCTS.map((p) => (
                  <Button
                    key={p.id}
                    size="sm"
                    variant={formProduct === p.id ? 'default' : 'outline'}
                    onClick={() => setFormProduct(p.id)}
                  >
                    {p.name}
                  </Button>
                ))}
              </div>
            </div>

            {formType === 'target' && (
              <div>
                <label className="mb-1 block text-sm font-medium">Daily Limit</label>
                <Input
                  type="number"
                  min="1"
                  value={formLimit}
                  onChange={(e) => setFormLimit(e.target.value)}
                  className="w-32"
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium">Duration (days)</label>
              <Input
                type="number"
                min="1"
                value={formDays}
                onChange={(e) => setFormDays(e.target.value)}
                className="w-32"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreate}>Start Challenge</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-2 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">{active.length}</p>
            <p className="text-sm text-zinc-500">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-emerald-500">{completedCount}</p>
            <p className="text-sm text-zinc-500">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-red-500">{failedCount}</p>
            <p className="text-sm text-zinc-500">Failed</p>
          </CardContent>
        </Card>
      </div>

      {active.length === 0 && !showForm && (
        <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
          <Trophy className="mx-auto mb-3 h-8 w-8 text-zinc-400" />
          <p className="text-sm text-zinc-500">No active challenges. Start one to track your progress!</p>
        </div>
      )}

      {active.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Active Challenges</h2>
          {active.map((c) => {
            const product = DEFAULT_PRODUCTS.find((p) => p.id === c.productType);
            return (
              <Card key={c.id}>
                <CardContent className="flex items-center justify-between pt-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant={c.type === 'target' ? 'default' : 'secondary'}>
                        {c.type === 'target' ? 'Target' : 'Streak'}
                      </Badge>
                      <span className={cn('font-medium', product?.color)}>
                        {product?.name ?? c.productType}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-500">
                      {c.type === 'target' && c.dailyLimit != null
                        ? `≤ ${c.dailyLimit} ${product?.unit ?? ''}/day`
                        : 'Keep the streak going'}
                      {c.targetDate && ` · until ${c.targetDate}`}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-emerald-600"
                      onClick={() => handleComplete(c.id!)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500"
                      onClick={() => handleFail(c.id!)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {all.filter((c) => c.status !== 'active').length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Past Challenges</h2>
          {all
            .filter((c) => c.status !== 'active')
            .map((c) => {
              const product = DEFAULT_PRODUCTS.find((p) => p.id === c.productType);
              return (
                <Card key={c.id} className="opacity-60">
                  <CardContent className="flex items-center justify-between pt-6">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={c.status === 'completed' ? 'default' : 'destructive'}
                      >
                        {c.status === 'completed' ? 'Completed' : 'Failed'}
                      </Badge>
                      <span className={cn('font-medium', product?.color)}>
                        {product?.name ?? c.productType}
                      </span>
                    </div>
                    <span className="text-sm text-zinc-500">
                      {c.startDate} → {c.targetDate ?? '—'}
                    </span>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
}
