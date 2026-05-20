import type { AppEvent, LaneAssignment } from './types';

/** Converte "HH:MM" para total de minutos */
export function toMin(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

/** Deriva o tipo de apresentação a partir do título */
export function getType(title: string): string {
  if (/S\.O\.S\. Habilidades/i.test(title))      return 'Workshop';
  if (/masterclass/i.test(title))                 return 'Masterclass';
  if (/^mentoria/i.test(title))                   return 'Mentoria';
  if (/art talks for lunch/i.test(title))         return 'Art Talk';
  if (/laboratório dos sentidos/i.test(title))    return 'Lab';
  if (/Prêmio|Premio/i.test(title))               return 'Premiação';
  if (/sessão patrocinada|\*sessão/i.test(title)) return 'Patrocinada';
  if (/meetup/i.test(title))                      return 'Meetup';
  if (/pitching/i.test(title))                    return 'Pitching';
  if (/abertura/i.test(title))                    return 'Abertura';
  if (/conversas no aquário/i.test(title))        return 'Mesa Redonda';
  return 'Palestra';
}

/**
 * Distribui eventos em lanes (sub-colunas) para evitar sobreposição.
 * Retorna { map: { [idx]: laneIndex }, n: totalLanes }
 */
export function assignLanes(events: AppEvent[]): LaneAssignment {
  const sorted = [...events].sort((a, b) => a.startMin - b.startMin);
  const lanes: Array<{ endMin: number }> = [];
  const map: Record<number, number> = {};

  sorted.forEach(e => {
    let placed = false;
    for (let i = 0; i < lanes.length; i++) {
      if (e.startMin >= lanes[i].endMin) {
        map[e.idx] = i;
        lanes[i] = { endMin: e.endMin };
        placed = true;
        break;
      }
    }
    if (!placed) {
      map[e.idx] = lanes.length;
      lanes.push({ endMin: e.endMin });
    }
  });

  return { map, n: lanes.length };
}

/** Sanitiza o título removendo marcadores de sessão patrocinada */
export function cleanTitle(title: string): string {
  return title.replace(/\*[^*]*/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Agrupa eventos por horário de início — usado no layout mobile.
 * Retorna TimeGroup[] ordenado cronologicamente.
 */
export function groupEventsByTime(events: AppEvent[]): import('./types').TimeGroup[] {
  const map = new Map<string, AppEvent[]>();
  const sorted = [...events].sort((a, b) => a.startMin - b.startMin);
  sorted.forEach(e => {
    const list = map.get(e.start) ?? [];
    list.push(e);
    map.set(e.start, list);
  });
  return Array.from(map.entries()).map(([time, evs]) => ({ time, events: evs }));
}
