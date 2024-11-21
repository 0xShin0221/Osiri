import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Globe } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export const LanguageSelector = ({
  variant = "default",
}: {
  variant?: "default" | "mobile";
}) => {
  const { currentLanguage, changeLanguage, languages } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`
        group inline-flex items-center justify-center gap-1.5 rounded-md
        text-sm font-medium transition-colors
        ${
          variant === "mobile"
            ? "px-4 py-2 w-full hover:bg-accent hover:text-accent-foreground"
            : "px-3 py-1.5 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        }
      `}
      >
        <Globe className="h-4 w-4" />
        <span>
          {languages.find((lang) => lang.code === currentLanguage)?.label ||
            "Language"}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={variant === "mobile" ? "center" : "end"}
        side={variant === "mobile" ? "top" : "bottom"}
        className="w-[150px] bg-background"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`relative flex cursor-pointer select-none items-center px-3 py-2.5 text-sm
              ${
                currentLanguage === lang.code
                  ? "bg-accent text-accent-foreground"
                  : ""
              }`}
          >
            <span className="flex items-center gap-2">
              {currentLanguage === lang.code && (
                <span className="absolute left-0 flex h-full items-center pl-2 text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
              )}
              <span className={currentLanguage === lang.code ? "pl-4" : ""}>
                {lang.label}
              </span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
