'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { clearAllData, db, getAllLogEvents } from '@/lib/db';
import { exportLogsToCSV } from '@/lib/export';
import { Download, Info, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);

  const handleExport = async () => {
    const logs = await getAllLogEvents();
    const data = JSON.stringify(
      { version: 1, exportedAt: new Date().toISOString(), logs },
      null,
      2
    );
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `puffwise-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      setImporting(true);
      setImportResult(null);
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (!data.logs || !Array.isArray(data.logs)) {
          setImportResult('Invalid file format: missing logs array.');
          return;
        }
        let count = 0;
        for (const log of data.logs) {
          if (log.productType && log.amount != null && log.timestamp) {
            await db.logEvents.add({
              productType: log.productType,
              amount: log.amount,
              timestamp: log.timestamp,
              notes: log.notes,
            });
            count++;
          }
        }
        setImportResult(`Imported ${count} log entries.`);
      } catch {
        setImportResult('Failed to import: invalid JSON file.');
      } finally {
        setImporting(false);
      }
    };
    input.click();
  };

  const handleClear = async () => {
    await clearAllData();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Download className="h-4 w-4" />
            Export Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
            Download all your usage data as a JSON or CSV file. Data never leaves your device unless
            you choose to export it.
          </p>
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline">
              Export JSON
            </Button>
            <Button
              onClick={async () => {
                try {
                  await exportLogsToCSV();
                } catch (err) {
                  console.error('CSV export failed', err);
                }
              }}
              variant="outline"
            >
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Upload className="h-4 w-4" />
            Import Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
            Import log entries from a previously exported PuffWise JSON file.
          </p>
          <Button onClick={handleImport} variant="outline" disabled={importing}>
            {importing ? 'Importing…' : 'Import JSON'}
          </Button>
          {importResult && (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{importResult}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-red-600 dark:text-red-400">
            <Trash2 className="h-4 w-4" />
            Clear All Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
            Permanently delete all log entries, products, and challenges. This cannot be undone.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Clear All Data</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This will permanently delete all your PuffWise data. Export your data first if you
                  want to keep a backup.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="destructive" onClick={handleClear}>
                    Delete Everything
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-zinc-500 dark:text-zinc-400">
          <p>
            <strong className="text-zinc-700 dark:text-zinc-300">PuffWise</strong> v0.1.0
          </p>
          <p>Privacy-first nicotine usage tracking. All data stays on your device.</p>
          <p>No cloud. No accounts. No tracking.</p>
        </CardContent>
      </Card>
    </div>
  );
}
