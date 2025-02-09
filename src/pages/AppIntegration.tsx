import { useState } from "react";

import { useTranslation } from "react-i18next";
import { DiscordIcon, EmailIcon, SlackIcon } from "@/components/PlatformIcons";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { IntegrationCard } from "@/components/integration/IntegrationCard";
import type { Tables } from "@/types/database.types";

type WorkspaceConnection = Tables<"workspace_connections">;

type Platform = WorkspaceConnection["platform"];

export default function AppIntegrationPage() {
  const [connections, setConnections] = useState<WorkspaceConnection[]>([]);
  const [_, setIsLoading] = useState(true);
  const { t } = useTranslation("integration");
  const { i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage;
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || null);
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const { data, error } = await supabase
          .from("workspace_connections")
          .select("*")
          .eq("is_disconnected", false)
          .order("created_at", { ascending: false });
        if (error) throw error;
        setConnections(data || []);
      } catch (error) {
        console.error("Error fetching connections:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConnections();
  }, []);

  const handleSlackConnect = async () => {
    if (!userId) return;
    const combinedParam = `${currentLang}_${userId}`;
    const redirectUri = `${
      import.meta.env.VITE_SUPABASE_URL
    }/functions/v1/slack-callback?lang_userId=${combinedParam}`;
    window.location.href = `https://slack.com/oauth/v2/authorize?client_id=${
      import.meta.env.VITE_SLACK_CLIENT_ID
    }&scope=channels:join,channels:read,chat:write,channels:manage,groups:read&user_scope=chat:write,channels:read,groups:read&redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;
  };

  const handleDiscordConnect = async () => {
    if (!userId) return;

    const combinedParam = `${currentLang}_${userId}`;
    const redirectUri = `${
      import.meta.env.VITE_SUPABASE_URL
    }/functions/v1/discord-callback`;

    // Required scopes for similar functionality to Slack
    const scopes = [
      "identify",
      "bot",
      "applications.commands",
      "guilds",
      "guilds.members.read",
    ].join(" ");

    const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${
      import.meta.env.VITE_DISCORD_CLIENT_ID
    }&permissions=274877925380&response_type=code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&state=${encodeURIComponent(
      combinedParam
    )}&integration_type=0&scope=${encodeURIComponent(scopes)}`;

    window.location.href = discordAuthUrl;
  };

  const handleEmailConnect = () => {
    navigate(`/${currentLang}/settings/email`);
  };

  const handleDisconnect = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from("workspace_connections")
        .update({
          is_disconnected: true,
          is_active: false,
        })
        .eq("id", connectionId);
      if (error) throw error;
      setConnections((prev) =>
        prev.map((conn) =>
          conn.id === connectionId
            ? { ...conn, is_disconnected: true, is_active: false }
            : conn
        )
      );
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  };

  const handleToggle = async (connectionId: string, isEnabled: boolean) => {
    try {
      const { error } = await supabase
        .from("workspace_connections")
        .update({ is_active: isEnabled })
        .eq("id", connectionId);
      if (error) throw error;
      setConnections((prev) =>
        prev.map((conn) =>
          conn.id === connectionId ? { ...conn, is_active: isEnabled } : conn
        )
      );
    } catch (error) {
      console.error("Error toggling connection:", error);
    }
  };

  const getConnectionsByPlatform = (platform: Platform) => {
    return connections.filter((conn) => conn.platform === platform);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t("title")}</h1>
            <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Slack */}
          <IntegrationCard
            title="Slack"
            description={t("slack.description")}
            icon={<SlackIcon />}
            platform="slack"
            connections={getConnectionsByPlatform("slack")}
            onConnect={handleSlackConnect}
            onDisconnect={handleDisconnect}
            onToggle={handleToggle}
          />

          {/* Discord */}
          <IntegrationCard
            title="Discord"
            description={t("discord.description")}
            icon={<DiscordIcon />}
            platform="discord"
            connections={getConnectionsByPlatform("discord")}
            onConnect={handleDiscordConnect}
            onDisconnect={handleDisconnect}
            onToggle={handleToggle}
          />

          {/* Email */}
          <IntegrationCard
            title="Email"
            description={t("email.description")}
            icon={<EmailIcon />}
            platform="email"
            connections={getConnectionsByPlatform("email")}
            onConnect={handleEmailConnect}
            onDisconnect={handleDisconnect}
            onToggle={handleToggle}
          />
        </div>
      </div>
    </div>
  );
}
