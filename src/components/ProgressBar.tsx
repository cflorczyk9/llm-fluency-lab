interface ProgressBarProps {
  value: number; // 0..100
  slim?: boolean;
  color?: string; // optional override (e.g. var(--accent2))
}

export default function ProgressBar({ value, slim = false, color }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={`progress${slim ? ' slim' : ''}`}>
      <i style={{ width: `${pct}%`, ...(color ? { background: color } : {}) }} />
    </div>
  );
}
