import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Facebook, Github, Instagram, Linkedin } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TeamProps {
  imageUrl: string;
  nameKey: string;
  descriptionKey: string;
  positionKey: string;
  socialNetworks: SocialNetworksProps[];
}

interface SocialNetworksProps {
  name: string;
  url: string;
}

const getTeamList = (): TeamProps[] => {
  const { t } = useTranslation("home");
  return [
    {
      imageUrl:
        "https://media.licdn.com/dms/image/v2/C5103AQFDIRAQ64tRiQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1587511221183?e=1738195200&v=beta&t=S8b1-qU7RheuNkzQzawSDLH8bhyCZNYD9hUABeuR-Jk",
      nameKey: t("team.members.shin.name"),
      descriptionKey: t("team.members.shin.description"),
      positionKey: t("team.members.shin.position"),
      socialNetworks: [
        {
          name: "Linkedin",
          url: "https://www.linkedin.com/in/shin-nakagawa-2599a31a7/",
        },
        {
          name: "Facebook",
          url: "https://www.facebook.com/dorichan0629",
        },
        {
          name: "Github",
          url: "https://github.com/0xShin0221/digdatech-hp",
        },
      ],
    },
    {
      imageUrl: "https://i.pravatar.cc/150?img=60",
      nameKey: t("team.members.leo.name"),
      descriptionKey: t("team.members.leo.description"),
      positionKey: t("team.members.leo.position"),
      socialNetworks: [
        {
          name: "Linkedin",
          url: "https://www.linkedin.com/in/leopoldo-miranda/",
        },
      ],
    },
  ];
};

export const Team = () => {
  const { t } = useTranslation("home");
  const teamList = getTeamList();

  const socialIcon = (iconName: string) => {
    switch (iconName) {
      case "Linkedin":
        return <Linkedin size="20" />;
      case "Facebook":
        return <Facebook size="20" />;
      case "Github":
        return <Github size="20" />;
      case "Instagram":
        return <Instagram size="20" />;
    }
  };

  return (
    <section id="team" className="container py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold">
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {t("team.title.highlight")}{" "}
        </span>
        {t("team.title.main")}
      </h2>

      <p className="mt-4 mb-10 text-xl text-muted-foreground">
        {t("team.subtitle")}
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-10">
        {teamList.map(
          ({
            imageUrl,
            descriptionKey,
            nameKey,
            positionKey,
            socialNetworks,
          }: TeamProps) => (
            <Card
              key={nameKey}
              className="bg-muted/50 relative mt-8 flex flex-col justify-center items-center"
            >
              <CardHeader className="mt-8 flex justify-center items-center pb-2">
                <img
                  src={imageUrl}
                  alt={`${nameKey} ${positionKey}`}
                  className="absolute -top-12 rounded-full w-24 h-24 aspect-square object-cover"
                />
                <CardTitle className="text-center">{nameKey}</CardTitle>
                <CardDescription className="text-primary">
                  {positionKey}
                </CardDescription>
              </CardHeader>

              <CardContent className="text-center pb-2">
                <p>{descriptionKey}</p>
              </CardContent>

              <CardFooter>
                {socialNetworks.map(({ name, url }: SocialNetworksProps) => (
                  <div key={name}>
                    <a
                      rel="noreferrer noopener"
                      href={url}
                      target="_blank"
                      className={buttonVariants({
                        variant: "ghost",
                        size: "sm",
                      })}
                    >
                      <span className="sr-only">{`${name} ${t(
                        "team.social.icon"
                      )}`}</span>
                      {socialIcon(name)}
                    </a>
                  </div>
                ))}
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </section>
  );
};
