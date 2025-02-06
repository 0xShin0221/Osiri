import { useSubscription } from "@/hooks/useSubscription";
import { useOrganization } from "@/hooks/useOrganization";
import SubscriptionPlans from "@/components/subscription/SubscriptionPlans";
import { CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SubscriptionPage() {
  const { t } = useTranslation("settings");
  const { organization } = useOrganization();
  const { isLoading, plans, handleCheckout, handlePortal } = useSubscription();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              {t("subscription.settings.title")}
            </h1>
          </div>
          <p className="text-muted-foreground ml-11">
            {t("subscription.settings.description")}
          </p>
        </div>

        <div className="grid gap-6">
          <SubscriptionPlans
            onCancel={handlePortal}
            plans={plans}
            onSubscribe={handleCheckout}
            organization={organization}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
