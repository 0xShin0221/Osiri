import { useEffect, useState } from "react";
import { format } from "date-fns";
import { StatsService, WeeklyStats } from "@/services/stats";

interface UseStatsOptions {
    organizationId?: string;
}

export function useStats({ organizationId }: UseStatsOptions) {
    const [dailyCount, setDailyCount] = useState(0);
    const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);
    const [monthlyCount, setMonthlyCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const statsService = new StatsService();

    const fetchStats = async () => {
        if (!organizationId) return;

        setLoading(true);
        try {
            const [daily, weekly, monthly] = await Promise.all([
                statsService.getDailyCount(organizationId),
                statsService.getWeeklyStats(organizationId),
                statsService.getMonthlyCount(organizationId),
            ]);

            setDailyCount(daily);
            setWeeklyStats(weekly.map((stat) => ({
                ...stat,
                date: format(new Date(stat.date), "M/d"),
            })));
            setMonthlyCount(monthly);
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [organizationId]);

    return {
        dailyCount,
        weeklyStats,
        monthlyCount,
        loading,
        refetch: fetchStats,
    };
}
