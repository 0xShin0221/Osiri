import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Check, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
interface HeroFeaturesProps {
  title: string;
  description: string;
  price?: string;
  period?: string;
  features?: { id: string; text: string }[];
  badge?: string;
  icon?: React.ReactNode;
}

const getHeroFeatures = (): HeroFeaturesProps[] => {
  const { t } = useTranslation("home");
  return [
    {
      title: t("heroCard.testimonial.name"),
      description: t("heroCard.testimonial.role"),
      badge: t("heroCard.testimonial.quote"),
    },
    {
      title: t("heroCard.news.title"),
      description: t("heroCard.news.summary"),
      badge: t("heroCard.news.badge"),
    },
    {
      title: t("heroCard.pricing.plan"),
      description: t("heroCard.pricing.description"),
      price: t("heroCard.pricing.price"),
      period: t("heroCard.pricing.period"),
      badge: t("heroCard.pricing.badge"),
      features: [
        { id: "sources", text: t("heroCard.pricing.feature.sources") },
        { id: "summaries", text: t("heroCard.pricing.feature.summaries") },
        { id: "feed", text: t("heroCard.pricing.feature.feed") },
      ],
    },
    {
      title: t("heroCard.feature.title"),
      description: t("heroCard.feature.description"),
      icon: <Globe className="w-5 h-5" />,
    },
  ];
};

export const HeroCards = () => {
  const { t } = useTranslation("home");
  const heroFeatures = getHeroFeatures();
  const testimonial = heroFeatures[0];
  const news = heroFeatures[1];
  const pricing = heroFeatures[2];
  const feature = heroFeatures[3];

  return (
    <div className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]">
      {/* Testimonial Card */}
      <Card className="absolute w-[340px] -top-[15px] drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar>
            <AvatarImage alt="" src="https://i.pravatar.cc/150?img=30" />
            <AvatarFallback>TF</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle className="text-lg">{testimonial.title}</CardTitle>
            <CardDescription>{testimonial.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>{testimonial.badge}</CardContent>
      </Card>

      {/* News Card */}
      <Card className="absolute right-[20px] top-4 w-80 drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader>
          <Badge className="w-fit mb-2" variant="secondary">
            {news.badge}
          </Badge>
          <CardTitle className="text-base">{news.title}</CardTitle>
          <CardDescription className="text-sm">
            {news.description}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Pricing Card */}
      <Card className="absolute top-[150px] left-[50px] w-72 drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {pricing.title}
            <Badge variant="secondary" className="text-sm text-primary">
              {pricing.badge}
            </Badge>
          </CardTitle>
          <div>
            <span className="text-3xl font-bold">{pricing.price}</span>{" "}
            <span className="text-muted-foreground"> {pricing.period}</span>{" "}
          </div>
          <CardDescription>{pricing.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">{t("Start Free Trial")}</Button>
        </CardContent>
        <hr className="w-4/5 m-auto mb-4" />
        <CardFooter>
          <div className="space-y-4">
            {pricing.features?.map(({ id, text }) => (
              <span key={id} className="flex">
                <Check className="text-green-500" />
                <h3 className="ml-2">{text}</h3>
              </span>
            ))}
          </div>
        </CardFooter>
      </Card>

      {/* Feature Card */}
      <Card className="absolute w-[350px] -right-[10px] bottom-[35px] drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
          <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
            {feature.icon}
          </div>
          <div>
            <CardTitle>{feature.title}</CardTitle>
            <CardDescription className="text-md mt-2">
              {feature.description}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};
