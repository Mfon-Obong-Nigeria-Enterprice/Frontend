import { Progress } from "@/components/ui/progress";
import { getProgressColor } from "@/lib/utils";

interface HealthMetricProps {
  title: string;
  value: number;
  unit: string;
  isDatabase?: boolean;
}

export function HealthMetric({ title, value, unit, isDatabase = false }: HealthMetricProps) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span>{title}</span>
        <span>{value}{unit}</span>
      </div>
      <Progress
  value={isDatabase ? Math.min(value, 100) : value}
  className={`h-2 ${getProgressColor(value, isDatabase)}`}
/>

    </div>
  );
}