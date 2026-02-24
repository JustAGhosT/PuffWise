'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DEFAULT_PRODUCTS } from '@/lib/products';
import { cn } from '@/lib/utils';
import { ArrowRight, Flame } from 'lucide-react';
import { useState, useSyncExternalStore } from 'react';

const ONBOARDING_KEY = 'puffwise-onboarded';
const ONBOARDING_SELECTIONS_KEY = 'puffwise-onboarding-selections';

function subscribeToStorage(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getOnboardedSnapshot(): boolean {
  return localStorage.getItem(ONBOARDING_KEY) !== null;
}

function getOnboardedServerSnapshot(): boolean {
  return true;
}

export function Onboarding() {
  const isOnboarded = useSyncExternalStore(
    subscribeToStorage,
    getOnboardedSnapshot,
    getOnboardedServerSnapshot
  );
  const [dismissed, setDismissed] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const dismiss = () => {
    if (selected.size > 0) {
      localStorage.setItem(ONBOARDING_SELECTIONS_KEY, JSON.stringify([...selected]));
    }
    localStorage.setItem(ONBOARDING_KEY, '1');
    setDismissed(true);
  };

  if (isOnboarded || dismissed) return null;

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
            <Flame className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-xl">Welcome to PuffWise</CardTitle>
          <p className="text-sm text-zinc-500">Track. Reduce. Challenge Yourself.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">What do you use?</p>
            <div className="grid grid-cols-2 gap-2">
              {DEFAULT_PRODUCTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => toggle(p.id)}
                  className={cn(
                    'rounded-lg border p-3 text-left text-sm transition-colors',
                    selected.has(p.id)
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950'
                      : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-700'
                  )}
                >
                  <span className={cn('font-medium', p.color)}>{p.name}</span>
                  <span className="block text-xs text-zinc-500">{p.unit}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1" onClick={dismiss}>
              Get Started
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button variant="ghost" onClick={dismiss}>
              Skip
            </Button>
          </div>

          <p className="text-center text-xs text-zinc-400">
            All data stays on your device. No account needed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
