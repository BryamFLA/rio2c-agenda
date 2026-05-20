import type { RouteCol } from '../domain/types';

export const ROUTE_COLS: RouteCol[] = [
  { key: 1, label: 'Rota 1',      color: '#2563EB' },
  { key: 2, label: 'Rota 2',      color: '#EA580C' },
  { key: 3, label: 'Rota 3',      color: '#059669' },
  { key: 0, label: 'Disponíveis', color: '#6b7280' },
];

export const ROUTE_COLORS: Record<number, string> = {
  0: '#6b7280',
  1: '#2563EB',
  2: '#EA580C',
  3: '#059669',
};

export const ROUTE_LABELS: Record<number, string> = {
  0: 'Livre',
  1: 'Rota 1',
  2: 'Rota 2',
  3: 'Rota 3',
};
