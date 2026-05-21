import { useEffect } from 'react';
import type { AppEvent, RouteKey } from '../../domain/types';
import { TRILHAS } from '../../data/trilhas';
import { ROUTE_COLORS, ROUTE_LABELS } from '../../data/routes';
import { useAgendaStore } from '../../store/useAgendaStore';
import { getType, cleanTitle } from '../../domain/eventUtils';
import { Badge } from '../ui/Badge';

interface EventModalProps {
  event:   AppEvent;
  onClose: () => void;
}

function getRouteKey(routes: Record<1|2|3, Set<number>>, idx: number): RouteKey {
  if (routes[1].has(idx)) return 1;
  if (routes[2].has(idx)) return 2;
  if (routes[3].has(idx)) return 3;
  return 0;
}

export function EventModal({ event, onClose }: EventModalProps) {
  const routes         = useAgendaStore(s => s.routes);
  const favorites      = useAgendaStore(s => s.favorites);
  const note           = useAgendaStore(s => s.notes[event.idx] ?? '');
  const hideEvent      = useAgendaStore(s => s.hideEvent);
  const toggleFavorite = useAgendaStore(s => s.toggleFavorite);
  const setNote        = useAgendaStore(s => s.setNote);
  const assignRoute    = useAgendaStore(s => s.assignRoute);

  const isFaved      = favorites.has(event.idx);
  const currentRoute = getRouteKey(routes, event.idx);
  const trilhaCfg    = TRILHAS[event.trilha];
  const type         = getType(event.title);
  const title        = cleanTitle(event.title);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function handleRemove() {
    hideEvent(event.idx);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/55 z-[500] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[440px] max-h-[88vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
          <Badge label={trilhaCfg.label} color={trilhaCfg.color} />
          <button
            onClick={onClose}
            className="ml-auto w-[26px] h-[26px] rounded-full bg-gray-100 flex items-center justify-center text-[12px] text-gray-500 hover:bg-red-100 hover:text-red-600 transition-all border-none"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-3.5">
          <div className="text-[15px] font-bold text-gray-900 leading-snug mb-2.5">{title}</div>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium">
              🕐 {event.start} – {event.end}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium">
              📍 {event.room}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium">
              {type}
            </span>
          </div>

          {/* Route selector */}
          <div className="flex gap-1.5 mb-3">
            {([0, 1, 2, 3] as RouteKey[]).map(k => (
              <button
                key={k}
                onClick={() => assignRoute(event.idx, k)}
                className="flex-1 py-1.5 px-1 border-[1.5px] rounded-[7px] text-[10px] font-bold text-center leading-tight cursor-pointer transition-all"
                style={
                  currentRoute === k
                    ? { background: ROUTE_COLORS[k], borderColor: ROUTE_COLORS[k], color: '#fff' }
                    : { background: '#fff', borderColor: '#e5e7eb', color: '#6b7280' }
                }
              >
                {ROUTE_LABELS[k]}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mb-3.5">
            <button
              onClick={() => toggleFavorite(event.idx)}
              className={`flex-1 py-2.5 rounded-lg text-[12px] font-semibold border-none transition-all ${
                isFaved
                  ? 'bg-amber-400 text-white'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
            >
              {isFaved ? '★ Favoritado' : '☆ Favoritar'}
            </button>
            <button
              onClick={handleRemove}
              className="flex-1 py-2.5 bg-red-100 text-red-900 hover:bg-red-200 rounded-lg text-[12px] font-semibold border-none transition-all"
            >
              ✕ Remover
            </button>
          </div>

          {/* Notes */}
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">
            Notas
          </label>
          <textarea
            value={note}
            onChange={e => setNote(event.idx, e.target.value)}
            placeholder="Anote algo sobre este painel..."
            className="w-full px-3 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-[13px] font-[inherit] resize-y min-h-[80px] outline-none focus:border-indigo-400 text-gray-900 placeholder:text-gray-300 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
