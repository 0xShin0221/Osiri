import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  currentLang: string;
  onLanguageChange: (langCode: string) => void;
}

export const LanguageSelector = ({
  currentLang,
  onLanguageChange,
}: LanguageSelectorProps) => {
  const languages = [
    { code: "ja", label: "日本語" },
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="group inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 
          text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground 
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 
          disabled:pointer-events-none disabled:opacity-50 dark:focus:ring-offset-slate-900"
      >
        <Globe className="h-4 w-4" />
        <span>
          {languages.find((lang) => lang.code === currentLang)?.label ||
            "Language"}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={5}
        className="w-[150px] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in data-[side=bottom]:slide-in-from-top-2"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => onLanguageChange(lang.code)}
            className={`relative flex cursor-pointer select-none items-center px-3 py-2.5 text-sm outline-none
              ${
                currentLang === lang.code
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              }
              transition-colors`}
          >
            <span className="flex items-center gap-2">
              {currentLang === lang.code && (
                <span className="absolute left-0 flex h-full items-center pl-2 text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
              )}
              <span className={currentLang === lang.code ? "pl-4" : ""}>
                {lang.label}
              </span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
