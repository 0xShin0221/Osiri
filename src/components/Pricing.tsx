import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

enum PopularPlanType {
  NO = 0,
  YES = 1,
}

interface PricingProps {
  titleKey: string;
  popular: PopularPlanType;
  price: string;
  descriptionKey: string;
  buttonTextKey: string;
  benefitListKeys: string[];
}

const getPricingList = (): PricingProps[] => {
  const { t } = useTranslation("home");
  return [
    {
      titleKey: t("pricing.plans.trial.title"),
      popular: 0,
      price: t("pricing.plans.trial.price"),
      descriptionKey: t("pricing.plans.trial.description"),
      buttonTextKey: t("pricing.plans.trial.button"),
      benefitListKeys: [
        t("pricing.plans.trial.benefit1"),
        t("pricing.plans.trial.benefit2"),
        t("pricing.plans.trial.benefit3"),
        t("pricing.plans.trial.benefit4"),
        t("pricing.plans.trial.benefit5"),
      ],
    },
    {
      titleKey: t("pricing.plans.pro.title"),
      popular: 1,
      price: t("pricing.plans.pro.price"),
      descriptionKey: t("pricing.plans.pro.description"),
      buttonTextKey: t("pricing.plans.pro.button"),
      benefitListKeys: [
        t("pricing.plans.pro.benefit1"),
        t("pricing.plans.pro.benefit2"),
        t("pricing.plans.pro.benefit3"),
        t("pricing.plans.pro.benefit4"),
        t("pricing.plans.pro.benefit5"),
      ],
    },
    {
      titleKey: t("pricing.plans.enterprise.title"),
      popular: 0,
      price: t("pricing.plans.enterprise.price"),
      descriptionKey: t("pricing.plans.enterprise.description"),
      buttonTextKey: t("pricing.plans.enterprise.button"),
      benefitListKeys: [
        t("pricing.plans.enterprise.benefit1"),
        t("pricing.plans.enterprise.benefit2"),
        t("pricing.plans.enterprise.benefit3"),
        t("pricing.plans.enterprise.benefit4"),
        t("pricing.plans.enterprise.benefit5"),
      ],
    },
  ];
};

export const Pricing = () => {
  const { t } = useTranslation("home");
  const { i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage;
  const pricingList = getPricingList();

  return (
    <section id="pricing" className="container py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        {t("pricing.title.main")}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {" "}
          {t("pricing.title.highlight")}{" "}
        </span>
        {t("pricing.title.end")}
      </h2>
      <h3 className="text-xl text-center text-muted-foreground pt-4 pb-8">
        {t("pricing.subtitle")}
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pricingList.map((pricing: PricingProps) => (
          <Card
            key={pricing.titleKey}
            className={
              pricing.popular === PopularPlanType.YES
                ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10"
                : ""
            }
          >
            <CardHeader>
              <CardTitle className="flex item-center justify-between">
                {pricing.titleKey}
                {pricing.popular === PopularPlanType.YES ? (
                  <Badge variant="secondary" className="text-sm text-primary">
                    {t("pricing.popularBadge")}
                  </Badge>
                ) : null}
              </CardTitle>
              <div>
                <span className="text-3xl font-bold">{pricing.price}</span>
                <span className="text-muted-foreground">
                  {t("pricing.period")}
                </span>
              </div>

              <CardDescription>{pricing.descriptionKey}</CardDescription>
            </CardHeader>

            <CardContent>
              {pricing.buttonTextKey === t("pricing.plans.trial.button") ? (
                <a href={`/${currentLang}/coming-soon`} className="w-full">
                  <Button className="w-full">{pricing.buttonTextKey}</Button>
                </a>
              ) : (
                <Button className="w-full" variant="outline">
                  {pricing.buttonTextKey}
                </Button>
              )}
            </CardContent>

            <hr className="w-4/5 m-auto mb-4" />

            <CardFooter className="flex">
              <div className="space-y-4">
                {pricing.benefitListKeys.map((benefit: string) => (
                  <span key={benefit} className="flex">
                    <Check className="text-green-500" />
                    <h3 className="ml-2">{benefit}</h3>
                  </span>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
