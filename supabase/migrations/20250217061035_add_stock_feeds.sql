-- Insert financial news and analysis feeds
INSERT INTO rss_feeds (name, description, site_icon, url, language, is_active, categories) VALUES
('MarketWatch Top Stories', 
 'Breaking news and analysis from MarketWatch',
 'https://s.wsj.net/public/resources/images/MW-EG169_mw_log_20160223171354.jpg',
 'https://feeds.content.dowjones.io/public/rss/mw_topstories',
 'en',
 true,
 array['market_news', 'financial_markets', 'stock_analysis']::feed_category[]
),
('CNBC Markets', 
 'Latest market news and analysis from CNBC',
 'https://static-images.cnbcfm.com/settings/cnbc_global/logonew_600x250.png',
 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114',
 'en',
 true,
 array['market_news', 'financial_markets', 'stock_analysis']::feed_category[]
),
('Investing.com News',
 'Global financial markets news and analysis',
 'https://i-invdn-com.investing.com/logos/investing-com-logo-2019.png',
 'https://www.investing.com/rss/121899.rss',
 'en',
 true,
 array['market_news', 'trading', 'financial_markets']::feed_category[]
),
('Seeking Alpha Market News',
 'Real-time market news and analysis',
 'https://static.seekingalpha.com/assets/og_image-6c03e0b6a0f8023750d47911489f1d55f7fb96b36969c1e54d0e48d8ae428730.png',
 'https://seekingalpha.com/market_currents.xml',
 'en',
 true,
 array['market_news', 'stock_analysis', 'fundamental_analysis']::feed_category[]
),
('Motley Fool UK',
 'Investment advice and stock analysis from The Motley Fool UK',
 'https://g.foolcdn.com/misc-assets/logo-tmf-primary-image.png',
 'https://www.fool.co.uk/feed/',
 'en',
 true,
 array['personal_finance', 'stock_analysis', 'fundamental_analysis']::feed_category[]
),
('INO.com Market Blog',
 'Technical analysis and trading insights',
 'https://www.ino.com/blog/wp-content/uploads/2017/01/ino-logo.jpg',
 'https://www.ino.com/blog/feed/',
 'en',
 true,
 array['trading', 'technical_analysis', 'risk_management']::feed_category[]
),
('AlphaStreet',
 'Stock market news and earnings analysis',
 'https://news.alphastreet.com/wp-content/uploads/2021/05/alphastreet-logo.png',
 'https://news.alphastreet.com/feed/',
 'en',
 true,
 array['stock_analysis', 'corporate_finance', 'fundamental_analysis']::feed_category[]
),
('RagingBull',
 'Stock trading education and market analysis',
 'https://ragingbull.com/wp-content/uploads/2020/01/rb-red-logo.png',
 'https://ragingbull.com/feed/',
 'en',
 true,
 array['trading', 'technical_analysis', 'stock_analysis']::feed_category[]
),
('Nasdaq Original Content',
 'Market insights and analysis from Nasdaq',
 'https://www.nasdaq.com/sites/acquia.corporate.nasdaq.com/files/2019-10/black_nasdaq_logo_500x300.jpg',
 'https://www.nasdaq.com/feed/nasdaq-original/rss.xml',
 'en',
 true,
 array['market_news', 'stock_analysis', 'corporate_finance']::feed_category[]
),
('MoneyControl Latest News',
 'Financial news and market updates from India',
 'https://images.moneycontrol.com/static-mcnews/2019/05/Moneycontrol-Logo-770x433.png',
 'https://www.moneycontrol.com/rss/latestnews.xml',
 'en',
 true,
 array['market_news', 'financial_markets', 'economics']::feed_category[]
),
('Scanz News',
 'Real-time market scanning and trading news',
 'https://scanz.com/wp-content/uploads/2020/03/scanz-logo.svg',
 'https://scanz.com/feed/',
 'en',
 true,
 array['trading', 'technical_analysis', 'stock_analysis']::feed_category[]
);

-- Create down migration
CREATE OR REPLACE FUNCTION remove_feed_categories() RETURNS void AS $$
BEGIN
    DELETE FROM rss_feeds WHERE name IN (
        'MarketWatch Top Stories',
        'CNBC Markets',
        'Investing.com News',
        'Seeking Alpha Market News',
        'Motley Fool UK',
        'INO.com Market Blog',
        'AlphaStreet',
        'RagingBull',
        'Nasdaq Original Content',
        'MoneyControl Latest News',
        'Scanz News'
    );
END;
$$ LANGUAGE plpgsql;