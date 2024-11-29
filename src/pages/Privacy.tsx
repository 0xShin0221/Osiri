import { useTranslation } from "react-i18next";

export const Privacy = () => {
  const { t } = useTranslation("privacy");
  return (
    <div className="container py-24 sm:py-32">
      <h1 className="text-4xl font-bold mb-8">{t("privacy.title")}</h1>
      {/* Privacy content */}
    </div>
  );
};
