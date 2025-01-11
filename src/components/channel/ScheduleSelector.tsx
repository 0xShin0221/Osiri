import type React from "react";
import { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Tables, Database } from "@/types/database.types";

type NotificationSchedule = Tables<"notification_schedules">;
type NotificationPlatform =
  Database["public"]["Enums"]["notification_platform"];

interface ScheduleSelectorProps {
  platform: NotificationPlatform | "";
  schedules: NotificationSchedule[];
  value: string | null;
  onChange: (value: string | null) => void;
}

const ScheduleSelector: React.FC<ScheduleSelectorProps> = ({
  platform,
  schedules,
  value,
  onChange,
}) => {
  const { t } = useTranslation("channel");

  // Get user's browser timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const userUTCOffset = useMemo(() => {
    const offset = new Date().getTimezoneOffset();
    const hours = Math.abs(Math.floor(offset / 60));
    const direction = offset > 0 ? "-" : "+";
    return `UTC${direction}${hours}` as Database["public"]["Enums"]["utc_offset"];
  }, []);

  // Filter schedules based on platform and user's timezone
  const filteredSchedules = useMemo(() => {
    if (platform === "email") {
      // Email shows only scheduled notifications matching user's timezone
      return schedules.filter(
        (schedule) =>
          schedule.schedule_type === "daily_morning" &&
          schedule.timezone === userUTCOffset
      );
    }
    // All other platforms show only realtime option
    return schedules.filter(
      (schedule) => schedule.schedule_type === "realtime"
    );
  }, [platform, schedules, userUTCOffset]);

  // For platforms other than email, automatically select realtime schedule
  useEffect(() => {
    if (platform !== "email" && platform !== "") {
      const realtimeSchedule = schedules.find(
        (s) => s.schedule_type === "realtime"
      );
      if (realtimeSchedule && !value) {
        onChange(realtimeSchedule.id);
      }
    }
  }, [platform, schedules, onChange, value]);

  const getScheduleLabel = (schedule: NotificationSchedule) => {
    if (schedule.schedule_type === "realtime") {
      return t("schedules.realtime");
    }

    const timeStr = t("schedules.dailyMorningTime", { time: "7:00" });
    const tzInfo = `(${userTimezone})`;
    return `${timeStr} ${tzInfo}`;
  };

  const handleSelectOption = (scheduleId: string) => {
    onChange(scheduleId);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    scheduleId: string
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelectOption(scheduleId);
    }
  };

  // Always show UI, but disable selection for non-email platforms
  const isDisabled = platform !== "email" && platform !== "";

  return (
    <div className="grid gap-2">
      {filteredSchedules.map((schedule) => (
        <div
          key={schedule.id}
          className={`flex items-center p-3 rounded-md border cursor-pointer hover:bg-accent
            ${value === schedule.id ? "border-primary" : "border-muted"}
            ${isDisabled ? "opacity-75 cursor-not-allowed" : ""}`}
          onClick={() => !isDisabled && handleSelectOption(schedule.id)}
          onKeyDown={(e) => !isDisabled && handleKeyDown(e, schedule.id)}
          tabIndex={isDisabled ? -1 : 0}
          aria-pressed={value === schedule.id}
          aria-disabled={isDisabled}
        >
          <div className="flex-1">
            <div className="font-medium">{getScheduleLabel(schedule)}</div>
            <div className="text-sm text-muted-foreground">
              {schedule.schedule_type === "realtime"
                ? t("schedules.realtimeDescription")
                : t("schedules.dailyMorningDescription")}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleSelector;
