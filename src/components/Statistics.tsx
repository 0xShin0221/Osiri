import { useTranslation } from "react-i18next";

export const Statistics = () => {
  const { t } = useTranslation("about");
  interface statsProps {
    quantity: string;
    description: string;
  }

  const stats: statsProps[] = [
    {
      quantity: "200+",
      description: t("about.stats.sources"),
    },
    {
      quantity: "10+",
      description: t("about.stats.languages"),
    },
    {
      quantity: "24/7",
      description: t("about.stats.updates"),
    },
  ];

  return (
    <section id="statistics">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map(({ quantity, description }: statsProps) => (
          <div key={description} className="space-y-2 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold ">{quantity}</h2>
            <p className="text-xl text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
