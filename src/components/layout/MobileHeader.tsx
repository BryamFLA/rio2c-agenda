import type { Day } from '../../domain/types';
import { useAgendaStore } from '../../store/useAgendaStore';
import { useNowIndicator } from '../../hooks/useNowIndicator';
import { DayTabs } from './DayTabs';
import { LiveBadge } from './LiveBadge';

const DAY_DATES: Record<number, Date> = {
  26: new Date(2026, 4, 26),
  27: new Date(2026, 4, 27),
  28: new Date(2026, 4, 28),
};

export function MobileHeader() {
  const currentDay = useAgendaStore(s => s.currentDay);
  const hidden     = useAgendaStore(s => s.hidden);
  const restoreAll = useAgendaStore(s => s.restoreAll);
  const nowData    = useNowIndicator(currentDay as Day);

  const dateStr = DAY_DATES[currentDay]
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    .toUpperCase();

  return (
    <header className="bg-white sticky top-0 z-[200] border-b border-[#E2E8F0]">
      {/* Row 1: date + RIO2C */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#78767b]">📅</span>
          <span className="text-[13px] font-bold text-[#191c1e] tracking-wide">{dateStr}</span>
        </div>
        <div className="flex items-center gap-2">
          {nowData && <LiveBadge timeLabel={nowData.timeLabel} />}
          <span className="text-[15px] font-extrabold text-[#191c1e] tracking-widest">RIO2C</span>
        </div>
      </div>
      {/* Row 2: day tabs + optional restore */}
      <div className="px-4 pb-3 flex items-center justify-between">
        <DayTabs />
        {hidden.size > 0 && (
          <button
            onClick={restoreAll}
            className="text-[11px] font-semibold text-[#47464b] border border-[#c8c5cb] rounded-full px-2.5 py-1 hover:bg-[#f5f5f5] transition-all"
          >
            ↺ {hidden.size}
          </button>
        )}
      </div>
    </header>
  );
}
