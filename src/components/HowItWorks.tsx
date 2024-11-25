import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useTranslation } from "react-i18next";
import { Globe, BookOpen, Bell } from "lucide-react";

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const getFeatures = (): FeatureProps[] => {
  const { t } = useTranslation("home");
  return [
    {
      icon: <Globe className="w-6 h-6" />,
      title: t("howItWorks.steps.collect.title"),
      description: t("howItWorks.steps.collect.description"),
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: t("howItWorks.steps.analyze.title"),
      description: t("howItWorks.steps.analyze.description"),
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: t("howItWorks.steps.personalize.title"),
      description: t("howItWorks.steps.personalize.description"),
    },
  ];
};

export const HowItWorks = () => {
  const { t } = useTranslation("home");
  const features = getFeatures();

  return (
    <section id="howItWorks" className="container text-center py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold">
        {t("howItWorks.title.main")}{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {t("howItWorks.title.highlight")}
        </span>
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        {t("howItWorks.subtitle")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map(({ icon, title, description }: FeatureProps, index) => (
          <Card key={title} className="bg-muted/50 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">
              {index + 1}
            </div>
            <CardHeader>
              <CardTitle className="grid gap-4 place-items-center">
                {icon}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
