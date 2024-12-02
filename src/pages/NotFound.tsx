// src/pages/NotFound.tsx
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export const NotFound = () => {
  const { t, i18n } = useTranslation("404");
  const currentLang = i18n.resolvedLanguage;

  return (
    <section className="container max-w-3xl mx-auto py-20 md:py-32 text-center">
      <div className="space-y-8">
        {/* Fun but professional 404 message */}
        <h1 className="text-7xl font-bold bg-gradient-to-r from-[#4F46E5] to-[#2563EB] text-transparent bg-clip-text">
          404
        </h1>
        <h2 className="text-3xl font-semibold">
          {t("title")}
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t("description")}
        </p>
    
        <div>
          <a 
            href={`/${currentLang}`} 
            className="inline-flex"
          >
            <Button size="lg">
              <Home className="mr-2 h-5 w-5" />
              {t("backHome")}
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};