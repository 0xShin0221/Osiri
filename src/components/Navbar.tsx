import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { LogIn, Menu } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { OsiriLogo } from "./Logo";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "./LangSelector";
import { t } from "i18next";
import { buttonVariants } from "@/components/ui/button-variants";

interface RouteProps {
  href: string;
  label: string;
}

const routeList = (): RouteProps[] => {
  const { t } = useTranslation("home");
  return [
    {
      href: "#personas",
      label: t("menu.personas"),
    },
    {
      href: "#features",
      label: t("menu.features"),
    },
    {
      href: "#pricing",
      label: t("menu.pricing"),
    },
    {
      href: "#faq",
      label: t("menu.faq"),
    },
  ];
};

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage;
  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">
            <a
              rel="noreferrer noopener"
              href="/"
              className="ml-2 font-bold text-xl flex"
            >
              <OsiriLogo />
              Osiri
            </a>
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex md:hidden">
            <ModeToggle />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu
                  className="flex md:hidden h-5 w-5"
                  onClick={() => setIsOpen(true)}
                >
                  {/* <span className="sr-only">{t("Menu Icon")}</span> */}
                </Menu>
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">Osiri</SheetTitle>
                  <SheetDescription>{""}</SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {routeList().map(({ href, label }: RouteProps) => (
                    <a
                      rel="noreferrer noopener"
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {label}
                    </a>
                  ))}
                  <LanguageSelector variant="mobile" />
                  <a
                    rel="noreferrer noopener"
                    href={`/${currentLang}/coming-soon`}
                    target="_blank"
                    className={`w-[110px] border ${buttonVariants({
                      variant: "secondary",
                    })}`}
                  >
                    <LogIn className="mr-2 w-5 h-5" />
                    {t("menu.login")}
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className="hidden md:flex gap-2">
            {routeList().map((route: RouteProps, i) => (
              <a
                rel="noreferrer noopener"
                href={route.href}
                key={i}
                className={`text-[17px] ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                {route.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex gap-2">
            <LanguageSelector />
            <a
              rel="noreferrer noopener"
              href={`/${currentLang}/coming-soon`}
              target="_blank"
              className={`border ${buttonVariants({ variant: "secondary" })}`}
            >
              <LogIn className="mr-2 w-5 h-5" />
              {t("menu.login")}
            </a>

            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
