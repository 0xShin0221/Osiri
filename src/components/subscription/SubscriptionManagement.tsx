// components/subscription/SubscriptionManagement.tsx
import { useTranslation } from "react-i18next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, CreditCard } from "lucide-react";
import type { Database } from "@/types/database.types";

type OrganizationSubscriptionStatus =
  Database["public"]["Views"]["organization_subscription_status"]["Row"];

interface SubscriptionManagementProps {
  organization: OrganizationSubscriptionStatus | null;
  onUpgrade: () => void;
  isUpgrading?: boolean;
}

export default function SubscriptionManagement({
  organization,
  onUpgrade,
  isUpgrading = false,
}: SubscriptionManagementProps) {
  const { t } = useTranslation("settings");
  const isTrialing = organization?.subscription_status === "trialing";
  const isActive = organization?.subscription_status === "active";
  const isPastDue = organization?.subscription_status === "past_due";

  const getStatusBadge = () => {
    if (isTrialing) {
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          <AlertCircle className="w-3 h-3 mr-1" />
          {t("subscription.status.trial")}
        </Badge>
      );
    }
    if (isActive) {
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          <CheckCircle2 className="w-3 h-3 mr-1" />
          {t("subscription.status.active")}
        </Badge>
      );
    }
    if (isPastDue) {
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          <AlertCircle className="w-3 h-3 mr-1" />
          {t("subscription.status.pastDue")}
        </Badge>
      );
    }
    return null;
  };

  const usagePercentage =
    organization?.notifications_used_this_month &&
    organization.max_notifications_per_day
      ? (organization.notifications_used_this_month /
          organization.max_notifications_per_day) *
        100
      : 0;

  return (
    <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm dark:bg-gray-950/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              {t("subscription.title")}
            </CardTitle>
            <CardDescription>{t("subscription.description")}</CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">
              {t("subscription.usage")}
            </span>
            <span className="text-sm font-medium">
              {organization?.notifications_used_this_month || 0} /{" "}
              {organization?.max_notifications_per_day || 0}
            </span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
        </div>

        <div className="grid gap-4">
          <div className="flex justify-between py-3 border-b">
            <span>{t("subscription.plan")}</span>
            <span className="font-medium">
              {organization?.plan_name || t("subscription.freePlan")}
            </span>
          </div>

          <div className="flex justify-between py-3 border-b">
            <span>{t("subscription.billingPeriod")}</span>
            <span className="font-medium">
              {organization?.subscription_end_date
                ? new Date(
                    organization.subscription_end_date
                  ).toLocaleDateString()
                : t("subscription.notApplicable")}
            </span>
          </div>

          {isTrialing && organization?.trial_end_date && (
            <div className="flex justify-between py-3 border-b">
              <span>{t("subscription.trialEnds")}</span>
              <span className="font-medium">
                {new Date(organization.trial_end_date).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          size="lg"
          onClick={onUpgrade}
          disabled={isUpgrading}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          {isTrialing
            ? t("subscription.upgradePlan")
            : t("subscription.manageBilling")}
        </Button>
      </CardFooter>
    </Card>
  );
}
