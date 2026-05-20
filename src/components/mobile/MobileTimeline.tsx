import type { Day, MobileRouteFilter } from '../../domain/types';
import { EVENTS } from '../../data/events';
import { useAgendaStore } from '../../store/useAgendaStore';
import { useNowIndicator } from '../../hooks/useNowIndicator';
import { groupEventsByTime } from '../../domain/eventUtils';
import { MobileEventCard } from './MobileEventCard';

interface MobileTimelineProps {
  mobileFilter:   MobileRouteFilter;
  onFilterChange: (f: MobileRouteFilter) => void;
  onTapEvent:     (idx: number) => void;
}

export function MobileTimeline({ mobileFilter, onFilterChange, onTapEvent }: MobileTimelineProps) {
  const currentDay = useAgendaStore(s => s.currentDay);
  const hidden     = useAgendaStore(s => s.hidden);
  const routes1    = useAgendaStore(s => s.routes[1]);
  const routes2    = useAgendaStore(s => s.routes[2]);
  const routes3    = useAgendaStore(s => s.routes[3]);

  useNowIndicator(currentDay as Day);  // keep the now-indicator polling active

  // Filter events for current day
  const dayEvents = EVENTS.filter(e => e.day === currentDay && !hidden.has(e.idx));

  // Apply route filter
  const filtered =
    mobileFilter === 'all'
      ? dayEvents
      : mobileFilter === 1 ? dayEvents.filter(e => routes1.has(e.idx))
      : mobileFilter === 2 ? dayEvents.filter(e => routes2.has(e.idx))
      :                      dayEvents.filter(e => routes3.has(e.idx));

  const groups = groupEventsByTime(filtered);

  const ROUTE_FILTERS: { key: MobileRouteFilter; label: string }[] = [
    { key: 'all', label: 'Todas as Rotas' },
    { key: 1,     label: 'Rota 1' },
    { key: 2,     label: 'Rota 2' },
    { key: 3,     label: 'Rota 3' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* Route filter pills */}
      <div className="sticky top-[72px] z-[150] bg-surface/80 backdrop-blur-[8px] border-b border-[#eceef0] px-4 py-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#78767b] mb-1.5">
          Rotas
        </p>
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {ROUTE_FILTERS.map(f => (
            <button
              key={String(f.key)}
              onClick={() => onFilterChange(f.key)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold border transition-all ${
                mobileFilter === f.key
                  ? 'bg-[#191c1e] text-white border-[#191c1e]'
                  : 'bg-white text-[#47464b] border-[#c8c5cb] hover:border-[#78767b]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Event list */}
      <div className="flex-1 py-4">
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#78767b] text-sm gap-3">
            <span>Nenhum evento nesta rota.</span>
            {mobileFilter !== 'all' && (
              <button
                onClick={() => onFilterChange('all')}
                className="px-4 py-2 bg-[#191c1e] text-white rounded-lg text-[13px] font-semibold"
              >
                Ver todas as rotas
              </button>
            )}
          </div>
        ) : (
          groups.map(group => (
            <div key={group.time} className="flex gap-0 mb-6">
              {/* Time axis — 64px */}
              <div className="w-16 flex-shrink-0 flex flex-col items-end pr-3 pt-1">
                <span className="text-[14px] font-semibold text-[#191c1e] tabular-nums">
                  {group.time}
                </span>
                <span className="text-[11px] text-[#78767b] tabular-nums">
                  {group.events[0].endMin - group.events[0].startMin} min
                </span>
              </div>

              {/* Vertical line + cards */}
              <div className="flex gap-3 flex-1 relative">
                <div className="w-px bg-[#E2E8F0] self-stretch" />
                <div className="flex flex-col gap-2 flex-1 min-w-0 pr-4">
                  {group.events.map(e => (
                    <MobileEventCard key={e.idx} event={e} onTap={onTapEvent} />
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
