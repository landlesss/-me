import AnimatedNumber from "./AnimatedNumber";
import s from "./dashboard.module.scss";

const LABELS: Record<string, string> = {
  "us-east-1": "🇺🇸 US East",
  "eu-west-1": "🇪🇺 EU West",
  "ap-south-1": "🇮🇳 AP South",
  "us-west-2": "🇺🇸 US West",
};

type Props = {
  name: string;
  users: number;
  status: string;
  totalUsers: number;
};

export default function RegionCard({ name, users, status, totalUsers }: Props) {
  const pct = (users / totalUsers) * 100;
  const isHealthy = status === "healthy";
  const statusColor = isHealthy ? "#22c55e" : "#ef4444";

  return (
    <div className={s.regionCard}>
      <div className={s.regionTop}>
        <span className={s.regionName}>{LABELS[name] ?? name}</span>
        <span
          className={s.regionStatus}
          style={{ color: statusColor, background: `${statusColor}15` }}
        >
          {status}
        </span>
      </div>
      <div className={s.regionUsers}>
        <AnimatedNumber value={users} />
      </div>
      <div className={s.regionProgressWrap}>
        <div className={s.regionProgress} style={{ width: `${pct}%` }} />
      </div>
      <div className={s.regionPct}>{pct.toFixed(1)}% of traffic</div>
    </div>
  );
}
