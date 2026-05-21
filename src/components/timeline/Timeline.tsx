import { useState } from 'react';
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

// Height of the sticky app header
const STICKY_TOP = 96;

interface TimelineProps {
  onTapEvent: (idx: number) => void;
}

export function Timeline({ onTapEvent }: TimelineProps) {
  const currentDay  = useAgendaStore(s => s.currentDay);
  const assignRoute = useAgendaStore(s => s.assignRoute);
  const restoreAll  = useAgendaStore(s => s.restoreAll);
  const columns     = useRouteColumns(currentDay as Day);
  const nowData     = useNowIndicator(currentDay as Day);

  const [activeEvent, setActiveEvent] = useState<AppEvent | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 180, tolerance: 8 },
    })
  );

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

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-sm">
        Nenhum evento para exibir.
        <button
          className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-lg text-[13px] font-semibold"
          onClick={restoreAll}
        >
          ↺ Restaurar todos
        </button>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex pb-10 overflow-x-auto min-h-[calc(100vh-96px)]">
        <TimeAxis nowData={nowData} />
        <div className="flex gap-4 px-4 flex-1 items-start">
          {columns.map(col => (
            <RouteColumn
              key={col.route.key}
              data={col}
              onTap={onTapEvent}
              nowData={nowData}
              stickyTop={STICKY_TOP}
            />
          ))}
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
