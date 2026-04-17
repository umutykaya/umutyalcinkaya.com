import type { ComplexityTier } from "@/types/github";

const TIER_STYLES: Record<ComplexityTier, string> = {
  Expert: "bg-red-500/15 text-red-500 border-red-500/30",
  Advanced: "bg-orange-500/15 text-orange-500 border-orange-500/30",
  Moderate: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30",
  Standard: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  Starter: "bg-gray-500/15 text-gray-400 border-gray-500/30",
};

interface ComplexityBadgeProps {
  tier: ComplexityTier;
  score: number;
}

const ComplexityBadge = ({ tier, score }: ComplexityBadgeProps) => (
  <span
    className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md border ${TIER_STYLES[tier]}`}
  >
    {tier}
    <span className="opacity-70 tabular-nums">{Math.round(score)}</span>
  </span>
);

export default ComplexityBadge;
