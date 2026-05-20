import { DAY_S, DAY_E, PX, HDR_H } from '../../domain/constants';
import type { NowIndicatorData } from '../../domain/types';

interface TimeAxisProps {
  nowData: NowIndicatorData | null;
}

export function TimeAxis({ nowData }: TimeAxisProps) {
  const totalH = (DAY_E - DAY_S) * PX;
  const hours = Array.from({ length: DAY_E / 60 - DAY_S / 60 + 1 }, (_, i) => i + DAY_S / 60);

  return (
    <div
      className="flex-shrink-0 w-[52px] sticky left-0 z-[100] bg-[#f0f2f8]"
      style={{ height: totalH + HDR_H + 8 }}
    >
      {hours.map(h => {
        const top = HDR_H + (h * 60 - DAY_S) * PX;
        return (
          <span key={h}>
            <span
              className="absolute right-2 text-[10px] text-gray-400 whitespace-nowrap tabular-nums -translate-y-1/2"
              style={{ top }}
            >
              {h}:00
            </span>
            {h < 19 && (
              <span
                className="absolute right-2 text-[9px] text-gray-300 whitespace-nowrap tabular-nums -translate-y-1/2"
                style={{ top: top + 30 * PX }}
              >
                {h}:30
              </span>
            )}
          </span>
        );
      })}

      {/* Now tick */}
      {nowData && (
        <span
          className="absolute right-1 text-[9px] font-extrabold text-red-500 bg-white px-0.5 rounded tabular-nums -translate-y-1/2 z-[105] shadow-sm"
          style={{ top: HDR_H + nowData.nowTop }}
        >
          {nowData.timeLabel}
        </span>
      )}
    </div>
  );
}
