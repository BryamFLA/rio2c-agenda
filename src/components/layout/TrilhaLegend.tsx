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
