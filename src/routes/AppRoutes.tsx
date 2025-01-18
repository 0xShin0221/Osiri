import { Route, Routes } from "react-router-dom";
import { LANGUAGES } from "@/lib/i18n/languages";
import { NotFound } from "@/pages/NotFound";
import { LocalizedRoutes } from "./LocalizedRoutes";
import { LanguageRedirect } from "./LanguageRedirect";
import { ROUTE_CONFIGS } from "./config";

const BaseRouteRedirect = () => (
  <Routes>
    {ROUTE_CONFIGS.map(({ path }) => (
      <Route key={path} path={`/${path}`} element={<LanguageRedirect />} />
    ))}
    <Route path="*" element={<LanguageRedirect fallback={<NotFound />} />} />
  </Routes>
);

export const AppRoutes = () => (
  <Routes>
    <Route path="/*" element={<BaseRouteRedirect />} />

    {LANGUAGES.SUPPORTED.map(({ code }) => (
      <Route key={code} path={`/${code}/*`} element={<LocalizedRoutes />} />
    ))}
  </Routes>
);
