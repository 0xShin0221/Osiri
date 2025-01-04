// AddChannelForm.tsx
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
import { type Tables } from '@/types/database.types';
import { MultiSelect } from '../ui/multi-select';
import { DiscordIcon, EmailIcon, SlackIcon } from '../PlatformIcons';

type NotificationChannel = Tables<'notification_channels'>;
type RssFeed = Tables<'rss_feeds'>;
type NotificationSchedule = Tables<'notification_schedules'>;

const mockSlackChannels = [
  { id: 'ch1', name: '#general' },
  { id: 'ch2', name: '#random' },
  { id: 'ch3', name: '#tech-news' },
];

const mockDiscordChannels = [
  { id: 'dc1', name: '#general' },
  { id: 'dc2', name: '#announcements' },
  { id: 'dc3', name: '#feed-updates' },
];

interface AddChannelFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (channel: Partial<NotificationChannel>) => Promise<void>;
  feeds: RssFeed[];
  schedules: NotificationSchedule[];
}

export function AddChannelForm({
  open,
  onOpenChange,
  onSubmit,
  feeds,
  schedules
}: AddChannelFormProps) {
  const [platform, setPlatform] = useState<'slack' | 'discord' | 'email'>('slack');
  const [channelId, setChannelId] = useState('');
  const [selectedFeeds, setSelectedFeeds] = useState<string[]>([]);
  const [scheduleId, setScheduleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        platform,
        channel_identifier: platform === 'email' ? channelId : 
          platform === 'slack' ? mockSlackChannels.find(ch => ch.id === channelId)?.name || channelId :
          mockDiscordChannels.find(ch => ch.id === channelId)?.name || channelId,
        feed_ids: selectedFeeds,
        schedule_id: scheduleId,
        is_active: true,
        category_ids: [],
      });
      onOpenChange(false);
      // Reset form
      setPlatform('slack');
      setChannelId('');
      setSelectedFeeds([]);
      setScheduleId(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Channel</DialogTitle>
            <DialogDescription>
              Configure your new notification channel. Choose platform and settings.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            {/* Platform Selection */}
            <div className="grid gap-2">
              <Label>Platform</Label>
              <RadioGroup
                defaultValue={platform}
                onValueChange={(value: 'slack' | 'discord' | 'email') => {
                  setPlatform(value);
                  setChannelId('');
                }}
                className="grid grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem
                    value="slack"
                    id="slack"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="slack"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <SlackIcon />
                    Slack
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem
                    value="discord"
                    id="discord"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="discord"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <DiscordIcon />
                    Discord
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem
                    value="email"
                    id="email"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="email"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <EmailIcon />
                    Email
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Channel Selection */}
            {platform !== 'email' ? (
              <div className="grid gap-2">
                <Label>Channel</Label>
                <Select value={channelId} onValueChange={setChannelId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    {(platform === 'slack' ? mockSlackChannels : mockDiscordChannels).map(ch => (
                      <SelectItem key={ch.id} value={ch.id}>
                        {ch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="grid gap-2">
                <Label>Email Address</Label>
                <Input 
                  type="email"
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
            )}

            {/* Feed Selection */}
            <div className="grid gap-2">
            <Label>Select RSS Feeds</Label>
            <MultiSelect
                options={feeds.map(feed => ({
                label: feed.name,
                value: feed.id,
                description: feed.categories.join(', '),
                }))}
                selected={selectedFeeds}
                onChange={setSelectedFeeds}
                placeholder="Select feeds..."
            />

            {/* Selected Feed Categories */}
            {/* {selectedFeeds.length > 0 && (
                <div className="grid gap-2 mt-2">
                {selectedFeeds.map(feedId => {
                    const feed = feeds.find(f => f.id === feedId);
                    return feed && (
                    <div key={feedId} className="flex flex-wrap gap-1">
                        {feed.categories.map(category => (
                        <Badge 
                            key={category} 
                            variant="outline"
                            className="text-xs"
                        >
                            {category.replace(/_/g, ' ')}
                        </Badge>
                        ))}
                    </div>
                    );
                })}
                </div>
            )}*/}
            </div> 
            

            {/* Schedule Selection */}
            <div className="grid gap-2">
              <Label>Notification Schedule</Label>
              <Select 
                value={scheduleId || "realtime"} 
                onValueChange={(value) => setScheduleId(value === "realtime" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  {schedules.map(schedule => (
                    <SelectItem key={schedule.id} value={schedule.id}>
                      {schedule.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={loading || !channelId || selectedFeeds.length === 0}
            >
              {loading ? 'Adding...' : 'Add Channel'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}