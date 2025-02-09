import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Building2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Database } from "@/types/database.types";

type OrganizationSubscriptionStatusRow =
  Database["public"]["Views"]["organization_subscription_status"]["Row"];

interface CreateOrganizationProps {
  error?: string | null;
  onCreateOrganization: (
    name: string
  ) => Promise<OrganizationSubscriptionStatusRow | null>;
}

export function CreateOrganization({
  error,
  onCreateOrganization,
}: CreateOrganizationProps) {
  const { t } = useTranslation("settings");
  const [newOrgName, setNewOrgName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateOrganization = async () => {
    if (!newOrgName.trim()) return;

    setIsSubmitting(true);
    try {
      await onCreateOrganization(newOrgName.trim());
      setNewOrgName("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm dark:bg-gray-950/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-500" />
          {t("organization.create.title")}
        </CardTitle>
        <CardDescription>
          {t("organization.create.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="orgName">{t("organization.nameLabel")}</Label>
            <Input
              id="orgName"
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              placeholder={t("organization.namePlaceholder")}
            />
          </div>
          <Alert
            variant="destructive"
            className="border-red-200 bg-red-50 dark:bg-red-950/50"
          >
            <AlertDescription>
              {t("organization.create.require")}
            </AlertDescription>
          </Alert>
          {error && (
            <Alert
              variant="destructive"
              className="border-red-200 bg-red-50 dark:bg-red-950/50"
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button
            onClick={handleCreateOrganization}
            disabled={isSubmitting || !newOrgName.trim()}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            {t("organization.create.button")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
