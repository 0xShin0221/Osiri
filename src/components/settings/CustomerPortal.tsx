import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  CreditCard,
  Receipt,
  Wallet,
  Shield,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface CustomerPortalProps {
  onOpenPortal: () => void;
  isLoading: boolean;
}

const CustomerPortal: React.FC<CustomerPortalProps> = ({
  onOpenPortal,
  isLoading,
}) => {
  const { t } = useTranslation("settings");

  const features = [
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: t("customerPortal.features.payment.title"),
      description: t("customerPortal.features.payment.description"),
    },
    {
      icon: <Receipt className="w-5 h-5" />,
      title: t("customerPortal.features.billing.title"),
      description: t("customerPortal.features.billing.description"),
    },
    {
      icon: <Wallet className="w-5 h-5" />,
      title: t("customerPortal.features.subscription.title"),
      description: t("customerPortal.features.subscription.description"),
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">
                {t("customerPortal.title")}
              </CardTitle>
              <CardDescription className="mt-1.5">
                {t("customerPortal.description")}
              </CardDescription>
            </div>
            <Button
              onClick={onOpenPortal}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:from-blue-700 hover:to-blue-500"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {t("customerPortal.openPortal")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col p-4 rounded-lg border bg-card text-card-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <div className="mb-3 rounded-full w-8 h-8 bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  {feature.icon}
                </div>
                <h3 className="font-medium mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-4 p-4 rounded-lg border bg-amber-50 dark:bg-amber-900/10">
            <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-medium text-amber-900 dark:text-amber-400">
                {t("customerPortal.security.title")}
              </h4>
              <p className="text-sm text-amber-800/80 dark:text-amber-400/80">
                {t("customerPortal.security.description")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerPortal;
