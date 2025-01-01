import { useEffect, useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOnboardingStore } from '../../stores/onboardingStore'
import { supabase } from '@/lib/supabase'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import FeedCard from '../FeedCard'
import type { Tables } from '@/types/database.types'
import { Badge } from '@/components/ui/badge'

type RssFeed = Tables<'rss_feeds'>
type FeedCategory = Tables<'rss_feeds'>['categories'][number]

const ITEMS_PER_PAGE = 10
const FREE_PLAN_LIMIT = 3
const DEFAULT_FEED_ID = import.meta.env.VITE_DEFAULT_FEED_ID as string // the Hacker News from Ycom rss feed id
if (!DEFAULT_FEED_ID) {
  console.warn('VITE_DEFAULT_FEED_ID is not defined')
}

const CATEGORY_GROUPS = [
  {
    label: 'Learning & Development',
    categories: ['learning_productivity', 'critical_thinking', 'mental_models', 'personal_development']
  },
  {
    label: 'Business & Startups',
    categories: ['startup_news', 'venture_capital', 'entrepreneurship', 'product_management', 'leadership', 'business_strategy']
  },
  {
    label: 'Technology',
    categories: ['tech_news', 'software_development', 'web_development', 'mobile_development', 'devops', 'cybersecurity']
  }
] as const;

export default function InterestSelection() {
  const [feeds, setFeeds] = useState<RssFeed[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [languageFilter, setLanguageFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<FeedCategory | 'all'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const { selectedFeeds, setSelectedFeeds } = useOnboardingStore()

  const { t } = useTranslation('onboarding')

  useEffect(() => {
    setSelectedFeeds([DEFAULT_FEED_ID])
  }, [])
  useEffect(() => {
    if (selectedFeeds.length >= FREE_PLAN_LIMIT) {
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedFeeds.length]);
  useEffect(() => {
    async function fetchFeeds() {
      setIsLoading(true)
      try {
        let query = supabase
          .from('rss_feeds')
          .select('*')
        if (categoryFilter !== 'all') {
          query = query.contains('categories', [categoryFilter])
        }
        
      
        if (currentPage === 1) {
          const { data, error } = await query
          if (error) throw error
          if (data) setFeeds(data)
        } else {
        
          const { data, error } = await query
            .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1)
          if (error) throw error
          if (data) setFeeds(prev => [...prev, ...data])
        }
      } catch (error) {
        console.error('Error fetching feeds:', error)
      } finally {
        setIsLoading(false)
      }
    }
  
    fetchFeeds()
  }, [currentPage, categoryFilter])

  const languages = useMemo(() => {
    const uniqueLanguages = [...new Set(feeds.map(feed => feed.language))]
    return uniqueLanguages.sort()
  }, [feeds])

  const handleCategoryChange = (category: FeedCategory | 'all') => {
    setCategoryFilter(category)
    setCurrentPage(1) 
    setFeeds([])      
  }

  const loadMore = () => {
    setCurrentPage(prev => prev + 1)
  }

  const filteredFeeds = useMemo(() => {
    return feeds.filter(feed => {
      const matchesSearch = 
        feed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feed.description?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesLanguage = 
        languageFilter === 'all' || feed.language === languageFilter

      const matchesCategory = 
        categoryFilter === 'all' || feed.categories.includes(categoryFilter)

      return matchesSearch && matchesLanguage && matchesCategory
    })
  }, [feeds, searchQuery, languageFilter, categoryFilter])

  const toggleFeed = (feedId: string) => {
    setSelectedFeeds(prev => {
    
      if (feedId === DEFAULT_FEED_ID) return prev;

      if (prev.includes(feedId)) {
        return prev.filter(id => id !== feedId);
      } else {
      
        if (prev.length >= FREE_PLAN_LIMIT) {
          alert(t('interests.freePlanLimit', { limit: FREE_PLAN_LIMIT }));
          
          return prev;
        }
        return [...prev, feedId];
      }
    });
  };

  const FixedHeader = ({ selectedFeeds }: { selectedFeeds: string[] }) => {
    const { t } = useTranslation('onboarding');
    const { setStep } = useOnboardingStore();
  
    return (
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b mb-4">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 max-w-7xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold">{t('interests.recommendedFeeds')}</h2>
              <p className="text-muted-foreground">{t('interests.subtitle')}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {selectedFeeds.length}/{FREE_PLAN_LIMIT} {t('interests.selected')}
              </Badge>
              {selectedFeeds.length >= FREE_PLAN_LIMIT && (
                <Button
                  onClick={() => setStep(2)}
                  className="animate-pulse"
                >
                  {t('interests.next')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  

  return (
    <div className="min-h-screen bg-background px-2 py-8">
       <FixedHeader selectedFeeds={selectedFeeds} />
      <Card className="max-w-7xl mx-auto">
        <CardContent className="p-6 space-y-8">
          {/* header */}
          {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{t('interests.recommendedFeeds')}</h2>
              <p className="text-muted-foreground">{t('interests.subtitle')}</p>
            </div>
         
          </div> */}

          {/* filter section */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder={t('interests.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {languages.map(lang => (
                  <SelectItem key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* category filter */}
          <div className="space-y-4">
            <Badge 
              variant={categoryFilter === 'all' ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() => handleCategoryChange('all')}
            >
              All Categories
            </Badge>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CATEGORY_GROUPS.map(group => (
                <div 
                  key={group.label} 
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <h3 className="font-medium mb-3 text-sm">
                    {group.label}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {group.categories.map(category => (
                      <Badge
                        key={category}
                        variant={categoryFilter === category ? "default" : "outline"}
                        className={`
                          cursor-pointer transition-all duration-200 hover:scale-105
                          ${categoryFilter === category 
                            ? 'shadow-md' 
                            : 'hover:border-primary/50'
                          }
                        `}
                        onClick={() => handleCategoryChange(category as FeedCategory)}
                      >
                        {category.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* feeds grid */}
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {filteredFeeds.map(feed => (
              <FeedCard
                key={feed.id}
                feed={feed}
                isSelected={selectedFeeds.includes(feed.id)}
                onToggle={toggleFeed}
                isLocked={!selectedFeeds.includes(feed.id) && selectedFeeds.length >= FREE_PLAN_LIMIT}
                isDefault={feed.id === DEFAULT_FEED_ID}
              />
            ))}
          </div>

          {/* loading status and pagination */}
          <div className="flex justify-center pt-4">
            {isLoading ? (
              <div className="text-muted-foreground">Loading...</div>
            ) : (
              filteredFeeds.length >= ITEMS_PER_PAGE * currentPage && (
                <Button variant="outline" onClick={loadMore}>
                  Load More
                </Button>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}