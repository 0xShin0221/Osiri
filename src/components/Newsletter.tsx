import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import i18n from "@/lib/i18n/config";
import { supabase } from "@/lib/supabase";


export const Newsletter = () => {
  const { t } = useTranslation("home");

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('emails', {
        body: ({
          to: email,
          template: 'newsletter',
          language: i18n.language,
          data: {
            email: email,
          }
        }),
      });

      if (error) throw error;

      setEmail("");
      // toast.success(t("success"));
    } catch (error) {
      console.error('Error:', error);
      // toast.error(t("error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="newsletter">
      <hr className="w-11/12 mx-auto" />

      <div className="container py-24 sm:py-32">
        <h3 className="text-center text-4xl md:text-5xl font-bold">
          {t("newsletter.title.main")}{" "}
          <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
            {t("newsletter.title.highlight")}
          </span>
        </h3>
        <p className="text-xl text-muted-foreground text-center mt-4 mb-8">
          {t("newsletter.description")}
        </p>

        <form
          className="flex flex-col w-full md:flex-row md:w-6/12 lg:w-4/12 mx-auto gap-4 md:gap-2"
          onSubmit={handleSubmit}
        >
          <Input
            placeholder={t("newsletter.placeholder")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-muted/50 dark:bg-muted/80"
            aria-label={t("newsletter.emailLabel")}
          />
         <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {t("newsletter.button")}
          </Button>
        </form>
      </div>

      <hr className="w-11/12 mx-auto" />
    </section>
  );
};
