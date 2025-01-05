import { Route, Routes } from "react-router-dom";

import { AuthContainer } from "@/components/auth/AuthSupabase";
import { Home } from "@/pages/Home";
import { ComingSoon } from "@/pages/ComingSoon";
import { Terms } from "@/pages/Terms";
import { Privacy } from "@/pages/Privacy";
import { Unsubscribe } from "@/pages/Unsubscribe";
import { NotFound } from "@/pages/NotFound";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Dashboard } from "@/pages/Dashboard";
import { Onboarding } from "@/pages/Onboarding";
import ChannelSettingsPage from "@/pages/ChannelSettings";
import FeedsPage from "@/pages/Feeds";

const protectedRoutes = [
  { path: "dashboard", element: <Dashboard /> },
  { path: "onboarding", element: <Onboarding /> },
  { path: "setchannel", element: <ChannelSettingsPage /> },
  { path: "feeds", element: <FeedsPage /> },
];

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => (
  <AuthContainer>{children}</AuthContainer>
);

function Layout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}

export const LocalizedRoutes = () => (
  <Layout>
    <Routes>
      <Route index element={<Home />} />
      <Route path="coming-soon" element={<ComingSoon />} />
      <Route path="terms" element={<Terms />} />
      <Route path="privacy" element={<Privacy />} />
      <Route path="unsubscribe" element={<Unsubscribe />} />

      {protectedRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={<ProtectedRoute>{element}</ProtectedRoute>}
        />
      ))}

      <Route path="*" element={<NotFound />} />
    </Routes>
  </Layout>
);
