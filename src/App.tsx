import "./App.css";
import "./lib/i18n/config";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { LanguageRedirect } from "./components/LanguadgeRedirect";
import { LANGUAGES } from "./lib/i18n/languages";
import { HelmetProvider } from "react-helmet-async";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Home } from "@/pages/Home";
import { Terms } from "./pages/Terms";
import { Privacy } from "./pages/Privacy";
import { ComingSoon } from "./pages/ComingSoon";
import { NotFound } from "./pages/NotFound";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  );
}

function LocalizedRoutes() {
  const { i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage;

  return (
    <Layout>
      <Routes>
        <Route index element={<Home />} />
        <Route path={`/${currentLang}/coming-soon`} element={<ComingSoon />} />
        <Route path={`/${currentLang}/terms`} element={<Terms />} />
        <Route path={`/${currentLang}/privacy`} element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage || LANGUAGES.DEFAULT;
  }, [i18n.resolvedLanguage]);

  return (
    <BrowserRouter>
      <HelmetProvider>
        <Routes>
          <Route path="/" element={<LanguageRedirect />} />

          {LANGUAGES.SUPPORTED.map(({ code }) => (
            <Route
              key={code}
              path={`/${code}/*`}
              element={<LocalizedRoutes />}
            />
          ))}

          <Route path="*" element={<LanguageRedirect />} />
        </Routes>
      </HelmetProvider>
    </BrowserRouter>
  );
}

export default App;
