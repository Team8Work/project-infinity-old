import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import * as chart from "@/components/ui/chart";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  actions?: React.ReactNode;
}

export default function ChartCard({
  title,
  children,
  footer,
  actions,
}: ChartCardProps) {
  return (
    <Card>
      <CardHeader className="p-5 pb-0 border-b border-border flex justify-between items-center space-y-0">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <div className="flex space-x-2">
          {actions || (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0 text-neutral-light hover:text-neutral"
            >
              <EllipsisVertical className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-5">
        {children}
      </CardContent>
      {footer && (
        <div className="p-4 border-t border-border">
          {footer}
        </div>
      )}
    </Card>
  );
}
