import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ContributionMatrix } from "@/types/github";

interface ContributionHeatmapProps {
  data: ContributionMatrix | undefined;
  isLoading: boolean;
}

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

const ContributionHeatmap = ({ data, isLoading }: ContributionHeatmapProps) => {
  const { t } = useTranslation();

  const monthLabels = useMemo(() => {
    if (!data?.weeks.length) return [];
    const labels: { label: string; col: number }[] = [];
    let lastMonth = -1;
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    data.weeks.forEach((week, i) => {
      const firstDay = week.days[0];
      if (!firstDay) return;
      const month = new Date(firstDay.date).getMonth();
      if (month !== lastMonth) {
        labels.push({ label: monthNames[month], col: i });
        lastMonth = month;
      }
    });

    return labels;
  }, [data]);

  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl border border-border/50 bg-card">
        <div className="h-4 w-48 bg-secondary rounded mb-4 animate-pulse" />
        <div className="h-[120px] bg-secondary rounded animate-pulse" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-6 rounded-2xl border border-border/50 bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">
          <span className="tabular-nums">{data.totalContributions.toLocaleString()}</span>{" "}
          {t("github.heatmap.contributions")}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block">
          {/* Month labels */}
          <div
            className="grid gap-[3px] mb-1"
            style={{
              gridTemplateColumns: `24px repeat(${data.weeks.length}, 13px)`,
            }}
          >
            <div />
            {data.weeks.map((_, i) => {
              const label = monthLabels.find((m) => m.col === i);
              return (
                <div
                  key={i}
                  className="text-[10px] text-muted-foreground leading-none"
                >
                  {label?.label ?? ""}
                </div>
              );
            })}
          </div>

          {/* Grid: day labels + cells */}
          <div
            className="grid gap-[3px]"
            style={{
              gridTemplateColumns: `24px repeat(${data.weeks.length}, 13px)`,
              gridTemplateRows: "repeat(7, 13px)",
            }}
          >
            {Array.from({ length: 7 }).map((_, dayIdx) => (
              <div
                key={`label-${dayIdx}`}
                className="text-[10px] text-muted-foreground flex items-center leading-none"
                style={{ gridColumn: 1, gridRow: dayIdx + 1 }}
              >
                {DAY_LABELS[dayIdx]}
              </div>
            ))}

            {data.weeks.map((week, weekIdx) =>
              week.days.map((day, dayIdx) => (
                <Tooltip key={`${weekIdx}-${dayIdx}`}>
                  <TooltipTrigger asChild>
                    <div
                      className="rounded-sm cursor-default transition-colors"
                      style={{
                        gridColumn: weekIdx + 2,
                        gridRow: dayIdx + 1,
                        backgroundColor: `var(--contrib-${day.level})`,
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="text-xs"
                  >
                    <span className="tabular-nums font-medium">{day.count}</span>{" "}
                    {t("github.heatmap.contributionsOn")}{" "}
                    {new Date(day.date + "T00:00:00").toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TooltipContent>
                </Tooltip>
              )),
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1 mt-4 text-[10px] text-muted-foreground">
        <span>{t("github.heatmap.less")}</span>
        {([0, 1, 2, 3, 4] as const).map((level) => (
          <div
            key={level}
            className="w-[13px] h-[13px] rounded-sm"
            style={{ backgroundColor: `var(--contrib-${level})` }}
          />
        ))}
        <span>{t("github.heatmap.more")}</span>
      </div>
    </div>
  );
};

export default ContributionHeatmap;
