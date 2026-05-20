import { useMemo } from 'react';
import type { Day } from '../../domain/types';
import { EVENTS } from '../../data/events';
import { TRILHAS } from '../../data/trilhas';
import { useAgendaStore } from '../../store/useAgendaStore';
import { useNowIndicator } from '../../hooks/useNowIndicator';
import { getNowSP, isEventDay } from '../../domain/timeUtils';
import { DAY_S, DAY_E } from '../../domain/constants';
import { LiveBadge } from './LiveBadge';

const DAYS: { day: Day; label: string }[] = [
  { day: 26, label: 'Ter 26/05' },
  { day: 27, label: 'Qua 27/05' },
  { day: 28, label: 'Qui 28/05' },
];

export function Header() {
  const currentDay = useAgendaStore(s => s.currentDay);
  const hidden     = useAgendaStore(s => s.hidden);
  const routes     = useAgendaStore(s => s.routes);
  const setDay     = useAgendaStore(s => s.setDay);
  const restoreAll = useAgendaStore(s => s.restoreAll);
  const nowData    = useNowIndicator(currentDay);

  const dayIdxSet = useMemo(
    () => new Set(EVENTS.filter(e => e.day === currentDay).map(e => e.idx)),
    [currentDay]
  );
  const dayTotal = useMemo(
    () => EVENTS.filter(e => dayIdxSet.has(e.idx) && !hidden.has(e.idx)).length,
    [dayIdxSet, hidden]
  );
  const inRoutes = useMemo(() => {
    const routeIdxs = [...routes[1], ...routes[2], ...routes[3]];
    return routeIdxs.filter(idx => dayIdxSet.has(idx)).length;
  }, [routes, dayIdxSet]);
  const avail = dayTotal - inRoutes;

  const sp = getNowSP();
  const showLive = isEventDay(sp) && sp.totalMin >= DAY_S && sp.totalMin <= DAY_E;

  return (
    <header className="bg-[#1a1a2e] text-white px-4 py-3 sticky top-0 z-[200] shadow-[0_2px_10px_rgba(0,0,0,0.4)]">
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="font-bold text-[15px] tracking-wide whitespace-nowrap">🎯 RIO2C 2026</span>
        <div className="flex gap-1.5">
          {DAYS.map(({ day, label }) => (
            <button
              key={day}
              onClick={() => setDay(day)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
                currentDay === day
                  ? 'bg-white text-[#1a1a2e]'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {showLive && nowData && <LiveBadge timeLabel={nowData.timeLabel} />}
          <span className="text-[11px] opacity-50">
            {inRoutes > 0 ? `${inRoutes} em rotas · ${avail} livres` : `${dayTotal} eventos`}
          </span>
          {hidden.size > 0 && (
            <button
              onClick={restoreAll}
              className="text-[11px] font-semibold text-white/65 border border-white/25 rounded-xl px-2.5 py-1 hover:bg-white/15 hover:text-white transition-all"
            >
              ↺ Restaurar
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2.5 mt-2.5">
        {Object.entries(TRILHAS).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1 text-[11px] font-medium opacity-85">
            <div className="w-2.5 h-2.5 rounded-[3px]" style={{ background: cfg.color }} />
            <span>{cfg.label}</span>
          </div>
        ))}
      </div>
    </header>
  );
}
