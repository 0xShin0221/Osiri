import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import { type Tables } from '@/types/database.types';

// Types
type NotificationChannel = Tables<'notification_channels'>;
type RssFeed = Tables<'rss_feeds'>;
type NotificationSchedule = Tables<'notification_schedules'>;

interface ChannelSettingsProps {
  channel: NotificationChannel;
  feeds: RssFeed[];
  schedules: NotificationSchedule[];
  onUpdate: (channel: NotificationChannel) => void;
  onDelete: (channelId: string) => void;
}

export const ChannelSettings: React.FC<ChannelSettingsProps> = ({
  channel,
  feeds,
  schedules,
  onUpdate,
  onDelete,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        {channel.channel_identifier}
      </CardTitle>
      <CardDescription>
        Configure channel settings and feed preferences
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      {/* Feed Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Selected Feeds</h3>
        <div className="grid grid-cols-1 gap-2">
          {feeds.map((feed) => (
            <div
              key={feed.id}
              className="flex items-center justify-between p-2 border rounded hover:bg-accent"
            >
              <div className="flex items-center gap-2">
                <Switch
                  checked={channel.feed_ids.includes(feed.id)}
                  onCheckedChange={(checked) => {
                    const newFeedIds = checked
                      ? [...channel.feed_ids, feed.id]
                      : channel.feed_ids.filter((id) => id !== feed.id);
                    onUpdate({ ...channel, feed_ids: newFeedIds });
                  }}
                />
                <span>{feed.name}</span>
              </div>
              <div className="flex gap-1">
                {feed.categories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Setting */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notification Schedule</h3>
        <Select
          value={channel.schedule_id || ''}
          onValueChange={(value) => {
            onUpdate({ ...channel, schedule_id: value || null });
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select schedule" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="realtime">Real-time</SelectItem>
            {schedules.map((schedule) => (
              <SelectItem key={schedule.id} value={schedule.id}>
                {schedule.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Danger Zone */}
      <div className="pt-6 border-t">
        <Button
          variant="destructive"
          onClick={() => onDelete(channel.id)}
        >
          <Trash2 className="h-4 w-4 mr-2" /> Delete Channel
        </Button>
      </div>
    </CardContent>
  </Card>
);