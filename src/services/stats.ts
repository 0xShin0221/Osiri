import { supabase } from "@/lib/supabase";
import {
    endOfMonth,
    endOfToday,
    startOfMonth,
    startOfToday,
    subDays,
} from "date-fns";

export interface WeeklyStats {
    date: string;
    completed: number;
}

export class StatsService {
    async getDailyCount(organizationId: string): Promise<number> {
        try {
            const { data, error } = await supabase
                .from("notification_logs")
                .select("id", { count: "exact" })
                .match({
                    organization_id: organizationId,
                    status: "success",
                })
                .gte("created_at", startOfToday().toISOString())
                .lte("created_at", endOfToday().toISOString());

            if (error) throw error;
            return data.length;
        } catch (error) {
            console.error("Error fetching daily count:", error);
            return 0;
        }
    }

    async getWeeklyStats(organizationId: string): Promise<WeeklyStats[]> {
        try {
            const stats: WeeklyStats[] = [];

            for (let i = 6; i >= 0; i--) {
                const date = subDays(new Date(), i);
                const start = new Date(date.setHours(0, 0, 0, 0));
                const end = new Date(date.setHours(23, 59, 59, 999));

                const { data, error } = await supabase
                    .from("notification_logs")
                    .select("id", { count: "exact" })
                    .match({
                        organization_id: organizationId,
                        status: "success",
                    })
                    .gte("created_at", start.toISOString())
                    .lte("created_at", end.toISOString());

                if (error) throw error;

                stats.push({
                    date: date.toISOString(),
                    completed: data.length,
                });
            }

            return stats;
        } catch (error) {
            console.error("Error fetching weekly stats:", error);
            return [];
        }
    }

    async getMonthlyCount(organizationId: string): Promise<number> {
        try {
            const { data, error } = await supabase
                .from("notification_logs")
                .select("id", { count: "exact" })
                .match({
                    organization_id: organizationId,
                    status: "success",
                })
                .gte("created_at", startOfMonth(new Date()).toISOString())
                .lte("created_at", endOfMonth(new Date()).toISOString());

            if (error) throw error;
            return data.length;
        } catch (error) {
            console.error("Error fetching monthly count:", error);
            return 0;
        }
    }
}
