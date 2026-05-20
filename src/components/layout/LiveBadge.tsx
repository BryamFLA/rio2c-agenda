interface LiveBadgeProps {
  timeLabel: string;
}

export function LiveBadge({ timeLabel }: LiveBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-red-500 bg-red-50 border border-red-200 rounded-full px-2.5 py-0.5">
      <span
        className="w-1.5 h-1.5 bg-red-500 rounded-full"
        style={{ animation: 'livepulse 1.4s ease infinite' }}
      />
      {timeLabel} SP
    </span>
  );
}
