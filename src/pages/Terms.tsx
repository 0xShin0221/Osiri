import { useTranslation } from "react-i18next";

export const Terms = () => {
  const { t } = useTranslation("terms");
  return (
    <div className="container py-24 sm:py-32">
      <h1 className="text-4xl font-bold mb-8">{t("terms.title")}</h1>
      {/* Terms content */}
    </div>
  );
};
