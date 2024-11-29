import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Sparkles, Timer, Zap, Medal } from "lucide-react";
import { useState } from "react";

export const ComingSoon = () => {
  const { t } = useTranslation("coming-soon");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted email:", email);
  };

  const incentives = [
    {
      icon: <Timer className="w-5 h-5 text-white" />,
      title: t("incentives.earlyAccess.title"),
      description: t("incentives.earlyAccess.description"),
    },
    {
      icon: <Zap className="w-5 h-5 text-white" />,
      title: t("incentives.earlyAccessAnnually.title"),
      description: t("incentives.earlyAccessAnnually.description"),
    },
    {
      icon: <Medal className="w-5 h-5 text-white" />,
      title: t("incentives.earlyAccessLifetime.title"),
      description: t("incentives.earlyAccessLifetime.description"),
    },
  ];

  const waitlistAvatars = [
    { src: "https://i.pravatar.cc/150?img=60", fallback: "TS" },
    { src: "https://i.pravatar.cc/150?img=52", fallback: "JD" },
    { src: "https://i.pravatar.cc/150?img=47", fallback: "AM" },
    { src: "https://i.pravatar.cc/150?img=45", fallback: "PK" },
    { src: "https://i.pravatar.cc/150?img=33", fallback: "RN" },
  ];

  return (
    <section className="container max-w-3xl mx-auto py-20 md:py-32 text-center">
      {/* Gradient Background Effects */}
      <div className="relative">
        <div className="absolute -top-20 -right-20 h-64 w-64 bg-gradient-to-r from-[#4F46E5]/30 to-[#2563EB]/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 bg-gradient-to-r from-[#EC4899]/30 via-[#D946EF]/30 to-[#8B5CF6]/30 rounded-full blur-3xl" />

        <div className="relative space-y-8">
          {/* Early Bird Badge */}
          <div className="mx-auto w-fit mb-8">
            <div className="rounded-full bg-gradient-to-r from-[#4F46E5] to-[#2563EB] px-6 py-2 text-white flex items-center gap-2">
              <Timer className="h-5 w-5" />
              {t("badge")}
            </div>
          </div>

          {/* Main Content */}
          <main className="space-y-6">
            <div className="text-5xl md:text-6xl font-bold">
              <h1 className="inline">
                <span className="inline bg-gradient-to-r from-[#4F46E5] to-[#2563EB] text-transparent bg-clip-text">
                  {t("title")}{" "}
                </span>
              </h1>
              <br />
              <h2 className="inline">
                <span className="inline bg-gradient-to-r from-[#EC4899] via-[#D946EF] to-[#8B5CF6] text-transparent bg-clip-text">
                  {t("subtitle")}
                </span>
              </h2>
            </div>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("description")}
            </p>
          </main>

          <div className="grid md:grid-cols-3 gap-4">
            {incentives.map(({ icon, title, description }) => (
              <div
                key={title}
                className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/30 transition-colors"
              >
                <div className="bg-gradient-to-r from-[#4F46E5] to-[#2563EB] p-2 rounded-full w-fit mx-auto mb-3">
                  {icon}
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>

          {/* Email Form */}
          {/* Waitlist Info */}
          <div className="flex flex-col items-center gap-6">
            <div className="flex -space-x-3">
              {waitlistAvatars.map((avatar, i) => (
                <Avatar
                  key={i}
                  className="border-2 border-background w-12 h-12 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                >
                  <AvatarImage src={avatar.src} alt="Waitlist member" />
                  <AvatarFallback>{avatar.fallback}</AvatarFallback>
                </Avatar>
              ))}
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#2563EB] flex items-center justify-center border-2 border-background text-sm font-bold text-white">
                +82
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              <span className="text-sm font-bold">
                {t("rating", { count: 90 })}
              </span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <Input
              type="email"
              placeholder={t("input.placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 px-4 text-lg w-full"
            />
            <Button type="submit" className="w-full">
              {t("button")}
              <Sparkles className="ml-2 w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
