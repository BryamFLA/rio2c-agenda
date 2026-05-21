import type { AppEvent } from '../../domain/types';
import { TRILHAS } from '../../data/trilhas';
import { useAgendaStore } from '../../store/useAgendaStore';
import { cleanTitle } from '../../domain/eventUtils';

interface MobileEventCardProps {
  event: AppEvent;
  onTap: (idx: number) => void;
}

export function MobileEventCard({ event, onTap }: MobileEventCardProps) {
  const isFaved        = useAgendaStore(s => s.favorites.has(event.idx));
  const hasNote        = useAgendaStore(s => !!(s.notes[event.idx]?.trim()));
  const toggleFavorite = useAgendaStore(s => s.toggleFavorite);
  const hideEvent      = useAgendaStore(s => s.hideEvent);

  const trilhaCfg   = TRILHAS[event.trilha];
  const title       = cleanTitle(event.title);
  const durationMin = event.endMin - event.startMin;
  const trilhaLabel = trilhaCfg.label.replace(/^\p{Emoji_Presentation}\s*/u, '');

  return (
    <div
      className={`relative border border-[#E2E8F0] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] cursor-pointer overflow-hidden transition-shadow active:shadow-[0_2px_6px_rgba(0,0,0,0.10)] ${isFaved ? 'bg-amber-50' : 'bg-white'}`}
      style={{ borderLeftWidth: 3, borderLeftColor: trilhaCfg.color }}
      onClick={() => onTap(event.idx)}
    >
      {/* Header: trilha label + room */}
      <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
        <span
          className="text-[10px] font-extrabold uppercase tracking-[0.06em]"
          style={{ color: trilhaCfg.color }}
        >
          {trilhaLabel}
        </span>
        <span className="text-[10px] text-[#78767b] flex items-center gap-0.5 truncate max-w-[130px] ml-2">
          <span className="text-[9px]">📍</span>
          <span className="truncate">{event.room}</span>
        </span>
      </div>

      {/* Title */}
      <div className="px-3 pb-2 text-[14px] font-semibold leading-snug text-[#191c1e]">
        {title}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-3 pb-2.5 pt-1.5 border-t border-[#F2F2F5]">
        <span className="text-[10px] text-[#78767b] tabular-nums">{durationMin} min</span>
        <div className="flex items-center gap-2">
          {hasNote && <span className="text-[10px] text-indigo-400">●</span>}
          <button
            className={`text-[15px] leading-none border-none bg-transparent transition-colors ${
              isFaved ? 'text-amber-400' : 'text-[#c8c5cb]'
            } hover:text-amber-400`}
            onClick={e => { e.stopPropagation(); toggleFavorite(event.idx); }}
            title="Favoritar"
          >
            ★
          </button>
          <button
            className="text-[11px] text-[#c8c5cb] hover:text-[#ba1a1a] transition-colors border-none bg-transparent"
            onClick={e => { e.stopPropagation(); hideEvent(event.idx); }}
            title="Remover"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
