import { useTranslation } from "react-i18next";

interface MediaProps {
  iconUrl: string;
  name: string;
  url: string;
}

const mediaList: MediaProps[] = [
  {
    iconUrl:
      "https://www.vectorlogo.zone/logos/ycombinator/ycombinator-icon.svg",
    name: "Y Combinator",
    url: "https://www.ycombinator.com/blog/",
  },
  {
    iconUrl: "https://www.vectorlogo.zone/logos/techcrunch/techcrunch-icon.svg",
    name: "TechCrunch",
    url: "https://techcrunch.com",
  },
  {
    iconUrl:
      "https://www.vectorlogo.zone/logos/producthunt/producthunt-icon.svg",
    name: "Product Hunt",
    url: "https://producthunt.com",
  },

  {
    iconUrl:
      "https://www.vectorlogo.zone/logos/theguardian/theguardian-icon.svg",
    name: "The Guardian",
    url: "https://www.theguardian.com",
  },
  {
    iconUrl: "https://www.vectorlogo.zone/logos/github/github-icon.svg",
    name: "GitHub",
    url: "https://github.com/",
  },
  {
    iconUrl:
      "https://www.vectorlogo.zone/logos/venturebeat/venturebeat-icon.svg",
    name: "VentureBeat",
    url: "https://venturebeat.com",
  },
  {
    iconUrl: "https://www.vectorlogo.zone/logos/engadget/engadget-icon.svg",
    name: "Engadget",
    url: "https://www.engadget.com",
  },
  {
    iconUrl: "https://www.vectorlogo.zone/logos/facebook/facebook-icon.svg",
    name: "Meta Engineering",
    url: "https://engineering.fb.com",
  },
  {
    iconUrl: "https://www.vectorlogo.zone/logos/spotify/spotify-icon.svg",
    name: "Spotify Engineering",
    url: "https://engineering.atspotify.com",
  },
  {
    iconUrl: "https://www.vectorlogo.zone/logos/airbnb/airbnb-icon.svg",
    name: "Airbnb Tech",
    url: "https://medium.com/airbnb-engineering",
  },
  {
    iconUrl:
      "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/claude-color.png",
    name: "Claude",
    url: "https://claude.ai",
  },
  {
    iconUrl: "https://www.svgrepo.com/show/306500/openai.svg",
    name: "OpenAI",
    url: "https://openai.com",
  },
  {
    iconUrl: "https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-icon.svg",
    name: "Amazon Science",
    url: "https://www.amazon.science",
  },
];

export const Medias = () => {
  const { t } = useTranslation("home");

  return (
    <>
      <section id="medias" className="container py-12 sm:py-16">
        <div className="text-center space-y-8 mb-16">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold space-x-3">
              <span className="text-primary">{t("media.title.prefix")}</span>
              <span>{t("media.title.main")}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("media.subtitle")}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {mediaList.map(({ iconUrl, name, url }: MediaProps) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground/60 hover:text-primary transition-colors"
            >
              <img
                src={iconUrl}
                alt={name}
                className="w-12 h-12 hover:grayscale-0 transition-all"
                width={48}
                height={48}
              />
              <h3 className="text-lg font-semibold">{name}</h3>
            </a>
          ))}
        </div>
      </section>
    </>
  );
};
