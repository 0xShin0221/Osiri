import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import image from "../assets/growth.png";
import image3 from "../assets/reflecting.png";
import image4 from "../assets/looking-ahead.png";
import { useTranslation } from "react-i18next";

interface FeatureProps {
  titleKey: string;
  descriptionKey: string;
  image: string;
}

const getFeatures = (): FeatureProps[] => {
  const { t } = useTranslation("features");
  return [
    {
      titleKey: t("features.cards.global_intelligence.title"),
      descriptionKey: t("features.cards.global_intelligence.description"),
      image: image4,
    },
    {
      titleKey: t("features.cards.ai_insights.title"),
      descriptionKey: t("features.cards.ai_insights.description"),
      image: image3,
    },
    {
      titleKey: t("features.cards.effortless_discovery.title"),
      descriptionKey: t("features.cards.effortless_discovery.description"),
      image: image,
    },
  ];
};

const getFeatureList = (): string[] => {
  const { t } = useTranslation("features");
  return [
    t("features.categories.tech_news"),
    t("features.categories.vc_investments"),
    t("features.categories.product_design"),
    t("features.categories.engineering"),
    t("features.categories.startup_stories"),
    t("features.categories.ai_ml"),
    t("features.categories.growth"),
    t("features.categories.future_work"),
    t("features.categories.web3_fintech"),
    t("features.categories.saas_enterprise"),
    t("features.categories.innovation"),
    t("features.categories.founder_insights"),
  ];
};

export const Features = () => {
  const { t } = useTranslation("features");
  return (
    <section id="features" className="container py-24 sm:py-32 space-y-8">
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        {t("features.section.title")}{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {t("features.section.highlight")}
        </span>
      </h2>

      <div className="flex flex-wrap md:justify-center gap-4">
        {getFeatureList().map((feature: string) => (
          <div key={feature}>
            <Badge variant="secondary" className="text-sm">
              {feature}
            </Badge>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {getFeatures().map(
          ({ titleKey, descriptionKey, image }: FeatureProps) => (
            <Card key={titleKey}>
              <CardHeader>
                <CardTitle>{titleKey}</CardTitle>
              </CardHeader>

              <CardContent>{descriptionKey}</CardContent>

              <CardFooter>
                <img
                  src={image}
                  alt={titleKey}
                  className="w-[200px] lg:w-[300px] mx-auto"
                />
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </section>
  );
};
