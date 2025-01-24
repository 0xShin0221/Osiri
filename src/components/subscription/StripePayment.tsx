import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { Database } from "@/types/database.types";
type SubscriptionPlanLimits =
  Database["public"]["Tables"]["subscription_plan_limits"]["Row"];

type SubscriptionPlan =
  Database["public"]["Tables"]["subscription_plans"]["Row"] & {
    subscription_plan_limits: Pick<
      SubscriptionPlanLimits,
      "max_notifications_per_day" | "usage_rate"
    > | null;
  };

interface StripePaymentProps {
  isOpen: boolean;
  onClose: () => void;
  plans: SubscriptionPlan[] | null;
  onSubscribe: (priceId: string) => Promise<void>;
  currentPlanId: string | null;
  isLoading: boolean;
}

export default function StripePayment({
  isOpen,
  onClose,
  plans,
  onSubscribe,
  currentPlanId,
  isLoading,
}: StripePaymentProps) {
  const { t } = useTranslation("settings");
  const [selectedPlan, setSelectedPlan] = useState<string>(currentPlanId || "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) {
      setError(t("subscription.selectPlan"));
      return;
    }

    try {
      await onSubscribe(selectedPlan);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("subscription.error.unknown")
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("subscription.titleUpgrade")}</DialogTitle>
          <DialogDescription>
            {t("subscription.descriptionSelect")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <RadioGroup
            value={selectedPlan}
            onValueChange={setSelectedPlan}
            className="grid gap-4"
          >
            {plans?.map((plan) => (
              <div key={plan.id} className="relative">
                <RadioGroupItem
                  value={plan.id}
                  id={plan.id}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={plan.id}
                  className="flex flex-col p-4 border rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:ring-1 peer-checked:ring-blue-500"
                >
                  <div className="flex justify-between">
                    <span className="text-lg font-medium">{plan.name}</span>
                    <span className="text-lg font-bold">
                      ${plan.base_notifications_per_day}
                      {t("subscription.perMonth")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {plan.description}
                  </p>
                  <div className="mt-4 text-sm">
                    <div className="font-semibold">
                      {t("subscription.features")}:
                    </div>
                    <ul className="mt-2 space-y-1">
                      <li className="flex items-center">
                        <span className="mr-2">✓</span>
                        {t("subscription.notificationsPerDay", {
                          count: plan.base_notifications_per_day,
                        })}
                      </li>
                      {plan.has_usage_billing && (
                        <li className="flex items-center">
                          <span className="mr-2">✓</span>
                          {t("subscription.payAsYouGo")}
                        </li>
                      )}
                    </ul>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={!selectedPlan || isLoading}>
              {isLoading
                ? t("subscription.processing")
                : t("subscription.upgrade")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
