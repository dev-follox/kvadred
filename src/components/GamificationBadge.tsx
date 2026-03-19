import { TrendingUp } from "lucide-react";

export default function GamificationBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary ${className}`}>
      <TrendingUp className="h-3 w-3" /> %↑
    </span>
  );
}
