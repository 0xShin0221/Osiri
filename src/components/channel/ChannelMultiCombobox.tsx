import { Check, Plus, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const selectedItems = options.filter((option) =>
    selected.includes(option.value)
  );

  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(search.toLowerCase()) ||
      option.description?.toLowerCase().includes(search.toLowerCase())
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

  const handleOptionInteraction =
    (value: string) => (e: React.MouseEvent | React.KeyboardEvent) => {
      if (
        e.type === "click" ||
        (e as React.KeyboardEvent).key === "Enter" ||
        (e as React.KeyboardEvent).key === " "
      ) {
        e.preventDefault();
        toggleOption(value);
      }
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            <Plus className="mr-2 h-4 w-4" />
            {t("addChannel.selectFeeds")}
          </Button>
        </DialogTrigger>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-0 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
            <DialogPrimitive.Title className="sr-only">
              {t("addChannel.selectFeedsTitle")}
            </DialogPrimitive.Title>
            <div className="flex items-center justify-between p-4 border-b">
              <div className="relative flex-1 mr-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("addChannel.searchFeeds")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="h-[300px] w-full">
              <div className="p-2">
                {filteredOptions.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    {t("addChannel.noFeedsFound")}
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={handleOptionInteraction(option.value)}
                      onKeyDown={handleOptionInteraction(option.value)}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-md cursor-pointer",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring",
                        selected.includes(option.value) && "bg-accent/50"
                      )}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        {option.description && (
                          <span className="text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        )}
                      </div>
                      {selected.includes(option.value) && (
                        <Check className="h-4 w-4 ml-2 flex-shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </Dialog>
    </div>
  );
}
