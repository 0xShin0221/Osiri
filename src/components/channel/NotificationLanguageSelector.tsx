import type React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { LANGUAGES } from "@/lib/i18n/languages";
import type { Database } from "@/types/database.types";

type FeedLanguage = Database["public"]["Enums"]["feed_language"];

interface NotificationLanguageSelectorProps {
  value: FeedLanguage;
  onChange: (value: FeedLanguage) => void;
  className?: string;
  position?: "footer" | "form";
}

export const NotificationLanguageSelector: React.FC<
  NotificationLanguageSelectorProps
> = ({ value, onChange, className = "", position = "form" }) => {
  const { t, i18n } = useTranslation("channel");
  const currentLanguage =
    LANGUAGES.SUPPORTED.find((lang) => lang.code === value) ||
    LANGUAGES.SUPPORTED.find((lang) => lang.code === i18n.resolvedLanguage) ||
    LANGUAGES.SUPPORTED[0];

  const handleLanguageInteraction =
    (langCode: string) => (e: React.MouseEvent | React.KeyboardEvent) => {
      if (
        e.type === "click" ||
        (e as React.KeyboardEvent).key === "Enter" ||
        (e as React.KeyboardEvent).key === " "
      ) {
        e.preventDefault();
        onChange(langCode as FeedLanguage);
      }
    };

  const content = (
    <PopoverContent className="w-48 p-1" align="end">
      <div className="flex flex-col">
        {LANGUAGES.SUPPORTED.map((lang) => (
          <div
            key={lang.code}
            aria-selected={value === lang.code}
            onClick={handleLanguageInteraction(lang.code)}
            onKeyDown={handleLanguageInteraction(lang.code)}
            className={cn(
              "flex items-center justify-between px-2 py-1.5 rounded-sm text-sm",
              "hover:bg-accent hover:text-accent-foreground",
              "focus:outline-none focus:bg-accent focus:text-accent-foreground",
              "cursor-pointer",
              value === lang.code ? "bg-accent/50" : ""
            )}
          >
            {lang.label}
            {value === lang.code && <Check className="h-4 w-4 ml-2" />}
          </div>
        ))}
      </div>
    </PopoverContent>
  );

  if (position === "footer") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 pl-2 pr-3 text-muted-foreground hover:text-foreground"
            >
              <Globe className="h-4 w-4 mr-1" />
              {currentLanguage.label}
            </Button>
          </PopoverTrigger>
          {content}
        </Popover>
      </div>
    );
  }

  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="link" className="h-auto p-0 font-normal text-sm">
            <p className="text-muted-foreground">
              {t("addChannel.notificationLanguage")}{" "}
              <span className="text-foreground font-medium underline underline-offset-4">
                {currentLanguage.label}
              </span>
            </p>
          </Button>
        </PopoverTrigger>
        {content}
      </Popover>
    </div>
  );
};
