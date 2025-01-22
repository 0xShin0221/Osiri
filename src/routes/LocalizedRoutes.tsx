import { Route, Routes } from "react-router-dom";
import { AuthContainer } from "@/components/auth/AuthSupabase";
import { NotFound } from "@/pages/NotFound";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { ROUTE_CONFIGS } from "./config";
import { OrgAuthContainer } from "../components/auth/OrgAuthContainer";

const ProtectedRoute = ({
  children,
  requireOrg,
}: {
  children: React.ReactNode;
  requireOrg?: boolean;
}) => {
  return (
    <AuthContainer>
      {requireOrg ? <OrgAuthContainer>{children}</OrgAuthContainer> : children}
    </AuthContainer>
  );
};

function Layout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}

export const LocalizedRoutes = () => {
  return (
    <Layout>
      <Routes>
        {ROUTE_CONFIGS.map(
          ({ path, element, protected: isProtected, requireOrg }) => (
            <Route
              key={path}
              path={path}
              element={
                isProtected ? (
                  <ProtectedRoute requireOrg={requireOrg}>
                    {element}
                  </ProtectedRoute>
                ) : (
                  element
                )
              }
            />
          )
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};
