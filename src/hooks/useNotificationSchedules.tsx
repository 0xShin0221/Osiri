import { useCallback, useEffect, useState } from "react";

import type { Tables } from "@/types/database.types";
import { supabase } from "@/lib/supabase";

type NotificationSchedule = Tables<"notification_schedules">;

export const useNotificationSchedules = () => {
  const [schedules, setSchedules] = useState<NotificationSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("notification_schedules")
        .select("*")
        .order("schedule_type", { ascending: true });

      if (fetchError) throw fetchError;

      setSchedules(data || []);
    } catch (err) {
      console.error("Error fetching notification schedules:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch schedules"
      );
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  return {
    schedules,
    loading,
    error,
    refetch: fetchSchedules,
  };
};
