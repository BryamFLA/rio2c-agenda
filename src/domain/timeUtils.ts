import type { NowSP } from './types';

/** Retorna data/hora atual no fuso de São Paulo */
export function getNowSP(): NowSP {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year:   'numeric',
    month:  '2-digit',
    day:    '2-digit',
    hour:   '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());

  const get = (type: string) =>
    parseInt(parts.find(p => p.type === type)!.value, 10);

  const hour   = get('hour');
  const minute = get('minute');

  return {
    year:     get('year'),
    month:    get('month'),
    day:      get('day'),
    hour,
    minute,
    totalMin: hour * 60 + minute,
  };
}

/** Verifica se a data SP corresponde a um dos dias do evento RIO2C 2026 */
export function isEventDay(sp: NowSP): boolean {
  return sp.year === 2026 && sp.month === 5 && [26, 27, 28].includes(sp.day);
}

/** Formata número como string com 2 dígitos (ex: 9 → "09") */
export function fmt2(n: number): string {
  return String(n).padStart(2, '0');
}
