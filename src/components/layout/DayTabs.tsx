import type { Day } from '../../domain/types';
import { useAgendaStore } from '../../store/useAgendaStore';

const DAYS: { day: Day; label: string }[] = [
  { day: 26, label: 'Ter 26/05' },
  { day: 27, label: 'Qua 27/05' },
  { day: 28, label: 'Qui 28/05' },
];

interface DayTabsProps {
  className?: string;
}

export function DayTabs({ className = '' }: DayTabsProps) {
  const currentDay = useAgendaStore(s => s.currentDay);
  const setDay     = useAgendaStore(s => s.setDay);

  return (
    <div className={`flex gap-6 ${className}`}>
      {DAYS.map(({ day, label }) => (
        <button
          key={day}
          onClick={() => setDay(day)}
          aria-current={currentDay === day ? true : undefined}
          className={`pb-1.5 text-[13px] font-semibold transition-colors border-b-2 ${
            currentDay === day
              ? 'border-[#191c1e] text-[#191c1e]'
              : 'border-transparent text-[#78767b] hover:text-[#47464b]'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
