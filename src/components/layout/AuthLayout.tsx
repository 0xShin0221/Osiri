import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { NavbarLogined } from "@/components/NavbarLogined";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      {session ? <NavbarLogined /> : <Navbar />}
      <main>{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  );
}