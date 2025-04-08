import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeText?: string;
  positive?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export default function StatCard({
  title,
  value,
  change,
  changeText = "from last month",
  positive = true,
  icon,
  className,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-border shadow-sm p-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-neutral-light text-sm">{title}</p>
          <h3 className="text-2xl font-semibold mt-2">{value}</h3>
          {change !== undefined && (
            <p className={cn(
              "text-sm flex items-center mt-1",
              positive ? "text-secondary" : "text-danger"
            )}>
              {positive ? (
                <ArrowUp className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4" />
              )}
              <span>{change}% {changeText}</span>
            </p>
          )}
        </div>
        {icon && (
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            className
          )}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
