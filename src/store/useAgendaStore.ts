import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Day, RouteKey } from '../domain/types';

interface AgendaState {
  currentDay: Day;
  hidden:     Set<number>;
  favorites:  Set<number>;
  notes:      Record<number, string>;
  routes:     Record<1 | 2 | 3, Set<number>>;
}

interface AgendaActions {
  setDay:         (day: Day) => void;
  hideEvent:      (idx: number) => void;
  restoreAll:     () => void;
  toggleFavorite: (idx: number) => void;
  setNote:        (idx: number, text: string) => void;
  assignRoute:    (idx: number, route: RouteKey) => void;
}

type AgendaStore = AgendaState & AgendaActions;

const initialState: AgendaState = {
  currentDay: 26,
  hidden:     new Set(),
  favorites:  new Set(),
  notes:      {},
  routes:     { 1: new Set(), 2: new Set(), 3: new Set() },
};

// Serializer customizado para Set (JSON.stringify não suporta Set nativamente)
const storage = createJSONStorage(() => localStorage, {
  reviver: (_key, value) => {
    if (value && typeof value === 'object' && value.__type === 'Set') {
      return new Set(value.values as number[]);
    }
    return value;
  },
  replacer: (_key, value) => {
    if (value instanceof Set) {
      return { __type: 'Set', values: [...value] };
    }
    return value;
  },
});

export const useAgendaStore = create<AgendaStore>()(
  persist(
    (set) => ({
      ...initialState,

      setDay: (day) => set({ currentDay: day }),

      hideEvent: (idx) =>
        set((s) => {
          const hidden = new Set(s.hidden);
          hidden.add(idx);
          const routes = {
            1: new Set(s.routes[1]),
            2: new Set(s.routes[2]),
            3: new Set(s.routes[3]),
          };
          routes[1].delete(idx);
          routes[2].delete(idx);
          routes[3].delete(idx);
          return { hidden, routes };
        }),

      restoreAll: () => set({ hidden: new Set() }),

      toggleFavorite: (idx) =>
        set((s) => {
          const favorites = new Set(s.favorites);
          if (favorites.has(idx)) favorites.delete(idx);
          else favorites.add(idx);
          return { favorites };
        }),

      setNote: (idx, text) =>
        set((s) => {
          const notes = { ...s.notes };
          if (text.trim()) notes[idx] = text;
          else delete notes[idx];
          return { notes };
        }),

      assignRoute: (idx, route) =>
        set((s) => {
          const routes = {
            1: new Set(s.routes[1]),
            2: new Set(s.routes[2]),
            3: new Set(s.routes[3]),
          };
          routes[1].delete(idx);
          routes[2].delete(idx);
          routes[3].delete(idx);
          if (route > 0) routes[route as 1 | 2 | 3].add(idx);
          return { routes };
        }),
    }),
    {
      name: 'rio2c-agenda-v2',
      storage,
    }
  )
);
