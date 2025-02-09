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
import { buttonVariants } from "@/components/ui/button-variants";

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
        "https://pbs.twimg.com/profile_images/1620362917735698433/snBlqRsJ_400x400.jpg",
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
      imageUrl:
        "https://fkmjhtjgaeoqbgzpwxif.supabase.co/storage/v1/object/public/assets//hiroshi35sai.png",
      nameKey: t("team.members.hiroshi.name"),
      descriptionKey: t("team.members.hiroshi.description"),
      positionKey: t("team.members.hiroshi.position"),
      socialNetworks: [
        {
          name: "Linkedin",
          url: "https://www.linkedin.com/in/h-iroshi-b11255350",
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
