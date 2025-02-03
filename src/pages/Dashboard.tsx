import { useOrganization } from "@/hooks/useOrganization";
import { useStats } from "@/hooks/useStats";
import { useSubscription } from "@/hooks/useSubscription";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { WeeklyChart } from "@/components/dashboard/WeeklyChart";
import { NotificationList } from "@/components/dashboard/NotificationList";
import { useTranslations } from "@/hooks/useTranslations";
import { PageLoading } from "@/components/ui/page-loading";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SubscriptionBanner from "@/components/subscription/SubscriptionBanner";

export function Dashboard() {
  const { organization, hasScheduledCancellation } = useOrganization();
  const { handlePortal } = useSubscription();
  const navigate = useNavigate();
  const { i18n } = useTranslation("dashboard");

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
    return <PageLoading />;
  }

  const handleUpgrade = () => {
    navigate("/settings/subscription");
  };

  const handleManage = async () => {
    try {
      await handlePortal();
    } catch (error) {
      console.error("Failed to open billing portal:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        {organization && (
          <SubscriptionBanner
            status={organization.subscription_status ?? "trialing"}
            trialEndDate={organization.trial_end_date}
            willCancel={hasScheduledCancellation()}
            onUpgrade={handleUpgrade}
            onManage={handleManage}
            locale={i18n.language}
          />
        )}

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
