type Props = { data: number[]; color: string; height?: number };

export default function MiniChart({ data, color, height = 56 }: Props) {
  if (!data.length) return null;

  const min = Math.min(...data);
  const max = Math.max(...data) || 1;
  const W = 200;
  const H = height;
  const gradId = `grad-${color.replace("#", "")}`;

  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / (max - min + 0.001)) * H}`)
    .join(" ");

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <polygon points={`0,${H} ${pts} ${W},${H}`} fill={`url(#${gradId})`} />
    </svg>
  );
}
