import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeeklyStats } from "@/services/stats";
import { useTranslation } from "react-i18next";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface WeeklyChartProps {
  weeklyStats: WeeklyStats[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  const { t } = useTranslation("dashboard");

  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-4 shadow-sm">
        <p className="font-medium mb-2">{label}</p>
        <p className="text-sm flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: "#22c55e" }}
          />
          {t("stats.weekly.completed")}: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export function WeeklyChart({ weeklyStats }: WeeklyChartProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          {t("stats.weekly.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyStats}>
              <defs>
                <linearGradient
                  id="completedGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                fontSize={12}
                stroke="#888888"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                fontSize={12}
                stroke="#888888"
              />
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="#22c55e"
                strokeWidth={2}
                fill="url(#completedGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-end mt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            {t("stats.weekly.completed")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
