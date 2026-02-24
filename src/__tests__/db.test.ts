import {
  addLogEvent,
  clearAllData,
  deleteLogEvent,
  getAllLogEvents,
  getLogEventsForDate,
  getRecentLogEvents,
} from '@/lib/db';
import { beforeEach, describe, expect, it } from 'vitest';

beforeEach(async () => {
  await clearAllData();
});

describe('db — logEvents CRUD', () => {
  it('adds a log event and retrieves it', async () => {
    const id = await addLogEvent({
      productType: 'cigarette',
      amount: 3,
      timestamp: '2026-02-24T10:00:00.000Z',
    });
    expect(id).toBeGreaterThan(0);

    const all = await getAllLogEvents();
    expect(all).toHaveLength(1);
    expect(all[0].productType).toBe('cigarette');
    expect(all[0].amount).toBe(3);
  });

  it('retrieves log events for a specific date', async () => {
    await addLogEvent({ productType: 'vape', amount: 5, timestamp: '2026-02-24T08:00:00.000Z' });
    await addLogEvent({ productType: 'vape', amount: 2, timestamp: '2026-02-25T08:00:00.000Z' });

    const logs = await getLogEventsForDate('2026-02-24');
    expect(logs).toHaveLength(1);
    expect(logs[0].amount).toBe(5);
  });

  it('retrieves recent log events in reverse chronological order', async () => {
    await addLogEvent({
      productType: 'cigarette',
      amount: 1,
      timestamp: '2026-02-23T08:00:00.000Z',
    });
    await addLogEvent({
      productType: 'cigarette',
      amount: 2,
      timestamp: '2026-02-24T08:00:00.000Z',
    });
    await addLogEvent({
      productType: 'cigarette',
      amount: 3,
      timestamp: '2026-02-25T08:00:00.000Z',
    });

    const recent = await getRecentLogEvents(2);
    expect(recent).toHaveLength(2);
    expect(recent[0].amount).toBe(3);
    expect(recent[1].amount).toBe(2);
  });

  it('deletes a log event by id', async () => {
    const id = await addLogEvent({
      productType: 'pouch',
      amount: 1,
      timestamp: '2026-02-24T12:00:00.000Z',
    });
    await deleteLogEvent(id);
    const all = await getAllLogEvents();
    expect(all).toHaveLength(0);
  });

  it('clears all data', async () => {
    await addLogEvent({
      productType: 'cigarette',
      amount: 1,
      timestamp: '2026-02-24T10:00:00.000Z',
    });
    await addLogEvent({ productType: 'vape', amount: 2, timestamp: '2026-02-24T11:00:00.000Z' });
    await clearAllData();

    const all = await getAllLogEvents();
    expect(all).toHaveLength(0);
  });
});
