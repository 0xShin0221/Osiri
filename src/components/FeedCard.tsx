import { Button } from "@/components/ui/button"
import { Rss, Globe, Lock, Star } from 'lucide-react'
import type { Tables } from '@/types/database.types'

type FeedCardProps = {
  feed: Tables<'rss_feeds'>
  isSelected: boolean
  onToggle: (id: string) => void
  isLocked?: boolean
  isDefault?: boolean
}

export default function FeedCard({ feed, isSelected, onToggle, isLocked, isDefault }: FeedCardProps) {
  return (
    <div
      className={`p-4 rounded-lg border transition-all duration-200 ${
        isSelected
          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
          : isLocked
          ? 'border-muted opacity-50'
          : 'border-muted hover:border-primary hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-4" onClick={() => onToggle(feed.id)}>
        <div className="flex-shrink-0">
          {feed.site_icon ? (
            <div className="w-12 h-12 rounded-lg bg-background border overflow-hidden">
              <img 
                src={feed.site_icon} 
                alt={feed.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement?.classList.add('bg-primary/10');
                  const fallbackIcon = document.createElement('div');
                  fallbackIcon.className = 'w-full h-full flex items-center justify-center';
                  fallbackIcon.innerHTML = `<svg class="w-6 h-6 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg>`;
                  target.parentElement?.appendChild(fallbackIcon);
                }}
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Rss className="w-6 h-6 text-primary" />
            </div>
          )}
        </div>

        <div className="flex-grow space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium line-clamp-1">
                {feed.name}
                {isDefault && (
                  <Star className="inline-block ml-2 w-4 h-4 text-yellow-500 fill-current" />
                )}
              </h3>
              {feed.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {feed.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <a 
              href={feed.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary"
            >
              <Globe className="w-4 h-4" />
              Visit feed
            </a>
            <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
              {feed.language.toUpperCase()}
            </span>
            {feed.categories.map(category => (
              <span key={category} className="text-xs text-muted-foreground">
                {category.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className={`flex-shrink-0 ${isSelected ? 'text-primary' : ''}`}
          onClick={() => onToggle(feed.id)}
          disabled={isLocked || isDefault}
        >
          {isLocked ? (
            <Lock className="w-4 h-4" />
          ) : isSelected ? (
            'Following'
          ) : (
            'Follow'
          )}
        </Button>
      </div>
    </div>
  )
}