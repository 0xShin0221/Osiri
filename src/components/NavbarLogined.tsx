import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogOut, Menu, LayoutDashboard } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { OsiriLogo } from "./Logo";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "./LangSelector";
import { buttonVariants } from "@/components/ui/button-variants";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

interface RouteProps {
  href: string;
  label: string;
  icon: JSX.Element;
}

const routeList = (): RouteProps[] => {
  const { t } = useTranslation("dashboard");
  return [
    {
      href: "/dashboard",
      label: t("menu.dashboard"),
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    // {
    //   href: "/bookmarks",
    //   label: t("menu.bookmarks"),
    //   icon: <BookMarked className="w-4 h-4" />,
    // },
    // {
    //   href: "/settings",
    //   label: t("menu.settings"),
    //   icon: <Settings className="w-4 h-4" />,
    // },
  ];
};

export const NavbarLogined = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { t, i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage;
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate(`/${currentLang}`);
  };

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between">
          <NavigationMenuItem className="font-bold flex">
            <a
              href={`/${currentLang}/dashboard`}
              className="ml-2 font-bold text-xl flex"
            >
              <OsiriLogo />
              Osiri
            </a>
          </NavigationMenuItem>

          {/* Mobile */}
          <span className="flex md:hidden">
            <ModeToggle />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu className="flex md:hidden h-5 w-5" />
              </SheetTrigger>

              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">Osiri</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {routeList().map(({ href, label, icon }: RouteProps) => (
                    <a
                      key={label}
                      href={`/${currentLang}${href}`}
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {icon}
                      <span className="ml-2">{label}</span>
                    </a>
                  ))}
                  <LanguageSelector variant="mobile" />
                  <button
                    onClick={handleLogout}
                    className={buttonVariants({ variant: "ghost" })}
                  >
                    <LogOut className="mr-2 w-4 h-4" />
                    {t("menu.logout")}
                  </button>
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* Desktop */}
          <nav className="hidden md:flex gap-2">
            {routeList().map(({ href, label, icon }: RouteProps) => (
              <a
                key={label}
                href={`/${currentLang}${href}`}
                className={`text-[17px] ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                {icon}
                <span className="ml-2">{label}</span>
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <LanguageSelector />
            <button
              onClick={handleLogout}
              className={buttonVariants({ 
                variant: "ghost",
                className: "text-muted-foreground hover:text-foreground"
              })}
            >
              <LogOut className="mr-2 w-4 h-4" />
              {t("menu.logout")}
            </button>
            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};