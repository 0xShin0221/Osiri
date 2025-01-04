import { Route, Routes } from "react-router-dom";
import { LANGUAGES } from "@/lib/i18n/languages";

import { NotFound } from "@/pages/NotFound";
import { LocalizedRoutes } from "./LocalizedRoutes";
import { LanguageRedirect } from "@/components/LanguadgeRedirect";

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LanguageRedirect />} />
    {LANGUAGES.SUPPORTED.map(({ code }) => (
      <Route key={code} path={`/${code}/*`} element={<LocalizedRoutes />} />
    ))}
    <Route path="*" element={<LanguageRedirect fallback={<NotFound />} />} />
  </Routes>
);
