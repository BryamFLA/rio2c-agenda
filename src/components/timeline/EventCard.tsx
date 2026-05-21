import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { AppEvent } from '../../domain/types';
import { TRILHAS } from '../../data/trilhas';
import { CARD_W, PX, DAY_S } from '../../domain/constants';
import { cleanTitle } from '../../domain/eventUtils';
import { useAgendaStore } from '../../store/useAgendaStore';

interface EventCardProps {
  event:          AppEvent;
  lane:           number;
  onTap:          (idx: number) => void;
  isDragOverlay?: boolean;
}

export function EventCard({ event, lane, onTap, isDragOverlay = false }: EventCardProps) {
  const isFaved        = useAgendaStore(s => s.favorites.has(event.idx));
  const hasNote        = useAgendaStore(s => !!(s.notes[event.idx]?.trim()));
  const hideEvent      = useAgendaStore(s => s.hideEvent);
  const toggleFavorite = useAgendaStore(s => s.toggleFavorite);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: String(event.idx),
  });

  const top    = (event.startMin - DAY_S) * PX;
  const height = Math.max((event.endMin - event.startMin) * PX - 2, 18);
  const left   = lane * CARD_W + 1;
  const width  = CARD_W - 3;

  const trilhaCfg = TRILHAS[event.trilha];
  const title     = cleanTitle(event.title);

  const style = isDragOverlay
    ? { width, height, borderLeftColor: trilhaCfg.color, opacity: 1 }
    : {
        top, height, left, width,
        borderLeftColor: trilhaCfg.color,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.25 : 1,
      };

  return (
    <div
      ref={setNodeRef}
      {...(isDragOverlay ? {} : listeners)}
      {...(isDragOverlay ? {} : attributes)}
      className={`${isDragOverlay ? 'relative' : 'absolute'} rounded-[6px] border-l-2 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden touch-none select-none cursor-pointer hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-shadow ${isFaved ? 'bg-amber-50' : ''}`}
      style={style}
      onClick={() => !isDragging && onTap(event.idx)}
    >
      {/* Remove button */}
      <button
        className="absolute top-[3px] right-[3px] w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] text-[#a09faa] border-none transition-all hover:bg-red-100 hover:text-red-500 font-mono"
        style={{ background: 'rgba(0,0,0,0.05)' }}
        onClick={e => { e.stopPropagation(); hideEvent(event.idx); }}
        title="Remover"
      >
        ✕
      </button>

      {/* Time */}
      <div className="text-[9px] text-[#78767b] pl-2 pr-5 pt-1.5 tabular-nums leading-none">
        {event.start}–{event.end}
      </div>

      {/* Title */}
      <div className="text-[10px] font-semibold leading-[1.3] text-[#191c1e] pl-2 pr-3 mt-0.5">
        {title}
      </div>

      {/* Room — visible when tall enough */}
      {height > 38 && (
        <div className="text-[9px] text-[#78767b] pl-2 pr-3 mt-0.5 truncate">
          {event.room}
        </div>
      )}

      {/* Bottom-right: note dot + star */}
      <div className="absolute bottom-1 right-1 flex items-center gap-0.5">
        {hasNote && <span className="text-[8px] text-indigo-400">●</span>}
        <button
          className={`text-[11px] leading-none border-none bg-transparent transition-colors ${
            isFaved ? 'text-amber-400' : 'text-[#dddadf]'
          } hover:text-amber-400`}
          onClick={e => { e.stopPropagation(); toggleFavorite(event.idx); }}
          title="Favoritar"
        >
          ★
        </button>
      </div>
    </div>
  );
}
