import { useDroppable } from '@dnd-kit/core';
import type { RouteColumnData, NowIndicatorData } from '../../domain/types';
import { CARD_W, PX, DAY_S, DAY_E } from '../../domain/constants';
import { EventCard } from './EventCard';
import { NowIndicator } from './NowIndicator';

interface RouteColumnProps {
  data:      RouteColumnData;
  onTap:     (idx: number) => void;
  nowData:   NowIndicatorData | null;
  stickyTop: number;
}

export function RouteColumn({ data, onTap, nowData, stickyTop }: RouteColumnProps) {
  const { route, events, laneMap, numLanes } = data;
  const colWidth  = Math.max(numLanes, 1) * CARD_W;
  const totalH    = (DAY_E - DAY_S) * PX;

  const { setNodeRef, isOver } = useDroppable({ id: String(route.key) });

  return (
    <div
      className="flex-none relative flex flex-col rounded-lg transition-all"
      style={{
        width: colWidth,
        outline: isOver ? `2px dashed rgba(99,102,241,0.5)` : 'none',
        outlineOffset: isOver ? '-2px' : '0',
        background: isOver ? 'rgba(99,102,241,0.04)' : 'transparent',
      }}
    >
      {/* Header da coluna */}
      <div
        className="text-center text-[10px] font-extrabold px-1.5 rounded-t-[6px] h-9 flex items-center justify-center tracking-[0.6px] uppercase sticky z-[90] border-b-2"
        style={{
          top:               stickyTop,
          background:        `${route.color}18`,
          color:             route.color,
          borderBottomColor: route.color,
        }}
      >
        {events.length > 0 ? `${route.label} (${events.length})` : route.label}
      </div>

      {/* Body */}
      <div
        ref={setNodeRef}
        className="relative flex-1"
        style={{ height: totalH }}
      >
        {/* Grid lines */}
        {Array.from({ length: DAY_E / 60 - DAY_S / 60 + 1 }, (_, i) => i + DAY_S / 60).map(h => {
          const top = (h * 60 - DAY_S) * PX;
          return (
            <span key={h}>
              <div className="absolute left-0 right-0 border-t border-[#dde1ea]" style={{ top }} />
              {h < 19 && (
                <div className="absolute left-0 right-0 border-t border-dashed border-[#eaedf3]" style={{ top: top + 30 * PX }} />
              )}
            </span>
          );
        })}

        {/* Placeholder quando coluna está vazia */}
        {events.length === 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[11px] text-gray-300 text-center leading-relaxed w-[130px] pointer-events-none select-none">
            {route.key === 0 ? 'Todos os eventos\ndistribuídos ✓' : 'Segure e arraste\neventos para cá'}
          </div>
        )}

        {/* Now indicator */}
        {nowData && <NowIndicator data={nowData} />}

        {/* Cards */}
        {events.map(e => (
          <EventCard
            key={e.idx}
            event={e}
            lane={laneMap[e.idx] ?? 0}
            onTap={onTap}
          />
        ))}
      </div>
    </div>
  );
}
