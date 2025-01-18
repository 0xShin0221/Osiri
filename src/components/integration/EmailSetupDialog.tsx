import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

interface EmailSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (email: string, scheduleType: string) => Promise<void>;
}

export function EmailSetupDialog({
  open,
  onOpenChange,
  onSubmit,
}: EmailSetupDialogProps) {
  const [email, setEmail] = useState("");
  const [scheduleType, setScheduleType] = useState("daily_morning");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation("integration");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(email, scheduleType);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("email.setup.title")}</DialogTitle>
            <DialogDescription>
              {t("email.setup.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{t("email.setup.emailLabel")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("email.setup.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>{t("email.setup.frequency")}</Label>
              <Select value={scheduleType} onValueChange={setScheduleType}>
                <SelectTrigger>
                  <SelectValue placeholder={t("email.setup.selectFrequency")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily_morning">
                    {t("email.setup.schedules.daily_morning")}
                  </SelectItem>
                  <SelectItem value="daily_evening">
                    {t("email.setup.schedules.daily_evening")}
                  </SelectItem>
                  <SelectItem value="weekly_monday">
                    {t("email.setup.schedules.weekly_monday")}
                  </SelectItem>
                  <SelectItem value="weekly_sunday">
                    {t("email.setup.schedules.weekly_sunday")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={!email || isSubmitting}>
              {isSubmitting ? t("common.saving") : t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
