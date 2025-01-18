import type React from "react";
import { useTranslation } from "react-i18next";
import type { Tables } from "@/types/database.types";

type NotificationSchedule = Tables<"notification_schedules">;

interface ScheduleSelectorProps {
  schedules: NotificationSchedule[];
  value: string | null;
  onChange: (value: string) => void;
  isDisabled?: boolean;
  userTimezone: string;
}

const ScheduleSelector: React.FC<ScheduleSelectorProps> = ({
  schedules,
  value,
  onChange,
  isDisabled = false,
  userTimezone,
}) => {
  const { t } = useTranslation("channel");

  const getScheduleLabel = (schedule: NotificationSchedule) => {
    if (schedule.schedule_type === "realtime") {
      return t("schedules.realtime");
    }

    const timeStr = t("schedules.dailyMorningTime", { time: "8:00" });
    const tzInfo = `(${userTimezone})`;
    return `${timeStr} ${tzInfo}`;
  };

  return (
    <div className="grid gap-2">
      {schedules.map((schedule) => (
        <div
          key={schedule.id}
          className={`flex items-center p-3 rounded-md border cursor-pointer hover:bg-accent
            ${value === schedule.id ? "border-primary" : "border-muted"}
            ${isDisabled ? "opacity-75 cursor-not-allowed" : ""}`}
          onClick={() => !isDisabled && onChange(schedule.id)}
          onKeyDown={(e) => {
            if (!isDisabled && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              onChange(schedule.id);
            }
          }}
          aria-checked={value === schedule.id}
          tabIndex={isDisabled ? -1 : 0}
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
