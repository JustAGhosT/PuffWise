import { getAllLogEvents } from './db';
import { getProductById } from './products';

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function logsToCSV(
  logs: { productType: string; amount: number; timestamp: string; notes?: string }[]
): string {
  const BOM = '\uFEFF';
  const header = 'Date,Time,Product,Amount,Unit,Notes';
  const rows = logs.map((log) => {
    const dt = new Date(log.timestamp);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const date = `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
    const time = `${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
    const product = getProductById(log.productType);
    const name = product?.name ?? log.productType;
    const unit = product?.unit ?? '';
    const notes = escapeCSV(log.notes ?? '');
    return `${date},${time},${escapeCSV(name)},${log.amount},${escapeCSV(unit)},${notes}`;
  });
  return BOM + [header, ...rows].join('\n');
}

export async function exportLogsToCSV(): Promise<void> {
  const logs = await getAllLogEvents();
  const csv = logsToCSV(logs);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `puffwise-export-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
