import { Route, Routes } from "react-router-dom";

import { AuthContainer } from "@/components/auth/AuthSupabase";
import { Home } from "@/pages/Home";
import { ComingSoon } from "@/pages/ComingSoon";
import { Terms } from "@/pages/Terms";
import { Privacy } from "@/pages/Privacy";
import { Dashboard } from "@/pages/Dashboard";
import { Onboarding } from "@/pages/Onboarding";
import { Unsubscribe } from "@/pages/Unsubscribe";
import { NotFound } from "@/pages/NotFound";
import { AuthLayout } from "@/components/layout/AuthLayout";
import ChannelSettingsMock from "@/pages/ChannelSettings";


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => (
  <AuthContainer>
    {children}
  </AuthContainer>
);

function Layout({ children }: { children: React.ReactNode }) {
    return (
      <>
     <AuthLayout>
        {children}
      </AuthLayout>
      </>
    );
  }
  
export const LocalizedRoutes = () => (
  <Layout>
    <Routes>
      <Route index element={<Home />} />
      <Route path="coming-soon" element={<ComingSoon />} />
      <Route path="terms" element={<Terms />} />
      <Route path="privacy" element={<Privacy />} />
      <Route path="unsubscribe" element={<Unsubscribe />} />
      
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="setchannel"
        element={
          <ProtectedRoute>
            <ChannelSettingsMock />
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Layout>
);