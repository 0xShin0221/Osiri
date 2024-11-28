import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  questionKey: string;
  answerKey: string;
  value: string;
}

const getFAQList = (): FAQProps[] => {
  const { t } = useTranslation("home");
  return [
    // {
    //   questionKey: t("faq.items.usage.question"),
    //   answerKey: t("faq.items.usage.answer"),
    //   value: "usage",
    // },
    // {
    //   questionKey: t("faq.items.languages.question"),
    //   answerKey: t("faq.items.languages.answer"),
    //   value: "languages",
    // },
    // {
    //   questionKey: t("faq.items.sources.question"),
    //   answerKey: t("faq.items.sources.answer"),
    //   value: "sources",
    // },
    {
      questionKey: t("faq.items.trial.question"),
      answerKey: t("faq.items.trial.answer"),
      value: "trial",
    },
    {
      questionKey: t("faq.items.cancel.question"),
      answerKey: t("faq.items.cancel.answer"),
      value: "cancel",
    },
    // {
    //   questionKey: t("faq.items.updates.question"),
    //   answerKey: t("faq.items.updates.answer"),
    //   value: "updates",
    // },
  ];
};

export const FAQ = () => {
  const { t } = useTranslation("home");
  const FAQList = getFAQList();

  return (
    <section id="faq" className="container py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        {t("faq.title.main")}{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {t("faq.title.highlight")}
        </span>
      </h2>

      <Accordion type="single" collapsible className="w-full AccordionRoot">
        {FAQList.map(({ questionKey, answerKey, value }: FAQProps) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">
              {questionKey}
            </AccordionTrigger>
            <AccordionContent>{answerKey}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium mt-4">
        {t("faq.contact.text")}{" "}
        <a
          rel="noreferrer noopener"
          href="mailto:support@osiri.xyz"
          className="text-primary transition-all border-primary hover:border-b-2"
        >
          {t("faq.contact.link")} support[at]osiri.xyz
        </a>
      </h3>
    </section>
  );
};
