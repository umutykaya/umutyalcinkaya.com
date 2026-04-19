import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Activity, Flame, TrendingUp, Calendar } from "lucide-react";
import type { ContributionMatrix } from "@/types/github";

interface ActivityOverviewProps {
  data: ContributionMatrix | undefined;
  isLoading: boolean;
}

interface WeeklyDataPoint {
  week: string;
  contributions: number;
}

const ActivityOverview = ({ data, isLoading }: ActivityOverviewProps) => {
  const { t } = useTranslation();

  const { weeklyData, stats } = useMemo(() => {
    if (!data?.weeks.length) return { weeklyData: [], stats: null };

    const weeklyData: WeeklyDataPoint[] = data.weeks.map((week) => {
      const firstDay = week.days[0];
      const total = week.days.reduce((sum, d) => sum + d.count, 0);
      return {
        week: firstDay
          ? new Date(firstDay.date + "T00:00:00").toLocaleDateString(
              undefined,
              { month: "short", day: "numeric" },
            )
          : "",
        contributions: total,
      };
    });

    const allDays = data.weeks.flatMap((w) => w.days);
    const busiestDay = allDays.reduce(
      (max, d) => (d.count > max.count ? d : max),
      allDays[0],
    );

    // Current streak
    let streak = 0;
    const sortedDays = [...allDays].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    for (const day of sortedDays) {
      if (day.count > 0) streak++;
      else break;
    }

    const totalWeeks = weeklyData.length || 1;
    const avgPerWeek = Math.round(data.totalContributions / totalWeeks);

    return {
      weeklyData,
      stats: {
        busiestDay,
        streak,
        avgPerWeek,
      },
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl border border-border/50 bg-card">
        <div className="h-4 w-48 bg-secondary rounded mb-4 animate-pulse" />
        <div className="h-[200px] bg-secondary rounded animate-pulse" />
      </div>
    );
  }

  if (!data || !stats) return null;

  const statCards = [
    {
      icon: TrendingUp,
      label: t("github.activity.avgPerWeek"),
      value: stats.avgPerWeek,
    },
    {
      icon: Flame,
      label: t("github.activity.currentStreak"),
      value: `${stats.streak} ${t("github.activity.days")}`,
    },
    {
      icon: Calendar,
      label: t("github.activity.busiestDay"),
      value: stats.busiestDay
        ? new Date(stats.busiestDay.date + "T00:00:00").toLocaleDateString(
            undefined,
            { month: "short", day: "numeric" },
          )
        : "—",
    },
    {
      icon: Activity,
      label: t("github.activity.totalContributions"),
      value: data.totalContributions.toLocaleString(),
    },
  ];

  return (
    <div className="p-6 rounded-2xl border border-border/50 bg-card">
      <h3 className="text-sm font-medium text-foreground mb-4">
        {t("github.activity.title")}
      </h3>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {statCards.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex flex-col gap-1 p-3 rounded-xl bg-secondary/50"
          >
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Icon size={14} />
              <span className="text-[11px] font-medium">{label}</span>
            </div>
            <span className="text-lg font-semibold tabular-nums text-foreground">
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Area chart */}
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={weeklyData}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="contribGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--accent)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--accent)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              opacity={0.5}
            />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "var(--foreground)",
              }}
              labelStyle={{ color: "var(--muted-foreground)", marginBottom: 4 }}
              formatter={(value: number) => [
                value,
                t("github.activity.contributions"),
              ]}
            />
            <Area
              type="monotone"
              dataKey="contributions"
              stroke="var(--accent)"
              strokeWidth={2}
              fill="url(#contribGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityOverview;
