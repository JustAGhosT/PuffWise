'use client';

import { useState } from 'react';
import { Cigarette, CloudHail, Circle, Flame, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DEFAULT_PRODUCTS } from '@/lib/products';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Cigarette,
  CloudHail,
  Circle,
  Flame,
};

interface LogEntryFormProps {
  onSubmit: (entry: { productType: string; amount: number; timestamp: string; notes?: string }) => Promise<void>;
}

export function LogEntryForm({ onSubmit }: LogEntryFormProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>(DEFAULT_PRODUCTS[0].id);
  const [amount, setAmount] = useState(1);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (amount <= 0) return;
    setSubmitting(true);
    try {
      await onSubmit({
        productType: selectedProduct,
        amount,
        timestamp: new Date().toISOString(),
        notes: notes.trim() || undefined,
      });
      setAmount(1);
      setNotes('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {DEFAULT_PRODUCTS.map((product) => {
          const Icon = ICON_MAP[product.icon] ?? Circle;
          const isSelected = selectedProduct === product.id;
          return (
            <button
              key={product.id}
              onClick={() => setSelectedProduct(product.id)}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-sm font-medium transition-all',
                isSelected
                  ? 'border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-900'
                  : 'border-transparent bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800'
              )}
            >
              <Icon className={cn('h-6 w-6', product.color)} />
              <span className="text-xs">{product.name}</span>
            </button>
          );
        })}
      </div>

      <Card>
        <CardContent className="flex items-center justify-between gap-4 p-4">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Amount</span>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setAmount((a) => Math.max(1, a - 1))}
              disabled={amount <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center text-lg font-semibold tabular-nums">{amount}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setAmount((a) => a + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Input
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
        {submitting ? 'Logging…' : 'Log Usage'}
      </Button>
    </div>
  );
}
