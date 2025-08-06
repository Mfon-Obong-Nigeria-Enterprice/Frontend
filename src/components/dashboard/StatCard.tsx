import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { StatCardProps } from "@/types/stats";

export const StatCard = ({
  title,
  value,
  icon,
  change,
  note,
  className,
}: StatCardProps) => {
  return (
    <section className={cn("rounded-2xl border p-4 shadow-sm", className)}>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{title}</span>
        {icon}
      </div>

      <div className="mt-2 text-2xl font-bold text-primary">{value}</div>

      {change && (
        <div
          className={cn(
            "mt-1 flex items-center gap-1 text-sm",
            change.type === "up" ? "text-green-600" : "text-red-600"
          )}
        >
          {change.type === "up" ? (
            <ArrowUpRight size={16} />
          ) : (
            <ArrowDownRight size={16} />
          )}
          <span>{change.value}</span>
          {change.label && <span className="">{change.label}</span>}
        </div>
      )}
      {note && <div>{note}</div>}
    </section>
  );
};
