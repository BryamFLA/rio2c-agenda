import { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import type { Day, RouteKey, AppEvent } from '../../domain/types';
import { EVENTS } from '../../data/events';
import { CARD_W } from '../../domain/constants';
import { useAgendaStore } from '../../store/useAgendaStore';
import { useRouteColumns } from '../../hooks/useRouteColumns';
import { useNowIndicator } from '../../hooks/useNowIndicator';
import { TimeAxis } from './TimeAxis';
import { RouteColumn } from './RouteColumn';
import { EventCard } from './EventCard';
import { DayTabs } from '../layout/DayTabs';
import { TrilhaLegend } from '../layout/TrilhaLegend';
import { LiveBadge } from '../layout/LiveBadge';

interface TimelineProps {
  onTapEvent: (idx: number) => void;
}

export function Timeline({ onTapEvent }: TimelineProps) {
  const currentDay  = useAgendaStore(s => s.currentDay);
  const assignRoute = useAgendaStore(s => s.assignRoute);
  const hidden      = useAgendaStore(s => s.hidden);
  const restoreAll  = useAgendaStore(s => s.restoreAll);
  const routes      = useAgendaStore(s => s.routes);
  const columns     = useRouteColumns(currentDay as Day);
  const nowData     = useNowIndicator(currentDay as Day);

  const [activeEvent, setActiveEvent] = useState<AppEvent | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 180, tolerance: 8 },
    })
  );

  const dayIdxSet = useMemo(
    () => new Set(EVENTS.filter(e => e.day === currentDay).map(e => e.idx)),
    [currentDay]
  );
  const dayTotal = useMemo(
    () => EVENTS.filter(e => dayIdxSet.has(e.idx) && !hidden.has(e.idx)).length,
    [dayIdxSet, hidden]
  );
  const inRoutes = useMemo(() => {
    const all = [...routes[1], ...routes[2], ...routes[3]];
    return all.filter(idx => dayIdxSet.has(idx)).length;
  }, [routes, dayIdxSet]);

  function handleDragStart({ active }: DragStartEvent) {
    const idx = parseInt(active.id as string, 10);
    setActiveEvent(EVENTS.find(e => e.idx === idx) ?? null);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveEvent(null);
    if (!over) return;
    const idx      = parseInt(active.id as string, 10);
    const routeKey = parseInt(over.id as string, 10) as RouteKey;
    assignRoute(idx, routeKey);
  }

  const isEmpty = columns.every(c => c.events.length === 0);

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-full overflow-hidden">

        {/* Top controls bar — not inside the scroll container */}
        <div className="flex-shrink-0 bg-white border-b border-[#E2E8F0] px-6 py-3">
          <div className="flex items-center justify-between mb-2.5">
            <DayTabs />
            <div className="flex items-center gap-3">
              {nowData && <LiveBadge timeLabel={nowData.timeLabel} />}
              <span className="text-[11px] text-[#78767b]">
                {inRoutes > 0
                  ? `${inRoutes} em rotas · ${dayTotal - inRoutes} livres`
                  : `${dayTotal} eventos`}
              </span>
              {hidden.size > 0 && (
                <button
                  onClick={restoreAll}
                  className="text-[11px] font-semibold text-[#47464b] border border-[#c8c5cb] rounded-full px-2.5 py-1 hover:bg-[#f5f5f5] transition-all"
                >
                  ↺ Restaurar
                </button>
              )}
            </div>
          </div>
          <TrilhaLegend />
        </div>

        {/* Scrollable grid */}
        <div className="flex-1 overflow-auto bg-[#f5f5f5]">
          {isEmpty ? (
            <div className="flex items-center justify-center py-16 text-[#78767b] text-[13px]">
              Nenhum evento para exibir.
            </div>
          ) : (
            <div className="flex pb-10">
              <TimeAxis nowData={nowData} />
              <div className="flex gap-4 px-4 flex-1 items-start">
                {columns.map(col => (
                  <RouteColumn
                    key={col.route.key}
                    data={col}
                    onTap={onTapEvent}
                    nowData={nowData}
                    stickyTop={0}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeEvent && (
          <div style={{ width: CARD_W - 3 }}>
            <EventCard
              event={activeEvent}
              lane={0}
              onTap={() => {}}
              isDragOverlay
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
