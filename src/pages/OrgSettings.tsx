import { Building2, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useOrganization } from "@/hooks/useOrganization";
import { PageLoading } from "@/components/ui/page-loading";
import { OrganizationMembers } from "@/components/settings/OrganizationMembers";
import { useTranslation } from "react-i18next";
import { OrganizationSettings } from "@/components/settings/OrganizationSettings";
import { CreateOrganization } from "@/components/settings/CreateOrganization";

export default function OrgSettingsPage() {
  const { t } = useTranslation("settings");
  const {
    organization,
    isLoading,
    error: orgError,
    createOrganization,
    updateOrganization,
  } = useOrganization();

  if (isLoading) {
    return <PageLoading />;
  }

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
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              {t("settings.title")}
            </h1>
          </div>
          <p className="text-muted-foreground">{t("settings.description")}</p>
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
              value="members"
              className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/20"
            >
              <Users className="w-4 h-4 mr-2" />
              {t("tabs.members")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="organization" className="space-y-4">
            <OrganizationSettings
              organization={organization}
              error={orgError}
              onUpdateOrganization={updateOrganization}
            />
          </TabsContent>

          <TabsContent value="members">
            <OrganizationMembers organizationId={organization.id!} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
