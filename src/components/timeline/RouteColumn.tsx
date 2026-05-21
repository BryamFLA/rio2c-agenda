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
  const colWidth = Math.max(numLanes, 1) * CARD_W;
  const totalH   = (DAY_E - DAY_S) * PX;

  const { setNodeRef, isOver } = useDroppable({ id: String(route.key) });

  return (
    <div
      className="flex-none relative flex flex-col"
      style={{
        width:         colWidth,
        outline:       isOver ? '2px dashed rgba(99,102,241,0.4)' : 'none',
        outlineOffset: isOver ? '-2px' : '0',
      }}
    >
      {/* Column header */}
      <div
        className="flex flex-col items-center justify-center bg-white border-b border-[#E2E8F0] sticky z-[90] px-2"
        style={{ top: stickyTop, height: route.key === 0 ? 48 : 36 }}
      >
        <span className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#47464b]">
          {route.label}
          {route.key !== 0 && events.length > 0 && (
            <span className="ml-1 font-normal text-[#a09faa]">({events.length})</span>
          )}
        </span>
        {route.key === 0 && (
          <span className="text-[9px] text-[#a09faa] mt-0.5">Segure e arraste</span>
        )}
      </div>

      {/* Body */}
      <div
        ref={setNodeRef}
        className="relative flex-1"
        style={{
          height:     totalH,
          background: isOver ? 'rgba(99,102,241,0.03)' : 'transparent',
        }}
      >
        {/* Grid lines */}
        {Array.from({ length: DAY_E / 60 - DAY_S / 60 + 1 }, (_, i) => i + DAY_S / 60).map(h => {
          const top = (h * 60 - DAY_S) * PX;
          return (
            <span key={h}>
              <div className="absolute left-0 right-0 border-t border-[#dde1ea]" style={{ top }} />
              {h < 19 && (
                <div
                  className="absolute left-0 right-0 border-t border-dashed border-[#eaedf3]"
                  style={{ top: top + 30 * PX }}
                />
              )}
            </span>
          );
        })}

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
