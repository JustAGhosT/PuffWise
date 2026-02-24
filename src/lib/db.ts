import Dexie, { type Table } from 'dexie';

export interface LogEvent {
  id?: number;
  productType: string;
  amount: number;
  timestamp: string;
  notes?: string;
}

export interface Product {
  id: string;
  name: string;
  type: string;
  icon: string;
  color: string;
  unit: string;
}

export interface Challenge {
  id?: number;
  type: 'streak' | 'target';
  status: 'active' | 'completed' | 'failed';
  productType?: string;
  dailyLimit?: number;
  startDate: string;
  targetDate?: string;
  linkedLogIds?: number[];
}

class PuffWiseDB extends Dexie {
  logEvents!: Table<LogEvent, number>;
  products!: Table<Product, string>;
  challenges!: Table<Challenge, number>;

  constructor() {
    super('puffwise');
    this.version(1).stores({
      logEvents: '++id, productType, timestamp',
      products: 'id, type',
      challenges: '++id, type, status',
    });
  }
}

export const db = new PuffWiseDB();

export async function addLogEvent(event: Omit<LogEvent, 'id'>): Promise<number> {
  return db.logEvents.add(event) as Promise<number>;
}

export async function getLogEventsForDate(date: string): Promise<LogEvent[]> {
  const start = `${date}T00:00:00.000`;
  const end = `${date}T23:59:59.999`;
  return db.logEvents.where('timestamp').between(start, end, true, true).toArray();
}

export async function getLogEventsForRange(
  startDate: string,
  endDate: string
): Promise<LogEvent[]> {
  const start = `${startDate}T00:00:00.000`;
  const end = `${endDate}T23:59:59.999`;
  return db.logEvents.where('timestamp').between(start, end, true, true).toArray();
}

export async function getRecentLogEvents(limit: number = 7): Promise<LogEvent[]> {
  return db.logEvents.orderBy('timestamp').reverse().limit(limit).toArray();
}

export async function deleteLogEvent(id: number): Promise<void> {
  return db.logEvents.delete(id);
}

export async function getAllLogEvents(): Promise<LogEvent[]> {
  return db.logEvents.orderBy('timestamp').reverse().toArray();
}

export async function addChallenge(challenge: Omit<Challenge, 'id'>): Promise<number> {
  return db.challenges.add(challenge) as Promise<number>;
}

export async function getActiveChallenges(): Promise<Challenge[]> {
  return db.challenges.where('status').equals('active').toArray();
}

export async function getChallengeById(id: number): Promise<Challenge | undefined> {
  return db.challenges.get(id);
}

export async function completeChallenge(id: number): Promise<void> {
  const updated = await db.challenges.update(id, { status: 'completed' });
  if (updated === 0) throw new Error(`Challenge ${id} not found`);
}

export async function failChallenge(id: number): Promise<void> {
  const updated = await db.challenges.update(id, { status: 'failed' });
  if (updated === 0) throw new Error(`Challenge ${id} not found`);
}

export async function getAllChallenges(): Promise<Challenge[]> {
  return db.challenges.toArray();
}

export async function clearAllData(): Promise<void> {
  await db.logEvents.clear();
  await db.products.clear();
  await db.challenges.clear();
}
