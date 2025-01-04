import { Button } from "@/components/ui/button"
import { Rss, Lock, Star } from 'lucide-react'
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
      onClick={() => onToggle(feed.id)}
    >
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Icon Section */}
        <div className="flex-shrink-0 mb-2 sm:mb-0">
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

        {/* Content Section */}
        <div className="flex-grow space-y-3 w-full">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium line-clamp-1">
                {feed.name}
                {isDefault && (
                  <Star className="inline-block ml-2 w-4 h-4 text-yellow-500 fill-current" />
                )}
              </h3>
              <Button
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={`flex-shrink-0 hidden sm:flex min-w-[100px] justify-center ${
                  isSelected ? 'bg-primary/10 hover:bg-primary/20 text-primary border-primary' : ''
                }`}
                disabled={isLocked || isDefault}
              >
                {isLocked ? (
                  <><Lock className="w-4 h-4 mr-2" />Locked</>
                ) : isSelected ? (
                  <><Star className="w-4 h-4 mr-2" />Following</>
                ) : (
                  <>Follow</>
                )}
              </Button>
            </div>
            {feed.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {feed.description}
              </p>
            )}
          </div>

          {/* Tags Section */}
          <div className="flex flex-wrap gap-2">
            {/* <a 
              href={feed.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Globe className="w-4 h-4 mr-1" />
              Visit feed
            </a> */}
            <span className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full">
              {feed.language.toUpperCase()}
            </span>
            {feed.categories.map(category => (
              <span 
                key={category} 
                className="px-3 py-1 text-sm bg-muted hover:bg-muted/80 text-muted-foreground rounded-full transition-colors"
              >
                {category.replace(/_/g, ' ')}
              </span>
            ))}
          </div>

          {/* Mobile Follow Button */}
          <Button
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className={`flex-shrink-0 w-full sm:hidden ${
              isSelected ? 'bg-primary/10 hover:bg-primary/20 text-primary border-primary' : ''
            }`}
            disabled={isLocked || isDefault}
          >
            {isLocked ? (
              <><Lock className="w-4 h-4 mr-2" />Locked</>
            ) : isSelected ? (
              <><Star className="w-4 h-4 mr-2" />Following</>
            ) : (
              <>Follow</>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}