interface BadgeProps {
  label: string;
  color: string;
  className?: string;
}

export function Badge({ label, color, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${className}`}
      style={{
        background: `${color}18`,
        color,
        border: `1px solid ${color}33`,
      }}
    >
      {label}
    </span>
  );
}
