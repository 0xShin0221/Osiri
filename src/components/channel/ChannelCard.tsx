import React from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Settings2 } from 'lucide-react';
import { type Tables } from '@/types/database.types';

// Types
type NotificationChannel = Tables<'notification_channels'>;

interface ChannelCardProps {
  channel: NotificationChannel;
  selected: boolean;
  onSelect: (channel: NotificationChannel) => void;
  onUpdate: (channel: NotificationChannel) => void;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  selected,
  onSelect,
  onUpdate,
}) => (
  <Card
    className={`cursor-pointer transition-all duration-200 ${
      selected ? 'ring-2 ring-primary' : 'hover:shadow-md'
    }`}
    onClick={() => onSelect(channel)}
  >
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div>
            <h3 className="font-medium">{channel.channel_identifier}</h3>
            <p className="text-sm text-muted-foreground">
              {channel.feed_ids.length} feeds
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={channel.is_active}
            onCheckedChange={(checked) => {
              onUpdate({ ...channel, is_active: checked });
            }}
          />
          <Button variant="ghost" size="icon">
            <Settings2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);