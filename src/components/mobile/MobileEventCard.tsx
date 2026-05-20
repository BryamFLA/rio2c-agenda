import type { AppEvent } from '../../domain/types';
import { TRILHAS } from '../../data/trilhas';
import { useAgendaStore } from '../../store/useAgendaStore';
import { getType, cleanTitle } from '../../domain/eventUtils';

interface MobileEventCardProps {
  event:  AppEvent;
  onTap:  (idx: number) => void;
}

export function MobileEventCard({ event, onTap }: MobileEventCardProps) {
  const { favorites, notes, hideEvent, toggleFavorite } = useAgendaStore();

  const trilhaCfg   = TRILHAS[event.trilha];
  const isFaved     = favorites.has(event.idx);
  const hasNote     = !!(notes[event.idx]?.trim());
  const type        = getType(event.title);
  const title       = cleanTitle(event.title);
  const durationMin = event.endMin - event.startMin;

  return (
    <div
      className="relative bg-white border border-[#E2E8F0] rounded-2xl shadow-card active:shadow-card-hover transition-shadow cursor-pointer overflow-hidden"
      style={{ borderLeftWidth: 2, borderLeftColor: trilhaCfg.color }}
      onClick={() => onTap(event.idx)}
    >
      {/* Linha superior: trilha label + localização */}
      <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
        <span
          className="text-[10px] font-bold uppercase tracking-[0.05em]"
          style={{ color: trilhaCfg.color }}
        >
          {trilhaCfg.label.replace(/^[^\w]+/, '')}
        </span>
        <span className="text-[10px] text-[#78767b] flex items-center gap-1 truncate max-w-[140px]">
          📍 {event.room}
        </span>
      </div>

      {/* Título */}
      <div className="px-3 pb-1 text-[14px] font-semibold leading-snug text-[#191c1e]">
        {title}
      </div>

      {/* Rodapé: tipo + duração + favorito + nota */}
      <div className="flex items-center justify-between px-3 pb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] bg-[#eceef0] text-[#47464b] px-2 py-0.5 rounded-full font-medium">
            {type}
          </span>
          <span className="text-[10px] text-[#78767b] tabular-nums">
            {durationMin} min
          </span>
        </div>
        <div className="flex items-center gap-2">
          {hasNote && (
            <span className="text-[10px] text-indigo-400">●</span>
          )}
          <button
            className={`text-[16px] leading-none border-none bg-transparent transition-colors ${
              isFaved ? 'text-[#191c1e]' : 'text-[#c8c5cb]'
            } hover:text-[#191c1e]`}
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
