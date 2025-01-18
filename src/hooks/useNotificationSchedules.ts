import { useCallback, useEffect, useMemo, useState } from "react";

import type { Database, Tables } from "@/types/database.types";
import { supabase } from "@/lib/supabase";

type NotificationSchedule = Tables<"notification_schedules">;
type NotificationPlatform =
  Database["public"]["Enums"]["notification_platform"];

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

export const useFilteredSchedules = (
  schedules: NotificationSchedule[],
  platform: NotificationPlatform | ""
) => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const utcOffset = useMemo(() => {
    const offset = new Date().getTimezoneOffset();
    const hours = Math.abs(Math.floor(offset / 60));
    const direction = offset > 0 ? "-" : "+";
    return `UTC${direction}${hours}` as Database["public"]["Enums"]["utc_offset"];
  }, []);

  const filteredSchedules = useMemo(() => {
    if (!platform) return [];

    if (platform === "email") {
      return schedules.filter(
        (s) => s.schedule_type === "daily_morning" && s.timezone === utcOffset
      );
    }

    return schedules.filter((s) => s.schedule_type === "realtime");
  }, [platform, schedules, utcOffset]);

  const defaultScheduleId = useMemo(() => {
    return filteredSchedules[0]?.id ?? null;
  }, [filteredSchedules]);

  return {
    filteredSchedules,
    defaultScheduleId,
    userTimezone,
  };
};
