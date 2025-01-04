import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { LANGUAGES } from "@/lib/i18n/languages";
import { AppRoutes } from "./routes/AppRoutes";
import * as amplitude from '@amplitude/analytics-browser';

import "./App.css";
import "./lib/i18n/config";

const initializeAnalytics = () => {
  const amplitudeKey = import.meta.env.VITE_AMPLITUDE_API_KEY;
  if (!amplitudeKey) {
    throw new Error("Amplitude API key is missing");
  }
  
  amplitude.init(amplitudeKey, { autocapture: true });
};

initializeAnalytics();

export const App = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage || LANGUAGES.DEFAULT;
  }, [i18n.resolvedLanguage]);

  return (
    <BrowserRouter>
      <HelmetProvider>
        <AppRoutes />
      </HelmetProvider>
    </BrowserRouter>
  );
};

export default App;