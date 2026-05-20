import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { AppEvent } from '../../domain/types';
import { TRILHAS } from '../../data/trilhas';
import { CARD_W, PX, DAY_S } from '../../domain/constants';
import { getType, cleanTitle } from '../../domain/eventUtils';
import { useAgendaStore } from '../../store/useAgendaStore';

interface EventCardProps {
  event:    AppEvent;
  lane:     number;
  onTap:    (idx: number) => void;
  isDragOverlay?: boolean;
}

export function EventCard({ event, lane, onTap, isDragOverlay = false }: EventCardProps) {
  const { favorites, notes, hideEvent, toggleFavorite } = useAgendaStore();

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: String(event.idx),
  });

  const top    = (event.startMin - DAY_S) * PX;
  const height = Math.max((event.endMin - event.startMin) * PX - 2, 18);
  const left   = lane * CARD_W + 1;
  const width  = CARD_W - 3;

  const trilhaCfg = TRILHAS[event.trilha];
  const isFaved   = favorites.has(event.idx);
  const hasNote   = !!(notes[event.idx]?.trim());
  const type      = getType(event.title);
  const title     = cleanTitle(event.title);

  const style = isDragOverlay
    ? {
        width,
        height,
        borderLeftColor: trilhaCfg.color,
        opacity: 1,
      }
    : {
        top,
        height,
        left,
        width,
        borderLeftColor: trilhaCfg.color,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.25 : 1,
      };

  const showMeta = height > 36;
  const showRoom = height > 56;

  return (
    <div
      ref={setNodeRef}
      {...(isDragOverlay ? {} : listeners)}
      {...(isDragOverlay ? {} : attributes)}
      className={`${isDragOverlay ? 'relative' : 'absolute'} rounded-[7px] border-l-4 bg-white shadow-sm overflow-hidden touch-none select-none cursor-pointer transition-shadow active:shadow-md ${isFaved ? 'bg-amber-50' : ''}`}
      style={style}
      onClick={() => !isDragging && onTap(event.idx)}
    >
      {/* Botão favorito */}
      <button
        className={`absolute top-0.5 left-0.5 w-[22px] h-[22px] rounded-full flex items-center justify-center text-[13px] border-none transition-all ${
          isFaved ? 'text-amber-400 bg-amber-100/70' : 'text-gray-400'
        } hover:text-amber-400 hover:scale-110`}
        style={!isFaved ? { background: 'rgba(0,0,0,0.05)' } : undefined}
        onClick={e => { e.stopPropagation(); toggleFavorite(event.idx); }}
        title="Favoritar"
      >
        ★
      </button>

      {/* Botão remover */}
      <button
        className="absolute top-[3px] right-[3px] w-4 h-4 rounded-full flex items-center justify-center text-[9px] text-gray-500 border-none transition-all hover:bg-red-100 hover:text-red-600 hover:scale-110 font-mono"
        style={{ background: 'rgba(0,0,0,0.06)' }}
        onClick={e => { e.stopPropagation(); hideEvent(event.idx); }}
        title="Remover"
      >
        ✕
      </button>

      {/* Badge de nota */}
      {hasNote && (
        <div className="absolute bottom-1 right-1 w-2.5 h-3 bg-indigo-500 rounded-[1px] opacity-75 pointer-events-none">
          <div className="absolute top-0 right-0 w-1 h-1 bg-[#f0f2f8] rounded-[0_0_0_2px]" />
          <div className="absolute left-0.5 top-[5px] w-1.5 h-px bg-white/85 shadow-[0_2.5px_0_rgba(255,255,255,0.85)]" />
        </div>
      )}

      {/* Conteúdo */}
      <div className="text-[9px] text-gray-400 mb-px pl-5 pr-4 pt-1 tabular-nums">
        {event.start}–{event.end}
      </div>
      <div className="text-[11px] font-semibold leading-[1.35] text-gray-900 pl-5 pr-4">
        {title}
      </div>
      {showMeta && (
        <div className="flex flex-wrap gap-1 mt-0.5 pl-5 pr-4 items-center">
          <span
            className="text-[9px] px-1.5 py-px rounded-[3px] font-semibold text-gray-700"
            style={{ background: 'rgba(0,0,0,0.06)' }}
          >
            {type}
          </span>
          {showRoom && (
            <span className="text-[9px] text-gray-500 truncate max-w-[130px]">
              📍 {event.room}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
