import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

export type Option = {
  label: string;
  value: string;
  disabled?: boolean;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  maxHeight?: number;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  className,
  maxHeight = 200,
}: MultiSelectProps) {
  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  const handleRemove = (valueToRemove: string) => {
    onChange(selected.filter((value) => value !== valueToRemove));
  };

  return (
    <div
      className={`flex items-center gap-2 rounded-md ${className}`}
    >
      {/* Dropdown */}
      <Select value="_" onValueChange={handleSelect}>
        <SelectTrigger className="flex-shrink-0 w-auto min-w-[150px]">
          <SelectValue placeholder="Add items..." />
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className={`h-[${maxHeight}px] w-full`}>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={`flex items-center gap-2 ${
                  selected.includes(option.value) ? "opacity-50" : ""
                }`}
              >
                {option.label}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>

      {/* Selected Items */}
      <div className="flex flex-wrap gap-1 items-center flex-1 justify-end">
        {selected.length === 0 && (
          <span className="text-muted text-sm">{placeholder}</span>
        )}
        {selected.map((value) => {
          const option = options.find((opt) => opt.value === value);
          if (!option) return null;
          return (
            <Badge
              key={value}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {option.label}
              <button
                type="button"
                className="hover:bg-destructive/50 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(value);
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
