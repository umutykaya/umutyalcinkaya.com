import { useTranslation } from "react-i18next";
import { useRateLimit } from "@/lib/rateLimit";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const RateLimitIndicator = () => {
  const { t } = useTranslation();
  const { remaining, limit, resetAt } = useRateLimit();

  if (limit < 0) return null;

  const ratio = remaining / Math.max(limit, 1);
  const color =
    ratio > 0.5
      ? "bg-green-500/15 text-green-500 border-green-500/30"
      : ratio > 0.2
        ? "bg-yellow-500/15 text-yellow-500 border-yellow-500/30"
        : "bg-red-500/15 text-red-500 border-red-500/30";

  const resetDate = new Date(resetAt * 1000);
  const resetStr = resetDate.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border tabular-nums ${color}`}
        >
          API {remaining}/{limit}
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {t("github.rateLimit.resetsAt")} {resetStr}
      </TooltipContent>
    </Tooltip>
  );
};

export default RateLimitIndicator;
