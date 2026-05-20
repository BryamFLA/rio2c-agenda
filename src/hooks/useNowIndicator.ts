import { useState, useEffect } from 'react';
import type { Day, NowIndicatorData } from '../domain/types';
import { getNowSP, isEventDay, fmt2 } from '../domain/timeUtils';
import { DAY_S, DAY_E, PX } from '../domain/constants';

export function useNowIndicator(currentDay: Day): NowIndicatorData | null {
  const [data, setData] = useState<NowIndicatorData | null>(null);

  useEffect(() => {
    function update() {
      const sp = getNowSP();
      const withinHours = sp.totalMin >= DAY_S && sp.totalMin <= DAY_E;

      if (!isEventDay(sp) || sp.day !== currentDay || !withinHours) {
        setData(null);
        return;
      }

      const nowTop  = (sp.totalMin - DAY_S) * PX;
      const slotMin = Math.floor(sp.totalMin / 30) * 30;
      const slotTop = Math.max((slotMin - DAY_S) * PX, 0);
      const bandH   = Math.min(30 * PX, (DAY_E - slotMin) * PX);

      setData({
        nowTop,
        slotTop,
        bandH,
        timeLabel: `${fmt2(sp.hour)}:${fmt2(sp.minute)}`,
      });
    }

    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, [currentDay]);

  return data;
}
