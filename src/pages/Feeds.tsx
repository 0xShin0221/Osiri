import { useEffect, useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { supabase } from '@/lib/supabase'
import { useTranslation } from 'react-i18next'
import {  Rss, Plus } from 'lucide-react'
import FeedCard from '@/components/rssFeed/FeedCard'
import type { Tables } from '@/types/database.types'
import { Badge } from '@/components/ui/badge'
import { mockFeeds } from '@/mocks/feedData'
import { AddFeedRequestDialog, CategoryFilter, FeedList, FeedSearch } from '@/components/rssFeed'
import { CATEGORY_GROUPS } from '@/mocks/categoryData'

type RssFeed = Tables<'rss_feeds'>
type FeedCategory = Tables<'rss_feeds'>['categories'][number]

const ITEMS_PER_PAGE = 10

export default function FeedsPage() {
  const [allFeeds, setAllFeeds] = useState<RssFeed[]>([])
  const [followingFeeds, setFollowingFeeds] = useState<RssFeed[]>([])
  const [selectedFeeds, setSelectedFeeds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [languageFilter, setLanguageFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<FeedCategory | 'all'>('all')
  const [isLoading, setIsLoading] = useState(true)

  const { t } = useTranslation('feeds')
  useEffect(() => {
    setFollowingFeeds(mockFeeds);
    setSelectedFeeds(mockFeeds.map(feed => feed.id));
  }, []);
  // Fetch user's selected feeds and their details
  useEffect(() => {
    async function fetchUserFeeds() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // First get user's feed IDs
        const { data: userFeeds, error: userFeedsError } = await supabase
          .from('user_feeds')
          .select('feed_id')
          .eq('user_id', user.id)

        if (userFeedsError) throw userFeedsError
        const feedIds = userFeeds.map(item => item.feed_id)
        setSelectedFeeds(feedIds)

        // Then fetch the full feed details
        if (feedIds.length > 0) {
          const { data: feedDetails, error: feedDetailsError } = await supabase
            .from('rss_feeds')
            .select('*')
            .in('id', feedIds)

          if (feedDetailsError) throw feedDetailsError
          setFollowingFeeds(feedDetails || [])
        }
      } catch (error) {
        console.error('Error fetching user feeds:', error)
      }
    }
    fetchUserFeeds()
  }, [])

  // Fetch available feeds
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
          if (data) setAllFeeds(data)
        } else {
          const { data, error } = await query
            .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1)
          if (error) throw error
          if (data) setAllFeeds(prev => [...prev, ...data])
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
    const uniqueLanguages = [...new Set([...allFeeds, ...followingFeeds].map(feed => feed.language))]
    return uniqueLanguages.sort()
  }, [allFeeds, followingFeeds])

  const handleCategoryChange = (category: FeedCategory | 'all') => {
    setCategoryFilter(category)
    setCurrentPage(1) 
    setAllFeeds([])      
  }

  const loadMore = () => {
    setCurrentPage(prev => prev + 1)
  }

  const filterFeeds = (feeds: RssFeed[]) => {
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
  }

  const filteredFollowingFeeds = useMemo(() => filterFeeds(followingFeeds), 
    [followingFeeds, searchQuery, languageFilter, categoryFilter]
  )

  const filteredDiscoverFeeds = useMemo(() => filterFeeds(allFeeds).filter(
    feed => !selectedFeeds.includes(feed.id)
  ), [allFeeds, selectedFeeds, searchQuery, languageFilter, categoryFilter])

  const toggleFeed = async (feedId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      if (selectedFeeds.includes(feedId)) {
        // Remove feed
        await supabase
          .from('user_feeds')
          .delete()
          .eq('user_id', user.id)
          .eq('feed_id', feedId)
        
        setSelectedFeeds(prev => prev.filter(id => id !== feedId))
        setFollowingFeeds(prev => prev.filter(feed => feed.id !== feedId))
      } else {
        // Add feed
        await supabase
          .from('user_feeds')
          .insert({
            user_id: user.id,
            feed_id: feedId
          })
        
        setSelectedFeeds(prev => [...prev, feedId])
        const feed = allFeeds.find(f => f.id === feedId)
        if (feed) {
          setFollowingFeeds(prev => [...prev, feed])
        }
      }
    } catch (error) {
      console.error('Error toggling feed:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
            <AddFeedRequestDialog 
                onSubmit={async (request) => {
                console.log('Feed request:', request)
                }} 
            />
          </div>

        {/* Following Feeds Section */}
        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Rss className="w-5 h-5" /> 
                    {t('following.title')}
                    <Badge variant="secondary">
                      {filteredFollowingFeeds.length}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{t('following.description')}</CardDescription>
                </div>
                <Button variant="outline" onClick={() => document.getElementById('discover-section')?.scrollIntoView({ behavior: 'smooth' })}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('following.addMore')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filteredFollowingFeeds.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                  {filteredFollowingFeeds.map(feed => (
                    <FeedCard
                      key={feed.id}
                      feed={feed}
                      isSelected={selectedFeeds.includes(feed.id)}
                      onToggle={toggleFeed}
                      isDefault={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Rss className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">
                    {searchQuery || categoryFilter !== 'all' || languageFilter !== 'all'
                      ? t('following.noMatchingFeeds')
                      : t('following.noFeeds')}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {searchQuery || categoryFilter !== 'all' || languageFilter !== 'all'
                      ? t('following.tryAdjustingFilters')
                      : t('following.startByDiscovering')}
                  </p>
                  <Button 
                    className="mt-4"
                    onClick={() => document.getElementById('discover-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    {t('following.browseFeeds')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Discover Section */}
        <section id="discover-section">
          <Card>
            <CardHeader>
              <CardTitle>{t('discover.title')}</CardTitle>
              <CardDescription>{t('discover.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Categories */}
              <CategoryFilter
                categoryFilter={categoryFilter}
                onCategoryChange={handleCategoryChange}
                categoryGroups={CATEGORY_GROUPS}
              />

              {/* Available Feeds */}
              <div className="space-y-4">
                {/* Global Search & Filters */}
                <FeedSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                languageFilter={languageFilter}
                onLanguageChange={setLanguageFilter}
                languages={languages}
                />
                <h3 className="text-lg font-medium">{t('discover.availableFeeds')}</h3>
                <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                  {filteredDiscoverFeeds.map(feed => (
                    <FeedCard
                      key={feed.id}
                      feed={feed}
                      isSelected={selectedFeeds.includes(feed.id)}
                      onToggle={toggleFeed}
                      isDefault={false}
                    />
                  ))}
                </div>

                {isLoading ? (
                  <div className="text-center py-4 text-muted-foreground">
                    {t('loading')}
                  </div>
                ) : (
                    <FeedList
                    feeds={filteredDiscoverFeeds}
                    selectedFeeds={selectedFeeds}
                    onToggleFeed={toggleFeed}
                    isLoading={isLoading}
                    onLoadMore={filteredDiscoverFeeds.length >= ITEMS_PER_PAGE * currentPage ? loadMore : undefined}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}