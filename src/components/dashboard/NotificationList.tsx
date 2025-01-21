import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";
import { NotificationCard } from "./NotificationCard";
import { TranslationWithRelations } from "@/services/translation";

interface NotificationListProps {
  translations: TranslationWithRelations[];
}

export function NotificationList({ translations }: NotificationListProps) {
  const { t } = useTranslation("dashboard");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("notifications.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {translations.map((translation) => (
              <NotificationCard
                key={translation.id}
                translation={translation}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
