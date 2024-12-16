// src/pages/unsubscribe/success.tsx
import { useTranslation } from "react-i18next";

export const UnsubscribeSuccess = () => {
  const { t } = useTranslation("unsubscribe");

  return (
    <div className="container mx-auto py-12 px-4 text-center">
      <h1 className="text-2xl font-bold mb-4">
        {t("title")}
      </h1>
      <p className="mb-8">
        {t("message")}
      </p>
      <a
        href="/"
        className="text-primary hover:text-primary/80"
      >
        {t("backToHome")}
      </a>
    </div>
  );
};