// src/routes/config.tsx
import { Home } from "@/pages/Home";
import { ComingSoon } from "@/pages/ComingSoon";
import { Terms } from "@/pages/Terms";
import { Privacy } from "@/pages/Privacy";
import { Unsubscribe } from "@/pages/Unsubscribe";
import { Dashboard } from "@/pages/Dashboard";
import { Onboarding } from "@/pages/Onboarding";
import ChannelSettingsPage from "@/pages/ChannelSettings";
import FeedsPage from "@/pages/Feeds";
import AppIntegrationPage from "@/pages/AppIntegration";
import type { ReactElement } from "react";
import { AuthCallback } from "@/components/auth/AuthCallback";
import AppSettingsPage from "@/pages/AppSettings";
import LegalNotice from "@/pages/LegalNotice";

interface RouteConfig {
  path: string;
  element: ReactElement;
  protected?: boolean;
  requireOrg?: boolean;
}

export const ROUTE_CONFIGS: RouteConfig[] = [
  { path: "", element: <Home /> },
  { path: "coming-soon", element: <ComingSoon /> },
  { path: "terms", element: <Terms /> },
  { path: "privacy", element: <Privacy /> },
  { path: "unsubscribe", element: <Unsubscribe /> },
  { path: "legal-notice", element: <LegalNotice /> },
  { path: "auth/callback", element: <AuthCallback /> },
  {
    path: "dashboard",
    element: <Dashboard />,
    protected: true,
    requireOrg: true,
  },
  {
    path: "onboarding",
    element: <Onboarding />,
    protected: true,
    requireOrg: true,
  },
  {
    path: "setchannel",
    element: <ChannelSettingsPage />,
    protected: true,
    requireOrg: true,
  },
  {
    path: "integrations",
    element: <AppIntegrationPage />,
    protected: true,
    requireOrg: true,
  },
  { path: "feeds", element: <FeedsPage />, protected: true, requireOrg: true },
  {
    path: "settings",
    element: <AppSettingsPage />,
    protected: true,
    requireOrg: false,
  },
];
