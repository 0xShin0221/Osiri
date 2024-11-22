import { About } from "@/components/About";
import { Hero } from "@/components/Hero";
import { SEOHead } from "@/components/SEOHead";
import { Sponsors } from "@/components/Sponsors";
import { useTranslation } from "react-i18next";
import { Cta } from "@/components/Cta";
import { FAQ } from "@/components/FAQ";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Newsletter } from "@/components/Newsletter";
import { Pricing } from "@/components/Pricing";
import { Team } from "@/components/Team";
import { Testimonials } from "@/components/Testimonials";
import { Services } from "@/components/Services";
export function Home() {
  const { t } = useTranslation();
  return (
    <>
      <SEOHead
        title={t("home.seo.title")}
        description={t("home.seo.description")}
      />
      <Hero />
      <Sponsors />
      <About />
      <HowItWorks />
      <Features />
      <Services />
      <Cta />
      <Testimonials />
      <Team />
      <Pricing />
      <Newsletter />
      <FAQ />
    </>
  );
}
