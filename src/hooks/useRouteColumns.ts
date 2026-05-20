import { useMemo } from 'react';
import type { Day, RouteColumnData } from '../domain/types';
import { EVENTS } from '../data/events';
import { ROUTE_COLS } from '../data/routes';
import { assignLanes } from '../domain/eventUtils';
import { useAgendaStore } from '../store/useAgendaStore';

export function useRouteColumns(day: Day): RouteColumnData[] {
  const { hidden, routes } = useAgendaStore();

  return useMemo(() => {
    const dayEvents = EVENTS.filter(e => e.day === day && !hidden.has(e.idx));

    return ROUTE_COLS.map(route => {
      const events =
        route.key === 0
          ? dayEvents.filter(
              e => !routes[1].has(e.idx) && !routes[2].has(e.idx) && !routes[3].has(e.idx)
            )
          : dayEvents.filter(e => routes[route.key as 1 | 2 | 3].has(e.idx));

      const { map: laneMap, n: numLanes } = assignLanes(events);
      return { route, events, laneMap, numLanes };
    });
  }, [day, hidden, routes]);
}
