import {
  addChallenge,
  addLogEvent,
  clearAllData,
  completeChallenge,
  deleteLogEvent,
  failChallenge,
  getActiveChallenges,
  getAllChallenges,
  getAllLogEvents,
  getChallengeById,
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

describe('db — challenges CRUD', () => {
  it('adds a challenge and retrieves it', async () => {
    const id = await addChallenge({
      type: 'target',
      status: 'active',
      productType: 'cigarette',
      dailyLimit: 5,
      startDate: '2026-02-24',
      targetDate: '2026-03-24',
      linkedLogIds: [],
    });
    expect(id).toBeGreaterThan(0);

    const challenge = await getChallengeById(id);
    expect(challenge).toBeDefined();
    expect(challenge!.type).toBe('target');
    expect(challenge!.dailyLimit).toBe(5);
  });

  it('retrieves only active challenges', async () => {
    await addChallenge({
      type: 'target',
      status: 'active',
      startDate: '2026-02-24',
      linkedLogIds: [],
    });
    await addChallenge({
      type: 'streak',
      status: 'completed',
      startDate: '2026-02-20',
      linkedLogIds: [],
    });

    const active = await getActiveChallenges();
    expect(active).toHaveLength(1);
    expect(active[0].type).toBe('target');
  });

  it('completes a challenge', async () => {
    const id = await addChallenge({
      type: 'target',
      status: 'active',
      startDate: '2026-02-24',
      linkedLogIds: [],
    });
    await completeChallenge(id);

    const challenge = await getChallengeById(id);
    expect(challenge!.status).toBe('completed');
  });

  it('fails a challenge', async () => {
    const id = await addChallenge({
      type: 'streak',
      status: 'active',
      startDate: '2026-02-24',
      linkedLogIds: [],
    });
    await failChallenge(id);

    const challenge = await getChallengeById(id);
    expect(challenge!.status).toBe('failed');
  });

  it('retrieves all challenges regardless of status', async () => {
    await addChallenge({
      type: 'target',
      status: 'active',
      startDate: '2026-02-24',
      linkedLogIds: [],
    });
    await addChallenge({
      type: 'streak',
      status: 'completed',
      startDate: '2026-02-20',
      linkedLogIds: [],
    });
    await addChallenge({
      type: 'target',
      status: 'failed',
      startDate: '2026-02-18',
      linkedLogIds: [],
    });

    const all = await getAllChallenges();
    expect(all).toHaveLength(3);
  });
});
