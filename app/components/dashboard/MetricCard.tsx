import AnimatedNumber from "./AnimatedNumber";
import s from "./dashboard.module.scss";

type Props = {
  label: string;
  value: number;
  unit: string;
  color: string;
  decimals?: number;
};

export default function MetricCard({ label, value, unit, color, decimals = 0 }: Props) {
  return (
    <div className={s.metricCard}>
      <div className={s.metricTitle}>{label}</div>
      <div className={s.metricValue} style={{ color }}>
        <AnimatedNumber value={value} decimals={decimals} />{unit}
      </div>
      <div className={s.metricBar} style={{ background: `${color}30` }}>
        <div
          className={s.metricBarFill}
          style={{ background: color, width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  );
}
