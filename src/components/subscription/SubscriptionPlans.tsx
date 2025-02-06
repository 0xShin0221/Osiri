import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { Database } from "@/types/database.types";
import { formatPrice } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle2, CreditCard } from "lucide-react";
import { Currency } from "@/lib/i18n/languages";

type SubscriptionPlanWithPricing =
  Database["public"]["Views"]["subscription_plans_with_pricing"]["Row"];
type OrganizationSubscriptionStatus =
  Database["public"]["Views"]["organization_subscription_status"]["Row"];

interface SubscriptionPlansProps {
  organization: OrganizationSubscriptionStatus | null;
  plans: SubscriptionPlanWithPricing[] | null;
  onSubscribe: (priceId: string) => Promise<void>;
  onCancel: () => Promise<void>;
  isLoading: boolean;
}

function formatPlanName(name: string): string {
  return name.replace(/\([a-z]{2}\)$/, "").trim();
}

export default function SubscriptionPlans({
  organization,
  plans,
  onSubscribe,
  onCancel,
  isLoading,
}: SubscriptionPlansProps) {
  const { t } = useTranslation("settings");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const isTrialing = organization?.subscription_status === "trialing";
  const isActive = organization?.stripe_status === "active";
  const isPastDue = organization?.subscription_status === "past_due";
  const hasScheduledCancellation =
    organization?.will_cancel && organization.will_cancel !== "false";
  const hasActivePlan = Boolean(
    organization?.stripe_product_id || !organization?.will_cancel == null
  );
  const usagePercentage =
    organization?.notifications_used_this_month &&
    organization?.base_notifications_per_day
      ? (organization.notifications_used_this_month /
          (organization.base_notifications_per_day * 30)) *
        100
      : 0;

  const handleSubscribe = async () => {
    if (!selectedPlan || selectedPlan === organization?.stripe_product_id)
      return;

    try {
      setIsProcessing(true);
      setError(null);
      await onSubscribe(selectedPlan);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("subscription.error.unknown")
      );
    } finally {
      setIsProcessing(false);
    }
  };
  const handleCancel = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      await onCancel();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("subscription.error.unknown")
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlanClick = (planId: string) => {
    if (isProcessing) return;

    setError(null);

    if (selectedPlan === planId) {
      setSelectedPlan(null);
      return;
    }

    setSelectedPlan(planId);
  };

  const getStatusBadge = () => {
    if (isActive) {
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800"
        >
          <CheckCircle2 className="w-3 h-3 mr-1" />
          {t("subscription.status.active")}
        </Badge>
      );
    }
    if (isTrialing) {
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800"
        >
          <AlertCircle className="w-3 h-3 mr-1" />
          {t("subscription.status.trial")}
        </Badge>
      );
    }
    if (isPastDue) {
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800"
        >
          <AlertCircle className="w-3 h-3 mr-1" />
          {t("subscription.status.pastDue")}
        </Badge>
      );
    }
    return null;
  };

  const renderPlan = (plan: SubscriptionPlanWithPricing) => {
    const isCurrentPlan =
      plan.stripe_product_id === organization?.stripe_product_id;
    const isSelected = plan.stripe_product_id === selectedPlan;
    const isFreePlan = plan.sort_order === 1;

    return (
      <div
        key={plan.id}
        onClick={() =>
          !isFreePlan &&
          plan.stripe_product_id &&
          handlePlanClick(plan.stripe_product_id)
        }
        className={`
          p-4 border rounded-lg transition-all
          dark:border-gray-700 
          ${
            !isFreePlan
              ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              : ""
          }
          ${
            isSelected && !isFreePlan
              ? "border-blue-500 ring-1 ring-blue-500 dark:border-blue-400 dark:ring-blue-400"
              : ""
          }
          ${
            isCurrentPlan
              ? "border-blue-200 bg-blue-50 dark:bg-blue-900/20"
              : ""
          }
        `}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium">
                {formatPlanName(plan.name || "")}
              </span>
              {isCurrentPlan && (
                <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-100">
                  {t("subscription.currentPlan")}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {plan.description}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">
              {isFreePlan
                ? t("subscription.free")
                : formatPrice(
                    plan.base_price_amount ?? 0,
                    (plan.base_price_currency as Currency) ?? "usd"
                  )}
            </div>
            {!isFreePlan && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t("subscription.perMonth")}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="text-sm font-semibold mb-2">
            {t("subscription.features")}:
          </div>
          <ul className="space-y-2">
            <li className="flex items-center text-sm">
              <span className="mr-2 text-green-600 dark:text-green-400">✓</span>
              {t("subscription.notificationsPerDay", {
                count: plan.base_notifications_per_day ?? 0,
              })}
            </li>
            {plan.has_usage_billing && (
              <li className="flex items-center text-sm">
                <span className="mr-2 text-green-600 dark:text-green-400">
                  ✓
                </span>
                {t("subscription.payAsYouGo")}
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  };

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
        {/* Current Usage Section */}
        <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-900/50">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {t("subscription.usage")}
            </span>
            <span className="text-sm font-medium">
              {organization?.notifications_used_this_month || 0} /{" "}
              {(organization?.base_notifications_per_day || 0) * 30}
            </span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
        </div>

        {/* Subscription Details */}
        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-300">
              {t("subscription.plan")}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {organization?.plan_name || t("subscription.freePlan")}
              </span>
              {(isActive || isTrialing) &&
                hasActivePlan &&
                !hasScheduledCancellation && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isProcessing}
                  >
                    {t("subscription.cancel")}
                  </Button>
                )}
            </div>
          </div>

          <div className="flex justify-between py-3 border-b dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-300">
              {t("subscription.billingPeriod")}
            </span>
            <span className="font-medium">
              {organization?.subscription_end_date
                ? new Date(
                    organization.subscription_end_date
                  ).toLocaleDateString()
                : t("subscription.notApplicable")}
            </span>
          </div>

          {organization?.will_cancel && (
            <div className="flex justify-between py-3 border-b dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-300">
                {t("subscription.cancelDate")}
              </span>
              <span className="font-medium">
                {new Date(organization.will_cancel).toLocaleDateString()}
              </span>
            </div>
          )}

          {isTrialing && organization?.trial_end_date && (
            <div className="flex justify-between py-3 border-b dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-300">
                {t("subscription.trialEnds")}
              </span>
              <span className="font-medium">
                {new Date(organization.trial_end_date).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        <Separator className="my-6" />

        {/* Plans Selection */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">
              {t("subscription.selectPlanTitle")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("subscription.selectPlanDescription")}
            </p>
          </div>

          <div className="grid gap-4">
            {plans?.map((plan) => renderPlan(plan))}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>

      {selectedPlan && selectedPlan !== organization?.stripe_product_id && (
        <CardFooter className="flex justify-end">
          <Button
            onClick={handleSubscribe}
            disabled={isLoading || isProcessing}
            size="lg"
            className="w-full sm:w-auto"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {isLoading || isProcessing
              ? t("subscription.processing")
              : isTrialing
              ? t("subscription.upgradePlan")
              : t("subscription.changePlan")}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
