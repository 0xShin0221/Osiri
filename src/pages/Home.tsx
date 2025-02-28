import { About } from "@/components/About";
import { Hero } from "@/components/Hero";
import { SEOHead } from "@/components/SEOHead";
import { Medias } from "@/components/Medias";
import { useTranslation } from "react-i18next";
import { Cta } from "@/components/Cta";
import { FAQ } from "@/components/FAQ";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Newsletter } from "@/components/Newsletter";
import { Pricing } from "@/components/Pricing";
import { Team } from "@/components/Team";
// import { Testimonials } from "@/components/Testimonials";
import { Personas } from "@/components/Personas";
import { useEffect } from "react";
export function Home() {
  useEffect(() => {
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);
  const { t } = useTranslation();
  return (
    <>
      <SEOHead title={t("seo.title")} description={t("seo.description")} />
      <Hero />
      <Medias />
      <Personas />
      <About />
      <HowItWorks />
      <Cta />
      <Features />
      {/* <Testimonials /> */}
      <Team />
      <Pricing />
      <Newsletter />
      <FAQ />
    </>
  );
}
