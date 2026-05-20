import { useMemo } from 'react';
import type { Day, RouteColumnData } from '../domain/types';
import { EVENTS } from '../data/events';
import { ROUTE_COLS } from '../data/routes';
import { assignLanes } from '../domain/eventUtils';
import { useAgendaStore } from '../store/useAgendaStore';

export function useRouteColumns(day: Day): RouteColumnData[] {
  const hidden  = useAgendaStore(s => s.hidden);
  const routes1 = useAgendaStore(s => s.routes[1]);
  const routes2 = useAgendaStore(s => s.routes[2]);
  const routes3 = useAgendaStore(s => s.routes[3]);

  return useMemo(() => {
    const dayEvents = EVENTS.filter(e => e.day === day && !hidden.has(e.idx));

    return ROUTE_COLS.map(route => {
      const events =
        route.key === 0
          ? dayEvents.filter(
              e => !routes1.has(e.idx) && !routes2.has(e.idx) && !routes3.has(e.idx)
            )
          : dayEvents.filter(e => {
              const set = route.key === 1 ? routes1 : route.key === 2 ? routes2 : routes3;
              return set.has(e.idx);
            });

      const { map: laneMap, n: numLanes } = assignLanes(events);
      return { route, events, laneMap, numLanes };
    });
  }, [day, hidden, routes1, routes2, routes3]);
}
