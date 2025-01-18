import { Button } from "@/components/ui/button"
import type { Tables } from '@/types/database.types'
import FeedCard from './FeedCard'
import { Rss } from 'lucide-react'

type RssFeed = Tables<'rss_feeds'>

interface FeedListProps {
  feeds: RssFeed[]
  selectedFeeds: string[]
  onToggleFeed: (feedId: string) => void
  isLoading?: boolean
  onLoadMore?: () => void
  emptyMessage?: {
    icon?: React.ReactNode
    title: string
    description: string
    action?: {
      label: string
      onClick: () => void
    }
  }
}

export function FeedList({
  feeds,
  selectedFeeds,
  onToggleFeed,
  isLoading,
  onLoadMore,
  emptyMessage
}: FeedListProps) {
  if (feeds.length === 0 && emptyMessage) {
    return (
      <div className="text-center py-12">
        {emptyMessage.icon || <Rss className="mx-auto h-12 w-12 text-muted-foreground" />}
        <h3 className="mt-4 text-lg font-medium">
          {emptyMessage.title}
        </h3>
        <p className="mt-2 text-muted-foreground">
          {emptyMessage.description}
        </p>
        {emptyMessage.action && (
          <Button 
            className="mt-4"
            onClick={emptyMessage.action.onClick}
          >
            {emptyMessage.action.label}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 overflow-y-auto touch-pan-y">
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2" style={{ minHeight: 'calc(100vh - 200px)' }}>
        {feeds.map(feed => (
          <FeedCard
            key={feed.id}
            feed={feed}
            isSelected={selectedFeeds.includes(feed.id)}
            onToggle={onToggleFeed}
            isDefault={false}
          />
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-4 text-muted-foreground">
          Loading...
        </div>
      ) : (
        onLoadMore && (
          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={onLoadMore}>
              Show More
            </Button>
          </div>
        )
      )}
    </div>
  )
}