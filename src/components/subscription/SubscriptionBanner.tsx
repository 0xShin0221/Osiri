import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle, AlertCircle, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import { Database } from "@/types/database.types";
import i18n from "@/lib/i18n/config";
import { getDateLocale } from "@/lib/i18n/date";

type SubscriptionStatus = Database["public"]["Enums"]["subscription_status"];
interface SubscriptionBannerProps {
  status: SubscriptionStatus;
  trialEndDate?: string | null;
  willCancel?: boolean;
  onUpgrade?: () => void;
  onManage?: () => void;
  locale?: string;
}

export default function SubscriptionBanner({
  status,
  trialEndDate,
  willCancel,
  onUpgrade,
  onManage,
}: SubscriptionBannerProps) {
  const { t } = useTranslation("subscription");

  const renderBanner = () => {
    switch (status) {
      case "trialing":
        return (
          <Alert className="mb-6 border-primary/20 bg-primary/5">
            <div className="flex items-start space-x-4">
              <div className="p-2 rounded-full bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 pt-1">
                <AlertTitle className="text-lg font-semibold mb-2">
                  {t("trial.title")}
                </AlertTitle>
                <AlertDescription>
                  <p className="text-muted-foreground">
                    {t("trial.description", {
                      timeLeft: formatDistanceToNow(
                        new Date(trialEndDate || ""),
                        {
                          addSuffix: true,
                          locale: getDateLocale(i18n.resolvedLanguage || "en"),
                        }
                      ),
                    })}
                  </p>
                  <div className="mt-4">
                    <Button onClick={onUpgrade} className="group" size="sm">
                      {t("trial.upgrade")}
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </div>
                </AlertDescription>
              </div>
            </div>
          </Alert>
        );

      case "past_due":
        return (
          <Alert className="mb-6 border-destructive/20 bg-destructive/5">
            <div className="flex items-start space-x-4">
              <div className="p-2 rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div className="flex-1 pt-1">
                <AlertTitle className="text-lg font-semibold mb-2 text-destructive">
                  {t("pastDue.title")}
                </AlertTitle>
                <AlertDescription>
                  <p className="text-muted-foreground">
                    {t("pastDue.description")}
                  </p>
                  <div className="mt-4">
                    <Button
                      onClick={onManage}
                      variant="destructive"
                      size="sm"
                      className="group"
                    >
                      {t("pastDue.manage")}
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </div>
                </AlertDescription>
              </div>
            </div>
          </Alert>
        );

      case "active":
        if (willCancel) {
          return (
            <Alert className="mb-6 border-orange-500/20 bg-orange-500/5">
              <div className="flex items-start space-x-4">
                <div className="p-2 rounded-full bg-orange-500/10">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                </div>
                <div className="flex-1 pt-1">
                  <AlertTitle className="text-lg font-semibold mb-2 text-orange-600">
                    {t("cancelScheduled.title")}
                  </AlertTitle>
                  <AlertDescription>
                    <p className="text-muted-foreground">
                      {t("cancelScheduled.description")}
                    </p>
                    <div className="mt-4">
                      <Button
                        onClick={onManage}
                        variant="outline"
                        size="sm"
                        className="group hover:text-orange-500 hover:border-orange-500"
                      >
                        {t("cancelScheduled.manage")}
                        <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Button>
                    </div>
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          );
        }
        break;

      default:
        return null;
    }
  };

  return renderBanner();
}
