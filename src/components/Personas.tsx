import { useTranslation } from "react-i18next";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Rocket, LineChart, Layers } from "lucide-react";
import aiReader from "../assets/cube-leg.png";

interface PersonaProps {
  title: string;
  description: string;
  icon: JSX.Element;
}

const getPersonaList = (): PersonaProps[] => {
  const { t } = useTranslation("home");
  return [
    {
      title: t("personas.list.founder.title"),
      description: t("personas.list.founder.description"),
      icon: <Rocket className="w-5 h-5 text-primary" />,
    },
    {
      title: t("personas.list.investor.title"),
      description: t("personas.list.investor.description"),
      icon: <LineChart className="w-5 h-5 text-primary" />,
    },
    {
      title: t("personas.list.product.title"),
      description: t("personas.list.product.description"),
      icon: <Layers className="w-5 h-5 text-primary" />,
    },
  ];
};

export const Personas = () => {
  const { t } = useTranslation("home");
  const personaList = getPersonaList();

  return (
    <section className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              {t("personas.title.highlight")}{" "}
            </span>
            {t("personas.title.main")}
          </h2>

          <p className="text-muted-foreground text-xl mt-4 mb-8">
            {t("personas.subtitle")}
          </p>

          <div className="flex flex-col gap-8">
            {personaList.map(({ icon, title, description }: PersonaProps) => (
              <Card key={title}>
                <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                  <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
                    {icon}
                  </div>
                  <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="text-md mt-2">
                      {description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <img
          src={aiReader}
          className="w-[300px] md:w-[500px] lg:w-[600px] object-contain"
          alt={t("personas.image.alt")}
        />
      </div>
    </section>
  );
};
