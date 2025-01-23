import { useOrganization } from "@/hooks/useOrganization";
import { useStats } from "@/hooks/useStats";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { WeeklyChart } from "@/components/dashboard/WeeklyChart";
import { NotificationList } from "@/components/dashboard/NotificationList";
import { useTranslations } from "@/hooks/useTranslations";

export function Dashboard() {
  const { organization } = useOrganization();
  const {
    dailyCount,
    weeklyStats,
    monthlyCount,
    loading: statsLoading,
  } = useStats({
    organizationId: organization?.id,
  });

  const { translations, loading: translationsLoading } = useTranslations({
    organizationId: organization?.id,
  });

  if (statsLoading || translationsLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <StatsCards
          dailyCount={dailyCount}
          weeklyStats={weeklyStats}
          monthlyCount={monthlyCount}
        />
        <WeeklyChart weeklyStats={weeklyStats} />
        <NotificationList translations={translations} />
      </div>
    </div>
  );
}
