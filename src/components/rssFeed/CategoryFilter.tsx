import { Badge } from "@/components/ui/badge"
import type { Tables } from '@/types/database.types'
import { Button } from "../ui/button"
import { X } from "lucide-react"
import { useTranslation } from "react-i18next"

type FeedCategory = Tables<'rss_feeds'>['categories'][number]

interface CategoryFilterProps {
  categoryFilter: FeedCategory | 'all'
  onCategoryChange: (category: FeedCategory | 'all') => void
  categoryGroups: ReadonlyArray<{
    readonly label: string
    readonly categories: ReadonlyArray<string>
  }>
}

export function CategoryFilter({
  categoryFilter,
  onCategoryChange,
  categoryGroups
}: CategoryFilterProps) {
  const { t } = useTranslation('feeds')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t('categoryFilter.title')}</h3>
        {categoryFilter !== 'all' && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onCategoryChange('all')}
          >
            {t('categoryFilter.clearFilter')}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* All Categories Card */}
        <div 
          className={`
            p-4 rounded-lg border cursor-pointer transition-all duration-200
            ${categoryFilter === 'all' 
              ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
              : 'hover:border-primary/50 hover:bg-muted/50'
            }
          `}
          onClick={() => onCategoryChange('all')}
        >
          <div className="font-medium">{t('categoryFilter.allCategories')}</div>
          <p className="text-sm text-muted-foreground mt-1">
            {t('categoryFilter.allCategoriesDescription')}
          </p>
        </div>

        {/* Category Group Cards */}
        {categoryGroups.map(group => (
          <div 
            key={group.label}
            className="p-4 rounded-lg border bg-card space-y-3"
          >
            <div className="font-medium text-sm text-muted-foreground">
             {group.label}
            </div>
            <div className="flex flex-wrap gap-2">
              {group.categories.map(category => (
                <Badge
                  key={category}
                  variant={categoryFilter === category ? "default" : "secondary"}
                  className={`
                    cursor-pointer transition-all duration-200
                    ${categoryFilter === category 
                      ? 'bg-primary hover:bg-primary/90' 
                      : 'hover:bg-secondary-foreground/10'
                    }
                  `}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCategoryChange(category as FeedCategory);
                  }}
                >
                  <span className="flex items-center gap-2">
                    {category.replace(/_/g, ' ')}
                    {categoryFilter === category && (
                      <X className="w-3 h-3" />
                    )}
                  </span>
                </Badge>
              ))}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {t('categoryFilter.categoryCount', { count: group.categories.length })}
            </div>
          </div>
        ))}
      </div>

      {categoryFilter !== 'all' && (
        <div className="bg-muted/50 rounded-lg p-3 mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {t('categoryFilter.currentFilter')}:
            </span>
            <Badge variant="default">
              {categoryFilter.replace(/_/g, ' ')}
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onCategoryChange('all')}
          >
            {t('categoryFilter.clear')}
          </Button>
        </div>
      )}
    </div>
  )
}