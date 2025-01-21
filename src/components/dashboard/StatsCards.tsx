import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { format, subDays } from "date-fns";
import { Bell, Calendar, FileText } from "lucide-react";
import type { WeeklyStats } from "@/services/stats";

interface StatsCardsProps {
  dailyCount: number;
  weeklyStats: WeeklyStats[];
  monthlyCount: number;
}

export function StatsCards({
  dailyCount,
  weeklyStats,
  monthlyCount,
}: StatsCardsProps) {
  const { t } = useTranslation("dashboard");
  const weeklyTotal = weeklyStats.reduce(
    (sum, stat) => sum + stat.completed,
    0
  );

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Today's Stats */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Bell className="h-4 w-4" />
            {t("stats.today.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="text-3xl font-bold">
              {dailyCount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {format(new Date(), "yyyy/MM/dd")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Total */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t("stats.week.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="text-3xl font-bold">
              {weeklyTotal.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {format(subDays(new Date(), 6), "M/d")} -{" "}
              {format(new Date(), "M/d")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Total */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t("stats.month.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="text-3xl font-bold">
              {monthlyCount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {format(new Date(), "yyyy/MM")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
