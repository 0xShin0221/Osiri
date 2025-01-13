import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Building2, Pencil, X, Check } from "lucide-react";
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

type Organization = Database["public"]["Tables"]["organizations"]["Row"];

interface OrganizationSettingsProps {
  organization: {
    id: string;
    name: string;
  };
  error?: string | null;
  onUpdateOrganization: (
    data: Partial<Organization>
  ) => Promise<Organization | null>;
}

export function OrganizationSettings({
  organization,
  error,
  onUpdateOrganization,
}: OrganizationSettingsProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStartEditing = () => {
    setNewOrgName(organization.name);
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setNewOrgName("");
  };

  const handleUpdateOrganization = async () => {
    if (!newOrgName.trim()) return;

    setIsSubmitting(true);
    try {
      await onUpdateOrganization(newOrgName.trim());
      setIsEditing(false);
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
          {t("organization.settings.title")}
        </CardTitle>
        <CardDescription>
          {t("organization.settings.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div>
            <Label>{t("organization.nameLabel")}</Label>
            <div className="mt-1.5">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={newOrgName}
                    onChange={(e) => setNewOrgName(e.target.value)}
                    placeholder={organization.name}
                    className="max-w-md"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleUpdateOrganization}
                    disabled={isSubmitting || !newOrgName.trim()}
                    className="hover:bg-green-100 dark:hover:bg-green-900/20"
                  >
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleCancelEditing}
                    disabled={isSubmitting}
                    className="hover:bg-red-100 dark:hover:bg-red-900/20"
                  >
                    <X className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-lg">{organization.name}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleStartEditing}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          {error && (
            <Alert
              variant="destructive"
              className="border-red-200 bg-red-50 dark:bg-red-950/50"
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
