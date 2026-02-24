import { describe, expect, it } from 'vitest';
import { logsToCSV } from '@/lib/export';

describe('logsToCSV', () => {
  it('produces a header row with BOM prefix', () => {
    const csv = logsToCSV([]);
    expect(csv.startsWith('\uFEFF')).toBe(true);
    expect(csv).toContain('Date,Time,Product,Amount,Unit,Notes');
  });

  it('formats log entries as CSV rows', () => {
    const csv = logsToCSV([
      { productType: 'cigarette', amount: 3, timestamp: '2026-02-24T10:30:00' },
      { productType: 'vape', amount: 15, timestamp: '2026-02-24T11:00:00', notes: 'after lunch' },
    ]);
    const lines = csv.split('\n');
    expect(lines).toHaveLength(3);
    expect(lines[1]).toContain('Cigarette');
    expect(lines[1]).toContain('3');
    expect(lines[2]).toContain('Vape');
    expect(lines[2]).toContain('after lunch');
  });

  it('escapes commas and quotes in notes', () => {
    const csv = logsToCSV([
      { productType: 'pouch', amount: 1, timestamp: '2026-02-24T09:00:00', notes: 'said "hello, world"' },
    ]);
    expect(csv).toContain('"said ""hello, world"""');
  });

  it('prevents CSV/formula injection by prefixing dangerous values with a single quote', () => {
    const dangerous = ['=SUM(A1)', '+cmd', '-cmd', '@SUM', '=1+2'];
    for (const note of dangerous) {
      const csv = logsToCSV([
        { productType: 'cigarette', amount: 1, timestamp: '2026-02-24T09:00:00', notes: note },
      ]);
      // The injected value should not appear raw; it should be single-quote-prefixed
      expect(csv).not.toContain(`,${note}`);
      expect(csv).toContain("'" + note);
    }
  });

  it('handles unknown product types gracefully', () => {
    const csv = logsToCSV([
      { productType: 'unknown-thing', amount: 1, timestamp: '2026-02-24T08:00:00' },
    ]);
    expect(csv).toContain('unknown-thing');
  });
});
