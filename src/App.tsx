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
