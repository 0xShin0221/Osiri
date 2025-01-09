import { Check, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";

type Option = {
  label: string;
  value: string;
  description?: string;
};

interface MultiFeedSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export function MultiFeedSelect({
  options,
  selected,
  onChange,
}: MultiFeedSelectProps) {
  const { t } = useTranslation("channel");
  const selectedItems = options.filter((option) =>
    selected.includes(option.value)
  );

  const toggleOption = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value]
    );
  };

  const removeItem = (value: string) => {
    onChange(selected.filter((item) => item !== value));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {selectedItems.map((item) => (
          <Badge
            key={item.value}
            variant="secondary"
            className="max-w-[150px] truncate cursor-pointer"
            onClick={() => removeItem(item.value)}
          >
            <span className="truncate">{item.label}</span>
          </Badge>
        ))}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            <Plus className="mr-2 h-4 w-4" />
            {t("addChannel.selectFeeds")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[var(--radix-dropdown-menu-trigger-width)]"
        >
          <ScrollArea className="h-[300px]">
            <DropdownMenuGroup>
              {options.length === 0 ? (
                <DropdownMenuItem disabled>
                  {t("addChannel.noFeedsFound")}
                </DropdownMenuItem>
              ) : (
                options.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onSelect={(e) => {
                      e.preventDefault();
                      toggleOption(option.value);
                    }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      {option.description && (
                        <span className="text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      )}
                    </div>
                    {selected.includes(option.value) && (
                      <Check className="h-4 w-4 ml-2" />
                    )}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuGroup>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
