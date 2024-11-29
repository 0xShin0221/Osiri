import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Cta = () => {
  const { t } = useTranslation("home");
  const { i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage;
  return (
    <section id="cta" className="bg-muted/50 py-16 my-24 sm:my-32">
      <div className="container lg:grid lg:grid-cols-2 place-items-center">
        <div className="lg:col-start-1">
          <h2 className="text-3xl md:text-4xl font-bold">
            {t("cta.title.main")}{" "}
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              {t("cta.title.highlight")}
            </span>
          </h2>
          <p className="text-muted-foreground text-xl mt-4 mb-8 lg:mb-0">
            {t("cta.description")}
          </p>
        </div>

        <div className="space-y-4 lg:col-start-2 lg:flex lg:space-y-0 lg:space-x-4">
          <a href={`/${currentLang}/coming-soon`} className="w-full">
            <Button className="w-full md:w-auto">
              {t("cta.buttons.primary")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>

          <Button variant="outline" className="w-full md:w-auto">
            {t("cta.buttons.secondary")}
          </Button>
        </div>
      </div>
    </section>
  );
};
