import { TrendingUp } from "lucide-react";

export default function GamificationBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-info bg-info/10 ${className}`}>
      <TrendingUp className="h-3 w-3" /> %↑
    </span>
  );
}
