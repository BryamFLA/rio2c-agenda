import { useAgendaStore } from '../../store/useAgendaStore';
import { useNowIndicator } from '../../hooks/useNowIndicator';
import { DayTabs } from './DayTabs';
import { LiveBadge } from './LiveBadge';

const DAY_LABELS: Record<number, string> = {
  26: 'MAY 26, 2026',
  27: 'MAY 27, 2026',
  28: 'MAY 28, 2026',
};

export function MobileHeader() {
  const currentDay  = useAgendaStore(s => s.currentDay);
  const hiddenCount = useAgendaStore(s => s.hidden.size);
  const restoreAll  = useAgendaStore(s => s.restoreAll);
  const nowData     = useNowIndicator(currentDay);

  const dateStr = DAY_LABELS[currentDay];

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
        {hiddenCount > 0 && (
          <button
            onClick={restoreAll}
            className="text-[11px] font-semibold text-[#47464b] border border-[#c8c5cb] rounded-full px-2.5 py-1 hover:bg-[#f5f5f5] transition-all"
          >
            ↺ {hiddenCount}
          </button>
        )}
      </div>
    </header>
  );
}
