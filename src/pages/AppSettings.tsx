import { Building2, CreditCard, Wallet } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useOrganization } from "@/hooks/useOrganization";

import { OrganizationMembers } from "@/components/settings/OrganizationMembers";
import { useTranslation } from "react-i18next";
import { OrganizationSettings } from "@/components/settings/OrganizationSettings";
import { CreateOrganization } from "@/components/settings/CreateOrganization";
import { useSubscription } from "@/hooks/useSubscription";
import SubscriptionPlans from "@/components/subscription/SubscriptionPlans";
import CustomerPortal from "@/components/settings/CustomerPortal";
import { SettingsSkeleton } from "@/components/settings/SettingsSkelton";
import { SubscriptionSkeleton } from "@/components/settings/SubscriptionSkelton";

export default function AppSettingsPage() {
  const { t } = useTranslation("settings");
  const {
    organization,
    isLoading: orgLoading,
    error: orgError,
    createOrganization,
    updateOrganization,
  } = useOrganization();

  const {
    isLoading: subLoading,
    plans,
    handleCheckout,
    handlePortal,
  } = useSubscription();

  // Show loading state while fetching initial organization data
  if (orgLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <SettingsSkeleton />
        </div>
      </div>
    );
  }

  // Show organization creation form if no organization exists
  if (!organization) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <CreateOrganization
            error={orgError}
            onCreateOrganization={createOrganization}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            {t("settings.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("settings.description")}
          </p>
        </div>

        <Tabs defaultValue="organization" className="space-y-4">
          <TabsList className="bg-white/50 backdrop-blur-sm dark:bg-gray-950/50 border-0">
            <TabsTrigger
              value="organization"
              className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/20"
            >
              <Building2 className="w-4 h-4 mr-2" />
              {t("tabs.organization")}
            </TabsTrigger>
            <TabsTrigger
              value="subscription"
              className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/20"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {t("tabs.subscription")}
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/20"
            >
              <Wallet className="w-4 h-4 mr-2" />
              {t("tabs.billing")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="organization" className="space-y-8">
            <OrganizationSettings
              organization={organization}
              error={orgError}
              onUpdateOrganization={updateOrganization}
            />
            <OrganizationMembers organizationId={organization.id!} />
          </TabsContent>

          <TabsContent value="subscription">
            {subLoading ? (
              <SubscriptionSkeleton />
            ) : (
              <SubscriptionPlans
                plans={plans}
                onCancel={handlePortal}
                onSubscribe={handleCheckout}
                organization={organization}
                isLoading={subLoading}
              />
            )}
          </TabsContent>

          <TabsContent value="billing">
            <CustomerPortal
              onOpenPortal={handlePortal}
              isLoading={subLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
