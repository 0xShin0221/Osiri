import { Button } from "./ui/button";
import { buttonVariants } from "./ui/button";
import { HeroCards } from "./HeroCards";
import { Globe2, Newspaper } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Hero = () => {
  const { t } = useTranslation("home");
  const { i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage;
  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#4F46E5] to-[#2563EB] text-transparent bg-clip-text">
              {t("hero.title")}
            </span>{" "}
          </h1>
          <h2 className="inline">
            <span className="inline bg-gradient-to-r from-[#EC4899] via-[#D946EF] to-[#8B5CF6] text-transparent bg-clip-text">
              {t("hero.subtitle")}
            </span>
          </h2>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          {t("hero.description")}
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <a href={`/${currentLang}/coming-soon`} className="w-full">
            <Button className="w-full md:w-1/3">
              {t("hero.cta")}
              <Globe2 className="ml-2 w-5 h-5" />
            </Button>
          </a>

          <a
            href="#features"
            className={`w-full md:w-1/3 ${buttonVariants({
              variant: "outline",
            })}`}
          >
            {t("hero.learnMore")}
            <Newspaper className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <HeroCards />
      </div>

      {/* Shadow effect */}
      <div className="shadow" />
    </section>
  );
};
