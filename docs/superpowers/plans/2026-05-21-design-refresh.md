# Design Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dark-navy sticky header with a sidebar+main layout on desktop and a minimal white header on mobile, matching the provided design mockups.

**Architecture:** Create 2 shared components (DayTabs, TrilhaLegend) and 2 layout components (MobileHeader, Sidebar). Restructure App.tsx for conditional desktop/mobile layouts. Delete the old Header.tsx. Update all card and column components with cleaner, monochrome styling. No data model changes.

**Tech Stack:** React 18, TypeScript 5, Tailwind CSS 3, Zustand 5

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/components/layout/DayTabs.tsx` | Shared day-selector with underline style |
| Create | `src/components/layout/TrilhaLegend.tsx` | Horizontal colored-dot legend row |
| Create | `src/components/layout/MobileHeader.tsx` | Mobile: date + RIO2C + DayTabs |
| Create | `src/components/layout/Sidebar.tsx` | Desktop: logo + static event info |
| Delete | `src/components/layout/Header.tsx` | Replaced by MobileHeader + Sidebar |
| Modify | `src/App.tsx` | Conditional layout: sidebar+timeline vs header+mobile |
| Modify | `src/components/timeline/Timeline.tsx` | DayTabs+TrilhaLegend+counter in top bar, restructure scroll |
| Modify | `src/components/timeline/EventCard.tsx` | Always show time+room, granular selectors, star at bottom |
| Modify | `src/components/timeline/RouteColumn.tsx` | Monochrome headers, DISPONÍVEIS drag hint |
| Modify | `src/components/mobile/MobileTimeline.tsx` | Add TrilhaLegend section, fix sticky offset, white bg |
| Modify | `src/components/mobile/MobileEventCard.tsx` | Granular selectors, emoji regex fix, layout polish |

---

## Task 1: DayTabs shared component

**Files:**
- Create: `src/components/layout/DayTabs.tsx`

- [ ] **Step 1: Create DayTabs.tsx**

```tsx
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
```

- [ ] **Step 2: Verify it builds**

Run: `npm run build`
Expected: `✓ built in X.XXs` with no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/DayTabs.tsx
git commit -m "feat(design): DayTabs shared component with underline style"
```

---

## Task 2: TrilhaLegend shared component

**Files:**
- Create: `src/components/layout/TrilhaLegend.tsx`

- [ ] **Step 1: Create TrilhaLegend.tsx**

```tsx
import { TRILHAS } from '../../data/trilhas';

interface TrilhaLegendProps {
  className?: string;
}

export function TrilhaLegend({ className = '' }: TrilhaLegendProps) {
  return (
    <div className={`flex gap-4 overflow-x-auto pb-0.5 ${className}`}>
      {Object.entries(TRILHAS).map(([key, cfg]) => (
        <div key={key} className="flex items-center gap-1.5 flex-shrink-0">
          <div
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ background: cfg.color }}
          />
          <span className="text-[11px] text-[#47464b] whitespace-nowrap">
            {cfg.label.replace(/^\p{Emoji_Presentation}\s*/u, '')}
          </span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify it builds**

Run: `npm run build`
Expected: `✓ built in X.XXs` with no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/TrilhaLegend.tsx
git commit -m "feat(design): TrilhaLegend shared component with colored dots"
```

---

## Task 3: MobileHeader component

**Files:**
- Create: `src/components/layout/MobileHeader.tsx`

This replaces the dark-navy `Header.tsx` on mobile. It shows date + "RIO2C" in the first row, and DayTabs + optional restore button in the second row.

- [ ] **Step 1: Create MobileHeader.tsx**

```tsx
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
```

- [ ] **Step 2: Verify it builds**

Run: `npm run build`
Expected: `✓ built in X.XXs` with no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/MobileHeader.tsx
git commit -m "feat(design): MobileHeader — white header with date, DayTabs, LiveBadge"
```

---

## Task 4: Sidebar component

**Files:**
- Create: `src/components/layout/Sidebar.tsx`

Desktop-only left panel with logo, tagline, and static event info sections.

- [ ] **Step 1: Create Sidebar.tsx**

```tsx
import type { ReactNode } from 'react';

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#78767b] mb-1">
        {label}
      </div>
      <div className="text-[12px] text-[#47464b] leading-relaxed">{children}</div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="w-[240px] flex-shrink-0 bg-white border-r border-[#E2E8F0] flex flex-col p-6 overflow-y-auto">
      <div className="mb-8">
        <div className="text-[20px] font-bold text-[#191c1e] leading-tight">Rio2C 2026</div>
        <div className="text-[11px] text-[#78767b] italic mt-0.5">Precision Minimalism</div>
      </div>
      <div className="flex flex-col gap-5">
        <Section label="LOCAL">
          Cidade das Artes, Barra da Tijuca, Rio de Janeiro.
        </Section>
        <Section label="DATAS">
          24 a 30 de Maio de 2026.
        </Section>
        <Section label="OBJETIVO">
          O maior encontro de criatividade e inovação da América Latina, conectando audiovisual, música, games, tecnologia, ciência, mídia e publicidade.
        </Section>
        <Section label="ESTRUTURA">
          Conference (painéis), Market (negócios) e Festivalia (experiências).
        </Section>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Verify it builds**

Run: `npm run build`
Expected: `✓ built in X.XXs` with no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Sidebar.tsx
git commit -m "feat(design): Sidebar component with logo and event info sections"
```

---

## Task 5: App.tsx layout restructuring + delete Header.tsx

**Files:**
- Modify: `src/App.tsx`
- Delete: `src/components/layout/Header.tsx`

Desktop layout: `<Sidebar />` (240 px) + `<div flex-1><Timeline /></div>`.
Mobile layout: `<MobileHeader />` above `<MobileTimeline />`.

- [ ] **Step 1: Replace App.tsx**

```tsx
import { useState, useEffect } from 'react';
import type { AppEvent, MobileRouteFilter } from './domain/types';
import { EVENTS } from './data/events';
import { useAgendaStore } from './store/useAgendaStore';
import { Sidebar } from './components/layout/Sidebar';
import { MobileHeader } from './components/layout/MobileHeader';
import { Timeline } from './components/timeline/Timeline';
import { MobileTimeline } from './components/mobile/MobileTimeline';
import { EventModal } from './components/modal/EventModal';

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

export default function App() {
  const [modalEvent, setModalEvent] = useState<AppEvent | null>(null);
  const [mobileFilter, setMobileFilter] = useState<MobileRouteFilter>('all');
  const hidden     = useAgendaStore(s => s.hidden);
  const currentDay = useAgendaStore(s => s.currentDay);
  const isMobile   = useIsMobile();

  useEffect(() => { setMobileFilter('all'); }, [currentDay]);

  function openModal(idx: number) {
    if (hidden.has(idx)) return;
    setModalEvent(EVENTS.find(e => e.idx === idx) ?? null);
  }

  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen bg-white font-sans text-on-surface">
        <MobileHeader />
        <MobileTimeline
          mobileFilter={mobileFilter}
          onFilterChange={setMobileFilter}
          onTapEvent={openModal}
        />
        {modalEvent && <EventModal event={modalEvent} onClose={() => setModalEvent(null)} />}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f5f5] font-sans text-on-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Timeline onTapEvent={openModal} />
      </div>
      {modalEvent && <EventModal event={modalEvent} onClose={() => setModalEvent(null)} />}
    </div>
  );
}
```

- [ ] **Step 2: Delete Header.tsx**

```bash
rm src/components/layout/Header.tsx
```

- [ ] **Step 3: Verify it builds**

Run: `npm run build`
Expected: `✓ built in X.XXs` with no TypeScript errors. If tsc complains about the deleted file being referenced elsewhere, check for stale imports.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git rm src/components/layout/Header.tsx
git commit -m "feat(design): App.tsx — sidebar+timeline desktop, white header mobile; delete Header.tsx"
```

---

## Task 6: Timeline.tsx — controls bar + restructured scroll container

**Files:**
- Modify: `src/components/timeline/Timeline.tsx`

Key structural changes:
1. Wrap everything in `DndContext` at the outer level.
2. Add a non-scrolling controls bar at the top with DayTabs, LiveBadge, event counter, restore button, and TrilhaLegend.
3. Move the scroll container to a `flex-1 overflow-auto bg-[#f5f5f5]` inner div.
4. Pass `stickyTop={0}` to RouteColumn (column headers are sticky within the scroll container, not relative to the page).

- [ ] **Step 1: Replace Timeline.tsx**

```tsx
import { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import type { Day, RouteKey, AppEvent } from '../../domain/types';
import { EVENTS } from '../../data/events';
import { CARD_W } from '../../domain/constants';
import { useAgendaStore } from '../../store/useAgendaStore';
import { useRouteColumns } from '../../hooks/useRouteColumns';
import { useNowIndicator } from '../../hooks/useNowIndicator';
import { TimeAxis } from './TimeAxis';
import { RouteColumn } from './RouteColumn';
import { EventCard } from './EventCard';
import { DayTabs } from '../layout/DayTabs';
import { TrilhaLegend } from '../layout/TrilhaLegend';
import { LiveBadge } from '../layout/LiveBadge';

interface TimelineProps {
  onTapEvent: (idx: number) => void;
}

export function Timeline({ onTapEvent }: TimelineProps) {
  const currentDay  = useAgendaStore(s => s.currentDay);
  const assignRoute = useAgendaStore(s => s.assignRoute);
  const hidden      = useAgendaStore(s => s.hidden);
  const restoreAll  = useAgendaStore(s => s.restoreAll);
  const routes      = useAgendaStore(s => s.routes);
  const columns     = useRouteColumns(currentDay as Day);
  const nowData     = useNowIndicator(currentDay as Day);

  const [activeEvent, setActiveEvent] = useState<AppEvent | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 180, tolerance: 8 },
    })
  );

  const dayIdxSet = useMemo(
    () => new Set(EVENTS.filter(e => e.day === currentDay).map(e => e.idx)),
    [currentDay]
  );
  const dayTotal = useMemo(
    () => EVENTS.filter(e => dayIdxSet.has(e.idx) && !hidden.has(e.idx)).length,
    [dayIdxSet, hidden]
  );
  const inRoutes = useMemo(() => {
    const all = [...routes[1], ...routes[2], ...routes[3]];
    return all.filter(idx => dayIdxSet.has(idx)).length;
  }, [routes, dayIdxSet]);

  function handleDragStart({ active }: DragStartEvent) {
    const idx = parseInt(active.id as string, 10);
    setActiveEvent(EVENTS.find(e => e.idx === idx) ?? null);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveEvent(null);
    if (!over) return;
    const idx      = parseInt(active.id as string, 10);
    const routeKey = parseInt(over.id as string, 10) as RouteKey;
    assignRoute(idx, routeKey);
  }

  const isEmpty = columns.every(c => c.events.length === 0);

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-full overflow-hidden">

        {/* Top controls bar — not inside the scroll container */}
        <div className="flex-shrink-0 bg-white border-b border-[#E2E8F0] px-6 py-3">
          <div className="flex items-center justify-between mb-2.5">
            <DayTabs />
            <div className="flex items-center gap-3">
              {nowData && <LiveBadge timeLabel={nowData.timeLabel} />}
              <span className="text-[11px] text-[#78767b]">
                {inRoutes > 0
                  ? `${inRoutes} em rotas · ${dayTotal - inRoutes} livres`
                  : `${dayTotal} eventos`}
              </span>
              {hidden.size > 0 && (
                <button
                  onClick={restoreAll}
                  className="text-[11px] font-semibold text-[#47464b] border border-[#c8c5cb] rounded-full px-2.5 py-1 hover:bg-[#f5f5f5] transition-all"
                >
                  ↺ Restaurar
                </button>
              )}
            </div>
          </div>
          <TrilhaLegend />
        </div>

        {/* Scrollable grid */}
        <div className="flex-1 overflow-auto bg-[#f5f5f5]">
          {isEmpty ? (
            <div className="flex items-center justify-center py-16 text-[#78767b] text-[13px]">
              Nenhum evento para exibir.
            </div>
          ) : (
            <div className="flex pb-10">
              <TimeAxis nowData={nowData} />
              <div className="flex gap-4 px-4 flex-1 items-start">
                {columns.map(col => (
                  <RouteColumn
                    key={col.route.key}
                    data={col}
                    onTap={onTapEvent}
                    nowData={nowData}
                    stickyTop={0}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeEvent && (
          <div style={{ width: CARD_W - 3 }}>
            <EventCard
              event={activeEvent}
              lane={0}
              onTap={() => {}}
              isDragOverlay
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
```

- [ ] **Step 2: Verify it builds**

Run: `npm run build`
Expected: `✓ built in X.XXs` with no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/timeline/Timeline.tsx
git commit -m "feat(design): Timeline — top controls bar with DayTabs + TrilhaLegend, restructure scroll"
```

---

## Task 7: Desktop EventCard redesign

**Files:**
- Modify: `src/components/timeline/EventCard.tsx`

Changes vs current:
- Use granular Zustand selectors (no full-store `useAgendaStore()`)
- Remove `getType` import and the type badge
- Always show `event.room` when height > 38 (instead of needing height > 56)
- Star moved to bottom-right corner, always visible
- Remove button smaller (3px, 8px icon)
- Cleaner shadow: `shadow-[0_1px_3px_rgba(0,0,0,0.08)]`

- [ ] **Step 1: Replace EventCard.tsx**

```tsx
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
```

- [ ] **Step 2: Verify it builds**

Run: `npm run build`
Expected: `✓ built in X.XXs` with no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/timeline/EventCard.tsx
git commit -m "feat(design): EventCard — monochrome, always-visible time+room, star bottom-right"
```

---

## Task 8: RouteColumn headers redesign

**Files:**
- Modify: `src/components/timeline/RouteColumn.tsx`

Changes vs current:
- Remove the colored background tint and colored bottom border from the header
- Header is plain: small gray all-caps label on white background
- The DISPONÍVEIS column (`route.key === 0`) gets a permanent "Segure e arraste" subtitle in the header
- DISPONÍVEIS header is 48px tall (two lines), others 36px
- Remove the centered empty-state text (the drag hint is now always in the header)
- Drop background: `isOver` highlight becomes a subtle border inset only

- [ ] **Step 1: Replace RouteColumn.tsx**

```tsx
import { useDroppable } from '@dnd-kit/core';
import type { RouteColumnData, NowIndicatorData } from '../../domain/types';
import { CARD_W, PX, DAY_S, DAY_E } from '../../domain/constants';
import { EventCard } from './EventCard';
import { NowIndicator } from './NowIndicator';

interface RouteColumnProps {
  data:      RouteColumnData;
  onTap:     (idx: number) => void;
  nowData:   NowIndicatorData | null;
  stickyTop: number;
}

export function RouteColumn({ data, onTap, nowData, stickyTop }: RouteColumnProps) {
  const { route, events, laneMap, numLanes } = data;
  const colWidth = Math.max(numLanes, 1) * CARD_W;
  const totalH   = (DAY_E - DAY_S) * PX;

  const { setNodeRef, isOver } = useDroppable({ id: String(route.key) });

  return (
    <div
      className="flex-none relative flex flex-col"
      style={{
        width:         colWidth,
        outline:       isOver ? '2px dashed rgba(99,102,241,0.4)' : 'none',
        outlineOffset: isOver ? '-2px' : '0',
      }}
    >
      {/* Column header */}
      <div
        className="flex flex-col items-center justify-center bg-white border-b border-[#E2E8F0] sticky z-[90] px-2"
        style={{ top: stickyTop, height: route.key === 0 ? 48 : 36 }}
      >
        <span className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#47464b]">
          {route.label}
          {route.key !== 0 && events.length > 0 && (
            <span className="ml-1 font-normal text-[#a09faa]">({events.length})</span>
          )}
        </span>
        {route.key === 0 && (
          <span className="text-[9px] text-[#a09faa] mt-0.5">Segure e arraste</span>
        )}
      </div>

      {/* Body */}
      <div
        ref={setNodeRef}
        className="relative flex-1"
        style={{
          height:     totalH,
          background: isOver ? 'rgba(99,102,241,0.03)' : 'transparent',
        }}
      >
        {/* Grid lines */}
        {Array.from({ length: DAY_E / 60 - DAY_S / 60 + 1 }, (_, i) => i + DAY_S / 60).map(h => {
          const top = (h * 60 - DAY_S) * PX;
          return (
            <span key={h}>
              <div className="absolute left-0 right-0 border-t border-[#dde1ea]" style={{ top }} />
              {h < 19 && (
                <div
                  className="absolute left-0 right-0 border-t border-dashed border-[#eaedf3]"
                  style={{ top: top + 30 * PX }}
                />
              )}
            </span>
          );
        })}

        {/* Now indicator */}
        {nowData && <NowIndicator data={nowData} />}

        {/* Cards */}
        {events.map(e => (
          <EventCard
            key={e.idx}
            event={e}
            lane={laneMap[e.idx] ?? 0}
            onTap={onTap}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify it builds**

Run: `npm run build`
Expected: `✓ built in X.XXs` with no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/timeline/RouteColumn.tsx
git commit -m "feat(design): RouteColumn — monochrome headers, DISPONÍVEIS drag hint"
```

---

## Task 9: MobileTimeline — TrilhaLegend section + sticky offset + white background

**Files:**
- Modify: `src/components/mobile/MobileTimeline.tsx`

Changes vs current:
- Remove `useNowIndicator` call (MobileHeader now handles it)
- Add TrilhaLegend section with "TRILHAS/TEMAS" label above event list
- Update sticky `top-[72px]` → `top-[80px]` to match taller MobileHeader
- Change `bg-surface` → `bg-white` for pure white background
- Change section label style from `text-[#78767b]` to match the new design system typography

- [ ] **Step 1: Replace MobileTimeline.tsx**

```tsx
import type { Day, MobileRouteFilter } from '../../domain/types';
import { EVENTS } from '../../data/events';
import { useAgendaStore } from '../../store/useAgendaStore';
import { groupEventsByTime } from '../../domain/eventUtils';
import { TrilhaLegend } from '../layout/TrilhaLegend';
import { MobileEventCard } from './MobileEventCard';

interface MobileTimelineProps {
  mobileFilter:   MobileRouteFilter;
  onFilterChange: (f: MobileRouteFilter) => void;
  onTapEvent:     (idx: number) => void;
}

const ROUTE_FILTERS: { key: MobileRouteFilter; label: string }[] = [
  { key: 'all', label: 'Todas as Rotas' },
  { key: 1,     label: 'Rota 1' },
  { key: 2,     label: 'Rota 2' },
  { key: 3,     label: 'Rota 3' },
];

export function MobileTimeline({ mobileFilter, onFilterChange, onTapEvent }: MobileTimelineProps) {
  const currentDay = useAgendaStore(s => s.currentDay);
  const hidden     = useAgendaStore(s => s.hidden);
  const routes1    = useAgendaStore(s => s.routes[1]);
  const routes2    = useAgendaStore(s => s.routes[2]);
  const routes3    = useAgendaStore(s => s.routes[3]);

  const dayEvents = EVENTS.filter(e => e.day === (currentDay as Day) && !hidden.has(e.idx));

  const filtered =
    mobileFilter === 'all'
      ? dayEvents
      : mobileFilter === 1 ? dayEvents.filter(e => routes1.has(e.idx))
      : mobileFilter === 2 ? dayEvents.filter(e => routes2.has(e.idx))
      :                      dayEvents.filter(e => routes3.has(e.idx));

  const groups = groupEventsByTime(filtered);

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Sticky route filter pills — top-[80px] matches MobileHeader height */}
      <div className="sticky top-[80px] z-[150] bg-white/90 backdrop-blur-[8px] border-b border-[#E2E8F0] px-4 py-2">
        <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#78767b] mb-1.5">
          Rotas
        </p>
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {ROUTE_FILTERS.map(f => (
            <button
              key={String(f.key)}
              onClick={() => onFilterChange(f.key)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold border transition-all ${
                mobileFilter === f.key
                  ? 'bg-[#191c1e] text-white border-[#191c1e]'
                  : 'bg-white text-[#47464b] border-[#c8c5cb] hover:border-[#78767b]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 pt-4 pb-8">

        {/* Trilha legend */}
        <div className="px-4 mb-5">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#78767b] mb-2">
            Trilhas/Temas
          </p>
          <TrilhaLegend />
        </div>

        {/* Event groups */}
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-[#78767b] text-sm gap-3">
            <span>Nenhum evento nesta rota.</span>
            {mobileFilter !== 'all' && (
              <button
                onClick={() => onFilterChange('all')}
                className="px-4 py-2 bg-[#191c1e] text-white rounded-lg text-[13px] font-semibold"
              >
                Ver todas as rotas
              </button>
            )}
          </div>
        ) : (
          groups.map(group => (
            <div key={group.time} className="flex gap-0 mb-6">
              {/* Time axis — 64 px */}
              <div className="w-16 flex-shrink-0 flex flex-col items-end pr-3 pt-1">
                <span className="text-[14px] font-semibold text-[#191c1e] tabular-nums">
                  {group.time}
                </span>
              </div>
              {/* Vertical line + cards */}
              <div className="flex gap-3 flex-1 relative">
                <div className="w-px bg-[#E2E8F0] self-stretch" />
                <div className="flex flex-col gap-2 flex-1 min-w-0 pr-4">
                  {group.events.map(e => (
                    <MobileEventCard key={e.idx} event={e} onTap={onTapEvent} />
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify it builds**

Run: `npm run build`
Expected: `✓ built in X.XXs` with no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/mobile/MobileTimeline.tsx
git commit -m "feat(design): MobileTimeline — TrilhaLegend section, white bg, sticky offset fix"
```

---

## Task 10: MobileEventCard — granular selectors + emoji regex + layout polish

**Files:**
- Modify: `src/components/mobile/MobileEventCard.tsx`

Changes vs current:
- Replace `useAgendaStore()` full-store subscription with four granular selectors
- Remove `getType` import (type badge removed to match mockup)
- Fix emoji regex: use `/^\p{Emoji_Presentation}\s*/u` (with unicode flag)
- Add subtle `border-t` separator before the footer row
- Increase left border to 3px for visual weight (matches the mobile mockup's thicker strip)

- [ ] **Step 1: Replace MobileEventCard.tsx**

```tsx
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
      className={`relative bg-white border border-[#E2E8F0] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] cursor-pointer overflow-hidden transition-shadow active:shadow-[0_2px_6px_rgba(0,0,0,0.10)] ${isFaved ? 'bg-amber-50' : ''}`}
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
```

- [ ] **Step 2: Verify it builds**

Run: `npm run build`
Expected: `✓ built in X.XXs` with no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/mobile/MobileEventCard.tsx
git commit -m "feat(design): MobileEventCard — granular selectors, trilha label polish, footer separator"
```

---

## Final verification

After all 10 tasks are complete, run a full build and push:

```bash
npm run build
git push origin main
```

Expected GitHub Actions deploy: ~60s (Node install + Vite build + Pages upload).
