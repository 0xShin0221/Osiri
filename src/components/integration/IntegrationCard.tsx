import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Check,
  ChevronDown,
  ExternalLink,
  Settings,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import type { Tables } from "@/types/database.types";
import { EmailSetupDialog } from "./EmailSetupDialog";

type WorkspaceConnection = Tables<"workspace_connections">;
type Platform = WorkspaceConnection["platform"];

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  platform: Platform;
  connections: WorkspaceConnection[];
  onConnect: () => void;
  onDisconnect: (connectionId: string) => void;
  onToggle: (connectionId: string, isEnabled: boolean) => void;
}

export function IntegrationCard({
  title,
  description,
  icon,
  platform,
  connections,
  onConnect,
  onDisconnect,
  onToggle,
}: IntegrationCardProps) {
  const { t } = useTranslation("integration");
  const [isOpen, setIsOpen] = useState(connections.length > 0);
  const [showEmailSetup, setShowEmailSetup] = useState(false);

  const handleEmailSubmit = async (email: string, scheduleType: string) => {
    // Here you would call your API to create a workspace connection for email
    // This is just an example of how you might structure the data
    const emailConnection = {
      platform: "email",
      email,
      scheduleType,
    };
    // Call your actual API endpoint
    // await createEmailConnection(emailConnection);
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-muted rounded-lg">{icon}</div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {title}
                {connections.length > 0 && (
                  <Badge variant="default" className="gap-1 text-xs">
                    <Check size={10} />
                    {connections.length}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="mt-1.5">
                {description}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {connections.length > 0 ? (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  {t("workspaces", { count: connections.length })}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-4 space-y-4">
                  {connections.map((connection) => (
                    <div
                      key={connection.id}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {platform === "email"
                            ? "email"
                            : connection.workspace_id}
                        </span>
                        <Switch
                          checked={connection.is_active}
                          onCheckedChange={(checked) =>
                            onToggle(connection.id, checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {t("connectedOn", {
                            date: connection.created_at
                              ? new Date(
                                  connection.created_at
                                ).toLocaleDateString()
                              : "-",
                          })}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDisconnect(connection.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t("disconnect")}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <Button
              onClick={
                platform === "email" ? () => setShowEmailSetup(true) : onConnect
              }
              className="w-full"
            >
              {platform === "email" ? (
                <>
                  <Settings className="h-4 w-4 mr-2" />
                  {t("email.setup")}
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {t("connect")}
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>

      {platform === "email" && (
        <EmailSetupDialog
          open={showEmailSetup}
          onOpenChange={setShowEmailSetup}
          onSubmit={handleEmailSubmit}
        />
      )}
    </Card>
  );
}
