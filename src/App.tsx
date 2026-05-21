import { useState, useEffect } from 'react';
import type { AppEvent, MobileRouteFilter } from './domain/types';
import { EVENTS } from './data/events';
import { useAgendaStore } from './store/useAgendaStore';
import { Header } from './components/layout/Header';
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
  const hidden   = useAgendaStore(s => s.hidden);
  const isMobile = useIsMobile();

  function openModal(idx: number) {
    if (hidden.has(idx)) return;
    setModalEvent(EVENTS.find(e => e.idx === idx) ?? null);
  }

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface">
      <Header />
      {isMobile ? (
        <MobileTimeline
          mobileFilter={mobileFilter}
          onFilterChange={setMobileFilter}
          onTapEvent={openModal}
        />
      ) : (
        <Timeline onTapEvent={openModal} />
      )}
      {modalEvent && (
        <EventModal event={modalEvent} onClose={() => setModalEvent(null)} />
      )}
    </div>
  );
}
