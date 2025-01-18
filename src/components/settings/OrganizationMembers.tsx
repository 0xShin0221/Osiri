import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Shield,
  Users,
  UserX,
  UserCog,
  MoreHorizontal,
  UserCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Tables } from "@/types/database.types";
import { OrganizationService } from "@/services/organization";

type OrganizationMember = Tables<"organization_members"> & {
  user: {
    id: string;
    email: string;
  };
};

interface OrganizationMembersProps {
  organizationId: string;
}

export function OrganizationMembers({
  organizationId,
}: OrganizationMembersProps) {
  const { t } = useTranslation("settings");
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] =
    useState<OrganizationMember | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const organizationService = new OrganizationService();

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const data = await organizationService.getOrganizationMembers(
        organizationId
      );
      setMembers(data as OrganizationMember[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load members");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [organizationId]);

  const handleRoleChange = async (memberId: string, newRole: string) => {
    const member = members.find((m) => m.user.id === memberId);
    if (!member) return;

    try {
      await organizationService.updateMemberRole(
        organizationId,
        memberId,
        newRole as OrganizationMember["role"]
      );
      await fetchMembers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update role");
    }
  };

  const handleRemoveMember = async () => {
    if (!selectedMember) return;

    try {
      await organizationService.removeMember(
        organizationId,
        selectedMember.user.id
      );
      setShowRemoveDialog(false);
      setSelectedMember(null);
      await fetchMembers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove member");
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "owner":
        return (
          <Badge
            variant="default"
            className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
          >
            <Shield className="w-3 h-3 mr-1" />
            {t("organization.roles.owner")}
          </Badge>
        );
      case "admin":
        return (
          <Badge
            variant="default"
            className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
          >
            <UserCog className="w-3 h-3 mr-1" />
            {t("organization.roles.admin")}
          </Badge>
        );
      default:
        return (
          <Badge
            variant="default"
            className="bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
          >
            <Users className="w-3 h-3 mr-1" />
            {t("organization.roles.member")}
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-gray-500">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm dark:bg-gray-950/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <Users className="w-6 h-6 text-blue-500" />
          {t("organization.members.title")}
        </CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          {t("organization.members.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert
            variant="destructive"
            className="mb-4 border-red-200 bg-red-50 dark:bg-red-950/50"
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.user.id}
                className="flex items-center justify-between p-4 border rounded-xl bg-white dark:bg-gray-900 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800">
                    <UserCircle className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {member.user.email}
                    </div>
                    <div className="mt-1">{getRoleBadge(member.role)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {member.role !== "owner" && (
                    <>
                      <Select
                        defaultValue={member.role}
                        onValueChange={(value) =>
                          handleRoleChange(member.user.id, value)
                        }
                      >
                        <SelectTrigger className="w-32 bg-transparent">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">
                            {t("organization.roles.admin")}
                          </SelectItem>
                          <SelectItem value="member">
                            {t("organization.roles.member")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50"
                            onClick={() => {
                              setSelectedMember(member);
                              setShowRemoveDialog(true);
                            }}
                          >
                            <UserX className="w-4 h-4 mr-2" />
                            {t("organization.members.remove")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                {t("organization.members.removeDialog.title")}
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                {t("organization.members.removeDialog.description", {
                  email: selectedMember?.user.email,
                })}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setShowRemoveDialog(false)}
                className="w-full sm:w-auto"
              >
                {t("common.cancel")}
              </Button>
              <Button
                variant="destructive"
                onClick={handleRemoveMember}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
              >
                {t("organization.members.remove")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default OrganizationMembers;
