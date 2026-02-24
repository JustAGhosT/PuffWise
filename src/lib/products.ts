import type { Product } from './db';

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'cigarette',
    name: 'Cigarette',
    type: 'combustible',
    icon: 'Cigarette',
    color: 'text-orange-500',
    unit: 'cigarettes',
  },
  {
    id: 'vape',
    name: 'Vape',
    type: 'electronic',
    icon: 'CloudHail',
    color: 'text-blue-500',
    unit: 'puffs',
  },
  {
    id: 'pouch',
    name: 'Pouch / Snus',
    type: 'oral',
    icon: 'Circle',
    color: 'text-green-500',
    unit: 'pouches',
  },
  {
    id: 'heated',
    name: 'Heated Tobacco',
    type: 'heated',
    icon: 'Flame',
    color: 'text-amber-500',
    unit: 'sticks',
  },
];

export function getProductById(id: string): Product | undefined {
  return DEFAULT_PRODUCTS.find((p) => p.id === id);
}
