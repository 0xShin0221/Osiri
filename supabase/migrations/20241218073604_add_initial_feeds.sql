-- Learning Category
insert into rss_feeds (name, description, site_icon, url, language, is_active, categories) values
('Ness Labs', 
 'The science of learning and mindful productivity', 
 'https://nesslabs.com/wp-content/uploads/2022/10/nl-logo-retina.png', 
 'https://nesslabs.com/feed', 
 'en', 
 false,
 array['learning_productivity', 'cognitive_science', 'personal_development']::feed_category[]
),
('Farnam Street', 
 'Mental models and learning how to think better', 
 'https://149664534.v2.pressablecdn.com/wp-content/uploads/2021/06/fsblog-logo@2x.png', 
 'https://fs.blog/feed/', 
 'en', 
 false,
 array['mental_models', 'critical_thinking', 'personal_development']::feed_category[]
);
-- Learning Category
insert into rss_feeds (name, description, site_icon, url, language, is_active, categories) values
('The Sunday Wisdom', 
 'Weekly insights on thinking, learning, and creativity', 
 'https://coffeeandjunk.substack.com/favicon.ico', 
 'https://coffeeandjunk.substack.com/feed', 
 'en', 
 false,
 array['learning_productivity', 'personal_development', 'critical_thinking']::feed_category[]
),
('Commonplace - The Commoncog Blog', 
 'Practical insights on learning and expertise', 
 'https://commoncog.com/favicon.ico', 
 'https://commoncog.com/blog/rss/', 
 'en', 
 false,
 array['learning_productivity', 'mental_models', 'critical_thinking']::feed_category[]
),
('Scott H Young', 
 'Learning strategies and personal development', 
 'https://scotthyoung.com/favicon.ico', 
 'https://feeds.feedburner.com/scotthyoung/HAHx', 
 'en', 
 false,
 array['learning_productivity', 'personal_development']::feed_category[]
),
('Big Think', 
 'Ideas and insights from thought leaders', 
 'https://bigthink.com/wp-content/uploads/2023/06/cropped-bt-icon-512x512-1-1.png', 
 'https://feeds.feedburner.com/bigthink/main', 
 'en', 
 false,
 array['critical_thinking', 'research_papers', 'cognitive_science']::feed_category[]
);

-- Startup Category
insert into rss_feeds (name, description, site_icon, url, language, is_active, categories) values
('Steve Blank', 
 'Insights from a serial entrepreneur and startup mentor', 
 'https://steveblank.com/wp-content/uploads/2009/02/steve_blank-istanbul-300x284.jpg', 
 'http://steveblank.com/feed/', 
 'en', 
 false,
 array['entrepreneurship', 'startup_news', 'business_strategy']::feed_category[]
),
('George Hotz Blog', 
 'Thoughts on technology and entrepreneurship', 
 'https://pbs.twimg.com/profile_images/772342671721455616/FE79-7Ev_400x400.jpg', 
 'https://geohot.github.io/blog/feed.xml', 
 'en', 
 false,
 array['entrepreneurship', 'tech_news', 'artificial_intelligence']::feed_category[]
),
('Guy Kawasaki', 
 'Marketing and entrepreneurship insights', 
 'https://guykawasaki.com/favicon.ico', 
 'http://guykawasaki.com/feed/', 
 'en', 
 false,
 array['entrepreneurship', 'digital_marketing', 'business_strategy']::feed_category[]
),
('Benedict Evans', 
 'Analysis on tech and business strategy', 
 'https://ben-evans.com/favicon.ico', 
 'http://ben-evans.com/benedictevans?format=rss', 
 'en', 
 false,
 array['tech_news', 'business_strategy', 'venture_capital']::feed_category[]
),
('First Round Review', 
 'In-depth startup advice and insights', 
 'https://substackcdn.com/image/fetch/w_1200,h_600,c_fill,f_jpg,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Ffb8e4c74-d3cc-474e-a3db-eda287f3d052_2048x1152.png', 
 'https://review.firstround.com/articles/rss/', 
 'en', 
 false,
 array['startup_news', 'venture_capital', 'leadership']::feed_category[]
),
('Sam Altman', 
 'Startup wisdom from Y Combinator president', 
 'data:image/jpeg;base64,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', 
 'http://blog.samaltman.com/posts.atom', 
 'en', 
 false,
 array['startup_news', 'entrepreneurship', 'artificial_intelligence']::feed_category[]
),
('Andrew Chen', 
 'Essays on startups, growth, and network effects', 
 'https://andrewchen.com/favicon.ico', 
 'http://andrewchen.co/feed/', 
 'en', 
 false,
 array['startup_news', 'growth_marketing', 'product_management']::feed_category[]
),
('Both Sides of the Table', 
 'VC perspective on startups and entrepreneurship', 
 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAMAAADUMSJqAAAAe1BMVEURAO3///8AAOzo6P3AwPihn/b8/P/x8P6sqvYnI+308/66ufinp/bk4/zOzfrl5fyxsPdfXfB5d/JiYfDKyfkeGO0zMO7Y1/v4+P6KifTd3PuRkPQ+PO5CQO9NS+8XEO2CgPNnZvFxb/KXlvU5N+5TUfBYV/AvKu5IRu+UUp2oAAAD1UlEQVRoge2Y26KiMAxFIQrIVbxAEdQqXv//CydJW9DjzAGP8zTT/SIFugpN2mx0HCsrKysrK6v/XEWo5AB8fyPeU7zJhrWrFK0X39IhcN18YPyXPlO3U/K7vqDfCCZ/uGEk3D28dt7i6dsn8KDcbu85UtLXzueP4UDKEGM6QxfdEs+G0MFZb8LpIDZw7L447pgBcMCzpSykhu9PcX4Yje+eXGI2ZAxcCZr/ysOTk0hHowGC53zFDXYj6QSv8jxfV9hrj53AM+GdS/DN8YbhRsEbcC3/TuwN904JW0M6IaQQ9VLDo1kS8Vjvwt0JLSN8A3+Fs7rm1IQLRYKCyHCBR6Wv52/stMRxzA9WcgCX9AYQMWv1mIqcN1DjC4yHq1Sk+ZjCDHtKvoDZ43+Bzznga7rwBpyPUnqiWCMcSHhCnuDZz+GC4PjkVehoRvRX4KADFUCLsBPNbIjNtYIXn8CjxfHYJpR8MdDO6p5uxYXidwXY8wqS4Y/hvZDR8gEtKRzKcSSldRoJ+BQeXWg+lqYZM0o32ye4OxKeRwFrIhq1IUGZIycwhQmOKa2eC9RBNGX4FHuM3bqkHqXf6wAeSyrA7XzDlnztY2X1d4WpV5ahznIZPuZwGN7e9XBf2Mua1mB94PVZPZo2Wpbem2blmZ2Z9U4LkH6P/XKafwanHdwoAfJAD67uU3hBG2By3rKjAN7e+1n+EA5Xl4sC1lA/chcArbENXEEe4E8+a5zpYrjaStHdS8d4Qbg1ubfq4FioFjvohikX93F4qgZxaFz4aZ7SUOwc8ZUUHMDj6pE7PFCjGiPo0LDbitWjUHgnwMXaCD1jkRrbVFAF0I16DD3R91IGKrjyi/XcwImdxjUDYUeDJJku5IP0i+jyXMGpcNYFOmkFJxeGTpR/j1z3sJEIMRsz7QD3mP0slmGGU5Ad/R4Ir6meyv3G8+kByD1OtyO/AoCdITQ+Lx+Gb0wCXRmO8UsDPdGB+gRxq2w5gn3ebs8dSCj4iVKfJ8zATUDXXh/RYavLeaEym2q+gi/1txfPr0c+Kaqnp/asvDRqSQZheO1yrsz4u6UiD8rwHRsVVM2ImMYi3WdCwCZJWnVp8NHhzJE8LJqAdy6VivQ6s/1CqGyhb9HsBlL5yJh2H75lPTwvp369uIWG3x/OYZ7zJPPHV6CuRYJSvxkOaf+FVV3BrNBWn/LV8o9NQLFMqa8mjv4gG+m7KYVnnhTAmUBeDbZTfND0KKqKDXUrcJj0pLaIa4bhmYzcioH8W6HWBP1Dos7JEHczKaVjmkW/K/K1UWwrKysrKyurf1q/AHS6MBdQvpu3AAAAAElFTkSuQmCC', 
 'https://bothsidesofthetable.com/feed', 
 'en', 
 false,
 array['venture_capital', 'startup_news', 'business_strategy']::feed_category[]
),
('TechCrunch Startups', 
 'Latest startup news and funding updates', 
 'https://upload.wikimedia.org/wikipedia/commons/b/b7/TechCrunch_favicon_gradient.png', 
 'https://techcrunch.com/startups/feed/', 
 'en', 
 false,
 array['startup_news', 'venture_capital', 'tech_news']::feed_category[]
),
('OnStartups', 
 'Practical advice for software entrepreneurs', 
 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAMFBMVEVHcEzzeFrzeFvzeFvzeFvzeFvzeFvzeFvzeFvzeFvzeFvzeFvzeFvzeFvzeFvzeFtGhPZxAAAAD3RSTlMADrn6gDbqRsWP1W2lIVoR7q46AAABC0lEQVQ4ja2S0ZaFIAhFRU0zNf7/b4cDVLe7ph5mjS+K+3AENYR/GrO3kesR1Txanx942dhGRpQ92E5J43MUonJF+eKxUphILQlgEtVVFg18l8XiXtjkeFQi611mmXBY3ckU4HNHwYugEDpzNzUPKMAHm2sGi1BNK8rNo0UE9xgKr5rSanKF8FSb9hC5BHXeYENJBeCejERxiLopVdG4eNUeIyfUbfUux/nO0VuS87s2m13xwa23rPdAh2LcuBgAdduEwvMX58Vfw9P0yb74ahdzKX7nZ2mNnecvfioeuSlCuPHt/inN45mrorzx45GfuSnwCbcHrv+tTHrm/mdfuNfxwuUeWqtv/C/jB1tgFAg1obHTAAAAAElFTkSuQmCC', 
 'http://feed.onstartups.com/onstartups', 
 'en', 
 false,
 array['entrepreneurship', 'startup_news', 'software_development']::feed_category[]
),
('The Black Box of Product Management', 
 'Insights into product management', 
 'https://i.scdn.co/image/ab67656300005f1fd7994d5e480a7ca202a5d466', 
 'https://medium.com/feed/the-black-box-of-product-management', 
 'en', 
 false,
 array['product_management', 'leadership', 'software_development']::feed_category[]
),
('Irrational Exuberance', 
 'Engineering management and startup scaling', 
 'https://lethain.com/favicon.ico', 
 'https://lethain.com/feeds/', 
 'en', 
 false,
 array['engineering_general', 'leadership', 'system_design']::feed_category[]
);

-- Tech News Category
insert into rss_feeds (name, description, site_icon, url, language, is_active, categories) values
('Fast Company', 
 'Innovation in technology and business', 
 'https://www.fastcompany.com/favicon.ico', 
 'http://www.fastcodesign.com/rss.xml', 
 'en', 
 false,
 array['tech_news', 'business_strategy', 'product_design']::feed_category[]
),
('Forbes - Entrepreneurs', 
 'Business news and entrepreneurship insights', 
 'https://www.forbes.com/favicon.ico', 
 'http://www.forbes.com/entrepreneurs/index.xml', 
 'en', 
 false,
 array['entrepreneurship', 'business_strategy', 'startup_news']::feed_category[]
),
('SlashGear', 
 'Latest technology news and reviews', 
 'https://www.slashgear.com/img/SlashGear-Logo-RGB-White-SingleLine.svg', 
 'https://www.slashgear.com/category/technology/feed/', 
 'en', 
 false,
 array['tech_news', 'product_design', 'mobile_development']::feed_category[]
),
('VentureBeat', 
 'Tech news, analysis, and innovation', 
 'https://e7.pngegg.com/pngimages/936/267/png-clipart-venture-beat-illustration-venturebeat-logo-icons-logos-emojis-tech-companies-thumbnail.png', 
 'http://venturebeat.com/feed/', 
 'en', 
 false,
 array['tech_news', 'artificial_intelligence', 'startup_news']::feed_category[]
),
('The Verge', 
 'Technology, science, art, and culture', 
 'https://www.theverge.com/favicon.ico', 
 'http://www.theverge.com/rss/full.xml', 
 'en', 
 false,
 array['tech_news', 'product_design', 'artificial_intelligence']::feed_category[]
),
('Engadget', 
 'Latest technology news and gadgets', 
 'https://www.engadget.com/favicon.ico', 
 'http://www.engadget.com/rss-full.xml', 
 'en', 
 false,
 array['tech_news', 'mobile_development', 'artificial_intelligence']::feed_category[]
),
('Tech in Asia', 
 'Asian technology and startup news', 
 'https://techinasia.com/favicon.ico', 
 'https://feeds2.feedburner.com/PennOlson', 
 'en', 
 false,
 array['tech_news', 'startup_news', 'business_strategy']::feed_category[]
),
-- Products & Ideas Category
insert into rss_feeds (name, description, site_icon, url, language, is_active, categories) values
('Product Hunt', 
 'Daily curation of best new products', 
 'https://producthunt.com/favicon.ico', 
 'http://www.producthunt.com/feed', 
 'en', 
 false,
 array['product_management', 'product_design', 'startup_news']::feed_category[]
),
('Hacker News: Show HN', 
 'Show and tell from the tech community', 
 'https://news.ycombinator.com/favicon.ico', 
 'http://hnrss.org/show', 
 'en', 
 false,
 array['software_development', 'product_management', 'tech_news']::feed_category[]
),
('Hacker News: Launches', 
 'New product launches and announcements', 
 'https://news.ycombinator.com/favicon.ico', 
 'https://hnrss.org/launches', 
 'en', 
 false,
 array['startup_news', 'product_management', 'tech_news']::feed_category[]
),
('Sachin Rekhi Blog', 
 'Product management and entrepreneurship', 
 'https://pbs.twimg.com/profile_images/1621738374326542336/VDzd0s72_400x400.jpg', 
 'http://feeds.feedburner.com/sachinrekhiblog', 
 'en', 
 false,
 array['product_management', 'entrepreneurship', 'business_strategy']::feed_category[]
);

-- Engineering Blogs Category
insert into rss_feeds (name, description, site_icon, url, language, is_active, categories) values
('The Pragmatic Engineer', 
 'Software engineering insights', 
 'https://blog.pragmaticengineer.com/favicon.ico', 
 'https://blog.pragmaticengineer.com/rss/', 
 'en', 
 false,
 array['engineering_general', 'system_design', 'software_development']::feed_category[]
),
('Airtable Engineering', 
 'Engineering insights from Airtable team', 
 'https://airtable.com/favicon.ico', 
 'https://medium.com/feed/airtable-eng', 
 'en', 
 false,
 array['engineering_general', 'data_engineering', 'frontend_engineering']::feed_category[]
),
('Medium Engineering', 
 'Engineering challenges at Medium', 
 'https://miro.medium.com/v2/resize:fit:1200/1*oXT1gXRoUxIs8dkDB7wUDQ.png', 
 'https://medium.com/feed/medium-eng', 
 'en', 
 false,
 array['engineering_general', 'web_development', 'infrastructure']::feed_category[]
),
('PayPal Engineering', 
 'Technical insights from PayPal', 
 'https://paypal.com/favicon.ico', 
 'https://medium.com/feed/paypal-engineering', 
 'en', 
 false,
 array['engineering_general', 'system_design', 'infrastructure']::feed_category[]
),
('Pinterest Engineering', 
 'Engineering at Pinterest', 
 'https://pinterest.com/favicon.ico', 
 'https://medium.com/feed/pinterest-engineering', 
 'en', 
 false,
 array['engineering_general', 'data_engineering', 'infrastructure']::feed_category[]
),
('Grab Tech', 
 'Engineering insights from Grab', 
 'https://grab.com/favicon.ico', 
 'http://engineering.grab.com/feed.xml', 
 'en', 
 false,
 array['engineering_general', 'mobile_development', 'system_design']::feed_category[]
),
('Slack Engineering', 
 'Building Slack', 
 'https://slack.com/favicon.ico', 
 'https://slack.engineering/feed', 
 'en', 
 false,
 array['engineering_general', 'infrastructure', 'frontend_engineering']::feed_category[]
),
('GitHub Engineering', 
 'How GitHub builds GitHub', 
 'https://github.com/favicon.ico', 
 'http://githubengineering.com/atom.xml', 
 'en', 
 false,
 array['engineering_general', 'infrastructure', 'system_design']::feed_category[]
),
('Spotify Engineering', 
 'Engineering culture at Spotify', 
 'https://spotify.com/favicon.ico', 
 'http://labs.spotify.com/feed/', 
 'en', 
 false,
 array['engineering_general', 'data_engineering', 'infrastructure']::feed_category[]
),
('X (Twitter) Engineering', 
 'Building X (Twitter)', 
 'https://x.com/favicon.ico', 
 'https://blog.X.com/engineering/en_us/blog.rss', 
 'en', 
 false,
 array['engineering_general', 'infrastructure', 'system_design']::feed_category[]
),
('Stripe Blog', 
 'Building economic infrastructure', 
 'https://stripe.com/favicon.ico', 
 'https://stripe.com/blog/feed.rss', 
 'en', 
 false,
 array['engineering_general', 'infrastructure', 'system_design']::feed_category[]
),
('Instagram Engineering', 
 'Engineering at Instagram', 
 'https://cdn-images-1.medium.com/v2/resize:fit:1200/1*CPgwLHR6jno_tOmF0--7eg.jpeg', 
 'https://instagram-engineering.com/feed', 
 'en', 
 false,
 array['engineering_general', 'infrastructure', 'mobile_development']::feed_category[]
),
('Cloudflare Blog', 
 'Internet security and performance', 
 'https://cloudflare.com/favicon.ico', 
 'https://blog.cloudflare.com/rss/', 
 'en', 
 false,
 array['infrastructure', 'cybersecurity', 'system_design']::feed_category[]
),
('Asana Engineering', 
 'Building team productivity', 
 'https://asana.com/favicon.ico', 
 'https://blog.asana.com/category/eng/feed/', 
 'en', 
 false,
 array['engineering_general', 'frontend_engineering', 'infrastructure']::feed_category[]
),
('Canva Engineering', 
 'Engineering at Canva', 
 'https://static.canva.com/web/images/d7a4c70a506473e1870bee733c76b365.svg', 
 'https://www.canva.dev/blog/engineering/feed.xml', 
 'en', 
 false,
 array['engineering_general', 'frontend_engineering', 'infrastructure']::feed_category[]
),
('Airbnb Tech', 
 'Engineering at Airbnb', 
 'https://airbnb.com/favicon.ico', 
 'https://medium.com/feed/airbnb-engineering', 
 'en', 
 false,
 array['engineering_general', 'infrastructure', 'data_engineering']::feed_category[]
);

-- Machine Learning Category
insert into rss_feeds (name, description, site_icon, url, language, is_active, categories) values
('ML@CMU', 
 'Machine learning research from CMU', 
 'https://blog.ml.cmu.edu/wp-content/uploads/2018/11/mlcmu-logo.png', 
 'https://blog.ml.cmu.edu/feed/', 
 'en', 
 false,
 array['machine_learning', 'artificial_intelligence', 'research_papers']::feed_category[]
),
('DeepMind', 
 'Latest in AI research from DeepMind', 
 'https://logowik.com/content/uploads/images/google-deepmind8631.logowik.com.webp', 
 'https://deepmind.com/blog/feed/basic/', 
 'en', 
 false,
 array['artificial_intelligence', 'machine_learning', 'deep_learning']::feed_category[]
),
('Jay Alammar', 
 'Writer http://jalammar.github.io. OReilly Author http://LLM-book.com. LLM Builder @Cohere. Visualizing AI one concept at a time.', 
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqjOmIV1d6zqhF5dzzUTlkJRBUf-OAkN9q6w&s', 
 'https://jalammar.github.io/feed.xml', 
 'en', 
 false,
 array['machine_learning', 'deep_learning', 'nlp']::feed_category[]
),
('Distill', 
 'Clear explanations of machine learning', 
 'https://distill.pub/favicon.ico', 
 'http://distill.pub/rss.xml', 
 'en', 
 false,
 array['machine_learning', 'deep_learning', 'artificial_intelligence']::feed_category[]
),
('Lil Log', 
 'Deep learning and AI research notes', 
 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADg0lEQVR4Ae1XA5QkSRTMs23btm3bNp/OvvVW9XDZXdXjmcKtbRvVPWxrbW9bcT/Pvq1ZI96L8o+I/GX2fwgEAvsYntBFs12BR2a7gu/Q8heGO9ze8EaE2a5QkeENCbTezuGOfEbzNw136AFHs/88wzD2Yq0FgD2d7vAbhic8npggUZhnOOrwhIc73cFn27RpszszAxql2uCLoN4b4WKtZpN/LpoDc2G4goXMDCY7WrypdAa5XB5r1scwf+kK+OYuQiMJOv7FjId1heYjvGAplqxcg1giBY5MNotxMxtnMDMoKv+hacLMBiSSKfwV+XyeiyKVTiOZSoMHzeZy/3jc2mgMo6bMRoFdN5gZiLI2RZBUjJvVhCZqIR/V4hWrsXpdFNF4khsjncly8gCIU9B10TiWr16H+UuoW3MWwekJY5LDBa4jSuo4cwEkTeeFvUZM2qhrYMiEWTwAUVOYGXSWlDa8sHvdADh4F+waXF+J8Lz5KXxPvgP/fS8hcMczCNz2FPjcf++L8D3xFjyvfwzXF53RZK2FY5oTNQNH/9IBrQ0zA0Guu48XcjZfeT9CF99pmp5L70Zpt2pwjU7WugeZGRTU1BwgSEqMF1ccfQn6HXwORh1zCSafeCVmnHoNjDOuh/PMG1B/1o2op7mD1meeei0mn3QlRtNxAw45F9UHnQ2hZy1vf7Jr17qDmVlYJE3hAXre9Diq9jzZNK3XPfLrBdiftQZimXI1CeSLvrKgaq9TTJlX7n0qCtuUgOrRWVbuZK0Fta8XF7He+JipAN0ffu3Xi28M2xhYKnsdS0JLxK5VsJ9+3QaZ2655EIJNAdWt7yTrZ7ONBQndSJ2IiaXlkOjK/ldzansPuj0Fax03z3aW1SfYpoIoKbcRV/ORlXz4LaTL7kHFoeehcp/TUH7UxbDShVr4beGvD50k8Xm2qWGR9DNEWZvETX7hr63+I92Fsn4V21wAsJto154ko8nEHBEUKi/Kar3Fpr/dplevvdmWAhlP/WXUC81Xb9oAC3YF2BVgV4CdK0CBvddpgqxWk3GWCGKe1vsJUq+L2OZEsbXXCWRkI8MUEf/AbGdJrSrqoZ3ENiX4f51F1toLNjXOjf6PnSUlJtr1T9mmArX2EBJeQ4QJBgHsxjYVCiX1SLro3iVhjdhAp2IJ74goqWlaj4qyupA4k44pE2Tl2TbS4P03VPtHO0leZ9KoGYUAAAAASUVORK5CYII=', 
 'https://lilianweng.github.io/lil-log/feed.xml', 
 'en', 
 false,
 array['deep_learning', 'machine_learning', 'artificial_intelligence']::feed_category[]
),
('MIT AI News', 
 'Latest in AI research from MIT', 
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTs2JoLLmjfdYZ2Twavh6nDP0ooCeayukb0Ww&s', 
 'http://news.mit.edu/rss/topic/artificial-intelligence2', 
 'en', 
 false,
 array['artificial_intelligence', 'research_papers', 'machine_learning']::feed_category[]
),
('BAIR Blog', 
 'Berkeley AI Research insights', 
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoecCSYBGZ4X_XWkLpLTMaLDRWIHE-YKx9VQ&s', 
 'http://bair.berkeley.edu/blog/feed.xml', 
 'en', 
 false,
 array['artificial_intelligence', 'machine_learning', 'research_papers']::feed_category[]
),
('OpenAI', 
 'Advanced AI research and deployment', 
 'https://openai.com/favicon.ico', 
 'https://openai.com/news/rss.xml', 
 'en', 
 false,
 array['artificial_intelligence', 'machine_learning', 'nlp']::feed_category[]
),
('Google AI Blog', 
 'AI research from Google', 
 'https://storage.googleapis.com/gweb-research2023-media/original_images/lockup_GoogleResearch_FullColor_Twitter.jpg', 
 'http://googleresearch.blogspot.com/atom.xml', 
 'en', 
 false,
 array['artificial_intelligence', 'machine_learning', 'deep_learning']::feed_category[]
);

-- Design Category
insert into rss_feeds (name, description, site_icon, url, language, is_active, categories) values
('UX Planet', 
 'UX design articles and resources', 
 'https://cdn-images-1.medium.com/v2/resize:fit:1200/1*A0FnBy5FBoVQC02SZXLXPg.png', 
 'https://uxplanet.org/feed', 
 'en', 
 false,
 array['ux_design', 'interaction_design', 'product_design']::feed_category[]
),
('UX Movement', 
 'UX design patterns and solutions', 
 'https://miro.medium.com/v2/resize:fit:2400/1*0hVXTjSwlD8Kje1OlclpDg.png', 
 'http://feeds.feedburner.com/uxmovement', 
 'en', 
 false,
 array['ux_design', 'interaction_design', 'ui_design']::feed_category[]
),
('Inside Design', 
 'InVision design blog', 
 'https://www.invisionapp.com/favicon.ico', 
 'http://blog.invisionapp.com/feed/', 
 'en', 
 false,
 array['product_design', 'design_systems', 'ui_design']::feed_category[]
),
('Airbnb Design', 
 'Design at Airbnb', 
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3pUdXVG1y-3M3o5wSzXZwJ5Snx3Ct4g42Dg&s', 
 'http://airbnb.design/feed/', 
 'en', 
 false,
 array['design_systems', 'product_design', 'ux_design']::feed_category[]
),
('web.dev', 
 'Web development best practices', 
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYX-1QYJ8eYGfXwI0V381p7VDOJQr6HC4ryw&s', 
 'https://web.dev/feed.xml', 
 'en', 
 false,
 array['web_development', 'web_design', 'frontend_engineering']::feed_category[]
),
('CSS-Tricks', 
 'CSS tips and techniques', 
 'https://css-tricks.com/favicon.ico', 
 'https://feeds.feedburner.com/CssTricks', 
 'en', 
 false,
 array['web_development', 'frontend_engineering', 'web_design']::feed_category[]
);

-- Psychology Category
insert into rss_feeds (name, description, site_icon, url, language, is_active, categories) values
('PsyBlog', 
 'Scientific insights into psychology', 
 'https://www.spring.org.uk/favicon.ico', 
 'http://feeds.feedburner.com/PsychologyBlog', 
 'en', 
 false,
 array['psychology', 'cognitive_science', 'research_papers']::feed_category[]
),
('Psychology Today', 
 'Popular psychology insights', 
 'https://seekvectorlogo.net/wp-content/uploads/2019/07/psychology-today-vector-logo.png', 
 'https://www.psychologytoday.com/intl/rss.xml', 
 'en', 
 false,
 array['psychology', 'cognitive_science', 'personal_development']::feed_category[]
),
('Psychology Headlines', 
 'Latest psychology research news', 
 'https://www.socialpsychology.org/favicon.ico', 
 'http://www.socialpsychology.org/headlines.rss', 
 'en', 
 false,
 array['psychology', 'research_papers', 'cognitive_science']::feed_category[]
),
('Nautilus', 
 'Science and psychology insights', 
 'https://nautil.us/favicon.ico', 
 'https://nautil.us/rss/all', 
 'en', 
 false,
 array['psychology', 'cognitive_science', 'research_papers']::feed_category[]
),
('Freakonomics', 
 'Psychology of economics and behavior', 
 'https://freakonomics.com/favicon.ico', 
 'http://freakonomics.blogs.nytimes.com/feed/', 
 'en', 
 false,
 array['psychology', 'data_analytics', 'research_papers']::feed_category[]
);

-- Science Category
insert into rss_feeds (name, description, site_icon, url, language, is_active, categories) values
('Quanta Magazine', 
 'Science and mathematics news', 
 'data:image/png;base64,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', 
 'http://www.quantamagazine.org/feed/', 
 'en', 
 false,
 array['research_papers', 'computer_science', 'data_science']::feed_category[]
),
('Nature', 
 'Leading international science journal', 
 'https://media.springernature.com/full/nature-cms/uploads/product/nature/header-86f1267ea01eccd46b530284be10585e.svg', 
 'http://www.nature.com/nature/current_issue/rss', 
 'en', 
 false,
 array['research_papers', 'artificial_intelligence', 'cognitive_science']::feed_category[]
),
('MIT Technology News', 
 'Latest technology research from MIT', 
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTs2JoLLmjfdYZ2Twavh6nDP0ooCeayukb0Ww&s', 
 'https://news.mit.edu/rss/research', 
 'en', 
 false,
 array['tech_news', 'artificial_intelligence', 'research_papers']::feed_category[]
),
('ScienceAlert', 
 'Latest discoveries in science', 
 'data:image/png;base64,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', 
 'https://www.sciencealert.com/rss', 
 'en', 
 false,
 array['research_papers', 'cognitive_science', 'artificial_intelligence']::feed_category[]
),
('Singularity Hub', 
 'Future science and technology', 
 'https://singularityhub.com/favicon.ico', 
 'https://singularityhub.com/feed/', 
 'en', 
 false,
 array['artificial_intelligence', 'tech_news', 'research_papers']::feed_category[]
);

-- Neuroscience Category
insert into rss_feeds (name, description, site_icon, url, language, is_active, categories) values
('Neuroscience News', 
 'Latest neuroscience research', 
 'https://neurosciencenews.com/favicon.ico', 
 'http://neurosciencenews.com/feed/', 
 'en', 
 false,
 array['neuroscience', 'cognitive_science', 'research_papers']::feed_category[]
),
('ScienceDaily Neuroscience', 
 'Daily neuroscience updates', 
 'https://www.sciencedaily.com/favicon.ico', 
 'https://sciencedaily.com/rss/mind_brain/neuroscience.xml', 
 'en', 
 false,
 array['neuroscience', 'cognitive_science', 'research_papers']::feed_category[]
),
('SharpBrains', 
 'Brain science and health', 
 'https://sharpbrains.com/favicon.ico', 
 'http://www.sharpbrains.com/feed/', 
 'en', 
 false,
 array['neuroscience', 'cognitive_science', 'personal_development']::feed_category[]
);

-- Marketing Category
insert into rss_feeds (name, description, site_icon, url, language, is_active, categories) values
('Moz Blog', 
 'SEO and online marketing insights', 
 'https://moz.com/favicon.ico', 
 'http://feeds.feedburner.com/seomoz', 
 'en', 
 false,
 array['seo', 'digital_marketing', 'content_marketing']::feed_category[]
),
('Content Marketing Institute', 
 'Content marketing strategy', 
 'https://contentmarketinginstitute.com/favicon.ico', 
 'http://feeds.feedburner.com/cmi-content-marketing', 
 'en', 
 false,
 array['content_marketing', 'digital_marketing', 'marketing_analytics']::feed_category[]
),
('Neil Patel', 
 'Digital marketing strategies', 
 'https://neilpatel.com/favicon.ico', 
 'http://feeds.feedburner.com/KISSmetrics', 
 'en', 
 false,
 array['digital_marketing', 'seo', 'growth_marketing']::feed_category[]
),
('MarketingProfs', 
 'Marketing resources and training', 
 'https://www.marketingprofs.com/favicon.ico', 
 'http://rss.marketingprofs.com/marketingprofs/daily', 
 'en', 
 false,
 array['digital_marketing', 'content_marketing', 'marketing_analytics']::feed_category[]
),
('Quick Sprout', 
 'Online marketing and growth', 
 'https://www.quicksprout.com/favicon.ico', 
 'http://www.quicksprout.com/feed/', 
 'en', 
 false,
 array['growth_marketing', 'digital_marketing', 'seo']::feed_category[]
),
('Social Media Examiner', 
 'Social media marketing tactics', 
 'https://www.socialmediaexaminer.com/favicon.ico', 
 'http://www.socialmediaexaminer.com/feed/', 
 'en', 
 false,
 array['social_media', 'digital_marketing', 'content_marketing']::feed_category[]
),
('Convince and Convert', 
 'Digital marketing strategy', 
 'https://www.convinceandconvert.com/favicon.ico', 
 'http://www.convinceandconvert.com/feed/', 
 'en', 
 false,
 array['digital_marketing', 'content_marketing', 'social_media']::feed_category[]
),
('Hubspot Blog', 
 'Inbound marketing and sales', 
 'https://www.hubspot.com/favicon.ico', 
 'http://blog.hubspot.com/marketing/rss.xml', 
 'en', 
 false,
 array['digital_marketing', 'growth_marketing', 'content_marketing']::feed_category[]
),
('Seth Godin', 
 'Marketing thought leadership', 
 'https://seths.blog/favicon.ico', 
 'http://sethgodin.typepad.com/seths_blog/atom.xml', 
 'en', 
 false,
 array['digital_marketing', 'leadership', 'growth_marketing']::feed_category[]
),
('Backlinko', 
 'SEO and content marketing', 
 'https://backlinko.com/favicon.ico', 
 'http://backlinko.com/feed', 
 'en', 
 false,
 array['seo', 'content_marketing', 'digital_marketing']::feed_category[]
);

-- Additional Technical Blogs
insert into rss_feeds (name, description, site_icon, url, language, is_active, categories) values
('Julia Evans', 
 'Programming and systems', 
 'https://jvns.ca/favicon.ico', 
 'https://jvns.ca/atom.xml', 
 'en', 
 false,
 array['software_development', 'system_design', 'infrastructure']::feed_category[]
),
('Martin Kleppmann', 
 'Distributed systems and data', 
 'data:image/webp;base64,UklGRhgVAABXRUJQVlA4IAwVAADQiACdASo4ATgBPoE8mkmlIyKmpRFLGNAQCWdu1SoOL5cKyL4t3RSrzNP14cv5jK9XPmYCtmRorwUWk12ESzyU7tkXxYWfUuSlHAm69TcWfuqFoph3hcblTCJsaPrkfm/5hUC9/T8hgjNlQfy4oohAY0PGK3JjtOoaD/qW5TLPWY79gU9FmCbhYkaN5hti81zehW5mAZHfA/ORr9tsiorgnKxtJJf/ddjYku9Aw2/bmWOfL0AjxK06Eew1MGJgLAs7OI5K7sczZQP5oHUS6WpDWDboa16zzb0nCNWQMqI4vNJt6bXsQO9paHWY6g6pGmnWd8HYgRPCE2p0/4pn+J3C+56LMLlIdnniZMCKgGwTfUTROkxiA5ffyYPV4I3vglrNW4W6r6ctSpIXidv8SoSzD88VDbYXFcDy2mFfmJksqVztInCFVPM4Mck2GiFtFENTBVAJnWSSht/bXmDAvBPUi0XSstG+4jnq0NcWVI/T75IHnNhKGiw/bIVtxTeU7yxLgFED0FIMB4KfxMzoCCDOfmYPF7FMaWWEryhy8i0l6e+Fqw/mT5HkHLT99dRQwKeLJc52tVJ2lSk8s/ftrZuR8Wt/klHSUtnvEYdKNIm/px8SYd1r4ACR39SfYXmel42zCyVuQxSS377rPbWQtCyeSabcA7eCNVcyOmior2q08zUW1P6wWloNsxCsOKzxk0F2uwP/XQKc6cAeDY1vGiidz2oGSvWTwAvHH5QuHQL++ZhE4n4JAFZNVBarCFlQI48KF+OCAWkTT+8QVu4+4XnaOP6gkjyV///+dY4M6E/kDEhmiIIAlTOrTWIgt+4TquhSgDc2B0rQ8W95PUEtpjApFkQxMuOdQT8vf1+bX+C46nzv5bxykZrfyPgVWB5/aljkLOcgRRBgM5dEjdvyEvs6CqyIwzyg8XKTkmzpVpoeBfGngKi30blUaBy3pz++Ja/I42xv0QHnl7xUuXB5R6Z6f5jtS8a64Wn3ae89LVh54ntPdyAtdQcyvc3v2ePdPNqND9el/pZTxTRuJ5bshgA3fFbMT86AfhZ+LHV5JlfyfWbDHoWFB74J1Rn8SpIGAVIrd1eN4oDs+agTCzS9YBDLBEGtlxcFWc/QDngFWZFzrxEjEWdWWzsxKURIYNrz5I53peSDLcPYG5L6/o2shrA0Txjd3qyu6hbf5e/mn5WS7lwRSUbxEGmzwiVS7ktnYGSX1u+3FrSonWQtJoyAFcjRIqSsOX+rBO+jX5uDWaXdndJZZIGL+/monQUWuMvoaV7/Oqmum4NSwoRw6VizxKx8SBw2KyM0R7v1Y9k5SE86vaM/cox0XD0XTG2TZZC5rfGyww+SsIrh3oLNonFkj6dMbEGJRsunt/Zt00Wd6CbOm+5V9oTolbiGX/vJaat6RbOPf2ZGUxnktD3iQybldUxfMhP7G8o9K3mo5vQEwXw0+gjk6IHCT13hoJxsNAaoeAD+8oh/16yNr1rcq0RSc9PdYbxEuhBkYyXbf/Up7YM5xXVXTzoIKuqShkRZewAAIGwiYFFsgXIGxDvL3vQPzHeEh6tKS2z3Dwk1yzMMx+DWES5RmsO8BZiAABPZVKBuwRi4VPsg47fHRbNkdY5AtrnUxBjhSeaAGs+gBkeq32xgo+lxEpDAKJoDXPIR9rjkimrxofAc+4VBub8y58P6vKoIF7iBjKNxAJXJ/+mM0lxwHsvDXv3ms/VYAlM2LcaQkVvrwR0AcjD8FbILoQ9R8e2Chx7J+zk/BTLMXp8CdSEoI65XUyYz0oRByTu8FT9/ei4nEY3EOZREo1CsviE0ejN9ybPEADq9kyYYwz4RV7IbteEEuztUz5bqtxTqoN6aR/afbW5dFt52UGbsoVNTBPJYh3YjORVetO9MehKaKniMOZcouhE333vyLCWbSO8xhz9qCvqfFCaDl7KI+R2psdo64pM0z//XRCrhSSGt/htDoWfNtNrLoqQI0pPbR3PYvASw+6wMwMM5BX5HD4OJw6Gx/gdwfSlRwhTAd8hPfcKrmNY6o6DJnpmEucrdCYoVEz2Q4uLsDTDvokfQxGdEv838pfVUE+pEjuLLjc/UKmKzGQzB6ye32SLXbMt6JKnrInQLLjCe7gIQ8x1t5MY6G/+J+gkaTfjzyvzwFnxo/qgSXIAABlDjOXTB6ALAzvw1D4q+9q8K1X2ENG6RYR3Th1YejG/EZoVc0IiLN4sIV8TrIY2Z7tpHa7Zaejyvdg4rUXdGJnJsK6YWbY2AOfLtV98SRXBoscex4oFhzlMRYtfZh1HNuJCcO1U9Fso2sprDMQZ2YAnCOPBrY5crUcQhc4c+2NZdxchkn8AnQmrgpMki7wKrDFybzDjDcVF5NpNO4xThzhfCv5wJ2AmdF3GFzvTf0stXLmOpDaqwrXFGxI0dU4pQn0wy90Yi04vTRjPrRYIzKAvCxKsAJ1mY+S/9qd60hiTPf1r74kD9prWgpT4OguC50JKUskUyeAqPNl3b2LclRD262LBLOtF9NvuPucDHftdnlRWZn0fFrYjXRkFUTxtu+XcjxoG5eJma1pNa5BEIHwMUtjXxN5tYnRMfNiIo89V5pdWgz0tYf/B5xK9F3CLjLYPrzNvAFGqtlD0IooKEaIGjUTmbSdK4MmG40GqY+9mDKr+QA2e0H7CQrG1VDzmACSvoB6FpR5Yr2tQDSoUMgQ4hUCe37vE0JALqEe/fDZmc7iWAaBhH2fPxZ8iepgfeEZ5RrW3afHvnHTtVoNgyPwJVZ4E5ZBmasY7hChyZD9nA0DbfbWzBNL71mK8Ko1ZMCUHnVSfJzsKd7tfyxpYlVqalGBoRKQFGsxEv9tKr0HNoih2+sYMV/njjcsJQxqwAegWmjgBZGjpeTwOxvLDE+QyBKxYVI4R+49VL6l2h/R2BuGHo8Y3Gl4hx+BtGHs5Q85Cr2YCvUEei4C0vDqS/xS8kEOXbLFQXvgZa7OMSfdzffuujPAGiEbkPrUoUrpyKCyVqzwDYsK6dsriXNys3P0GyLn//fzm3hA3KAvg5ctKwsPEbPH/66vJvNqVNSPepfiurJIbpN5J+rVTteUR3OGnosrw7ZlPGl/UdoAuEqlCoXxWWepJBxKPN9El6XYVdMaJNYPQXmWCdjrUSl91wDJ6GWvIBjzZ/vrd5Mti/pwSgps+IG92+ncZ7kcLmaInC3FkCT/A9ZeS5crV8asHmPMUnuIEpFkkDbmQfDcubhJ/H3SSN/9SwOktn22sQ+ZETOXVYclKmBO7DzXybd0vghAmu8kbNIMfkmBrrihHjatBFocyc6m/v3+gGwOsWnZAh+8ZhV/KDedL2F/5jlYAYESCm9ocEGJF0A05RfRhLUN2Gwvdy9kj/rRIkOyBdIK/zmQ1BRTR2iLH5iqUIt4Q4O/npEsO0+tMhH7Hr4z8A+JEfk6AudTNTIu8Vl1OxHAaSXA2bH+LpkrWTyHLZ+yG/vIoWCc1QY0HE/SqG6roGf7TxCKbie67uJrUl9GNC2+/FnFsqRFaee69DqjNjn9JqeVF0nq6IM07wDhMcEnhJ54QtJaH7YvKSfT1lMKrLCXsYmX4Lt3b7gvz2zfEZ/vwMcP8IYlKS4riKR075PDeVjh7eQOg2oy/vypQEIjDZcYGqjL7eHx5qd7WUHPGiPErkmdmoXcXroREcmeyiFN7SkHNq4VlFfHEj5Uhz1MmYYFcAStrF6v4fHc+yXi9T60GufKtuzYnaZZGy6a88GzISUPw1Pf2PXdyxdeWpKj+erZUNI/vYjDdLPVLxj4AHVIqbm90Ex47K87fmSqY3nLFz5ei+bePUDyoa4fJPH0BX0nxUWepTHk5D+eEFiHdkCtBHh6TZ0Ojm+C6SMUJhDm5+PpVKNL++1DzPUupe2en3DxBydLZYZl1NAphPLLgisIuUBi6b/KGP6oc/6R1L08Y7QsKqAWLKrk/F+NDkeY0bkNZ0cANtvAEsIh/k/M6vso2NGES6RsLXQIfgHxDPCgiRYG6nB6REOI6BtKo9VXrBgjQ+JieE4Xq5DMamCMTO7z+tsME0PJPmLR+nFMkch4FjB79QBtulXSL694OYPxME4Kc8SWVTsS9j9RPXibZkRsrM8uDzENi0SgSD4+nQDRV+mOOVDjfLfJSEfa5VZNI/4DO6EHjTld4ISGn/MlPw0qi92hXpxyMZ7tpV2GAJKxJCyA8wEVFT41cj5r/sU5EBl+U19flW/EgReglGvBm2zEnKNyaQzgsqP8TSBgPapTEUSWxMh7+iXAbtBoS0e/Z5DtgjzKilZY4m5jWALL7UN4BRk679NepnsMOqmughRVcWE6knBKDdhEVrdxaD9uN0+qXWbBpYlTsMCYNrd2nK2tOGhVTO2Kt9ne5U8TyR8FhOarIHVn+XnbEjjLDU23IY8BSzpSQmi+Wedpaqf2SvHRZc6GnaS1unhXW8Jlj9BWUaMwFwwKcAJkbm4bRJqxNDhpyhHL2xx1X/8U+MlwB2dOi/7bMZOsSOs3hfIeoTXSDrUDz8s9C3c36q1f+XpQnJNJk7mKqf3USvfupMYFFndGK2GfDkMCGKBJeOi+lscTJjPPQoFMZWgsSPVkTNaCDeH1GBhKuTWgPRfY4beDl0s3u47v34ecppC6TAeVJ/BW+6J58h3c5+EBavG9GOtckihIaVPgh+XB+BjFNteAItWc/MOlfdMuthHB6DSbg9PHFXB3G8kUL2cOZXbtYArQdRwHqRFA6EDrVUcCZ48W1SStvmaBTN6R5A2Dc0AmI+GTsTB2dkhPlXDj0T6rE8iDjz5O/K8/br/OANMPp8axkRqfe8X9O+Zrsf/To+f3CI5YNIcVZcLq2Cuj6vtg9t+mQHE8BrLqm2nwewQAiTD4uzIoJskLfbFR766x/MVD1OBzYaLQ4OQYl388c2G8POZSOQlmOSoB6OQcf8ooeLHkcohl7Ag8AoyxSTdWwGd4+bAVKI7EZ+rRfwCzdtJ9Pbg0cbzCaZx6ZtrWOrzmvLXSNEQ4zOjfzyN42bUS+RhvBJsw+PlxwtywlKIrHfBsDAYCowqCxwdD2juhVBJmhSHBH97z6YM9+v7DmJoY2BblJKjYapplu/c7SnA7qr8/bpzTKfgFDTX+iwdeftwGNcE0eREi2yBXAM+TeyFC+8E3HUpOxaSNSgEb2pjsOa2q1fMqOARznxeTHLCLPS7aVxUwkA2YE7e4FD0Ptg6P2pSgGSSQG3+k4AVIBUb49+/NgKMTIXBG30RaHzRz3xZg5bd8qcvXkcwAgQUXwCDD6VyL6ONRyhQGGrcPSUky7fBtgyStoBqqqWZ+XnWE/7ZH1Alhz0+N+VMD61jNU26/+d+LJBmewbb+2+SMhbEL7IECDRi9AMWdtZldLO9uI24biTfv8u+n/bE7eEfvlecg/mtXuVgRnMQEYmjUmbOzH8+W7nGD7MXAqWElGglEQ6FSNlH0jdxecYyJE9i71ac2ekSpwORuUFxGwyYPBW3PmBsfv4M1sk9Yas00lgdH3Cqf+ouEVM/iPZEY6Zh8lzK4q1ehIAakJMCwKN1+2h6EGGWr8BQAyoCouc0CwKQClcPhBaLDbQ7tNeMIqDP+Ma5mmOrGBQp8fVo6zOX75l66j44WoCQSPyDKdHUTwRU9HjFGo3qx6BirGAkPJCvBJpL4GkiH+OptKnTv2Q6hmaU3QcZAhhYLGOneThhVX0b5sWleNit4yCn3pLFXZejjBLDWrp6NNE9LgPr2SdUYtM1DcEWrcsAsR9vH40x9PyIntYZivrTX8q1nXO3SHy76eygdauXoJpoDMvV4lJCuCHkqHAWWYwpkge/foRAfQXYFiL9YKZehvMRT9uTHFXBKTK9x7Yrm/cSXASM3KWLZ6+qJWIuPIunq2Vczl/acECrhvEZf9bdTWVYwAt+WBwQMH7YJNd+GCtv9IXMRVmJp/97WDUMmCkesIxIwZhj6GdnuWALwHJPvDRQwm8zI+w7vCxzBS71imkLPreFyP29WSbtzbN7CIgCpMRxhSYK+OWY9QfVkTyT3a417++AnWSR8vRZbguWVLXE/e02JXuo/xfwib1ScR3yK0kmh/rhsTAjnLeb7zw1CQeE+lk3mj/pvxYBhfX6dF1cagBY76xhqjFrSuRmR2RTzG7sDIE/z7F5Zbe6Aa97qdVU4ViCvXQF8pEoyUQxjrIkAZHZbJPVzmCVHfpwpT7BAISLJPxeSgphXmUOlyBVeqSvhooJQbZow9i/SA4iP1tQ8zqpL7nkL3pFllHb6Fi8ICVDg3B6SG2veY/0THthKR1vBs8/El0YqgxYJswccnNnJA6xDEUqnXKsru+SQ6mB6wqopnPgCg2IlLRj4wCiPyUNxclC9X/rxHRw26d69MJi2c7c8RU8BQfGQVuzDA5ClQTlrTXDmiEEcPWf2EcWfEScLol7BTxEeIc0KBxOeygoDo8XLIS5vPQHsD+gJbDN2rcHHIZ8olZDpFja68m+9AmfrWXPgHSNhOcbyetqwFas55CvuFAu/hJ+8fy6jl9cPHCgXbttfr4kXrAIxNfbPEmcqEviNE6YXvkFG8FWn4gG6q3XM7RuHiDU4IEeisHOc7HhzYyExLTElRRFw8G2kA8i9GWSG+xLkYSngi83qC84NdGwWOXX2nEImreIBouEKgcrLUBGWlzOK+4IWxb52jFERgUuNnNuEESNLurqUTtruvJkV34b2JnfXFZpJDKmvkMJs5gvnIcoN/8NYgHanCJ6Je1dOY0wCc9pSIZlakhAH4e1T0MemXOx26VwnEgW67gGf64tYrda9KWWNh6Qovv3QvvZub8C05mVJqJRAkV6TkdsMQw35odBRjWOI7qXBARiOD5cZugYvEaUb90mvx9tigjbLfZR/FBvNzndfuDxSfH+v/BQSunYZmGYGVa47N0ho772uUpa7/8gyGWJ+mEuiePTwEQmYEwJRrfatB23KuXYsgXUEKLN3a5HuD4tnujAxhjhic5bl0JokyYIeAEP474fCqGmmK8DfKAvwRfrPVnqpTbr1o/pdZHHrJLCw0K7rlNpb30hUGxJc0FJeVHc/Rk0GM3UVf4Z+MyIYPdBoxCWUkscDb+BXftOiMrLm56rk0y7y6d96B+J5t63NFfOXUqJGYSNpWp1ckIMWePkiRrPflQJlZe3s6S/15zwlrLEDilmwTMgJWhVoTGzuBIZExjhAtgA3M2tGjgAAA=', 
 'https://feeds.feedburner.com/martinkl?format=xml', 
 'en', 
 false,
 array['system_design', 'data_engineering', 'infrastructure']::feed_category[]
),
('Dan Abramov', 
 'JavaScript and React insights', 
 'https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/032/medium/oapgW_Fp_400x400.jpg', 
 'https://overreacted.io/rss.xml', 
 'en', 
 false,
 array['frontend_engineering', 'web_development', 'software_development']::feed_category[]
),
('Dan Luu', 
 'Computer science and engineering', 
 'https://pbs.twimg.com/profile_images/1472713753464500227/HJQvY70g_400x400.png', 
 'https://danluu.com/atom.xml', 
 'en', 
 false,
 array['computer_science', 'system_design', 'engineering_general']::feed_category[]
),
('Josh Comeau', 
 'Web development and React', 
 'https://avatars.githubusercontent.com/u/6692932?v=4?s=100', 
 'https://joshwcomeau.com/rss.xml', 
 'en', 
 false,
 array['frontend_engineering', 'web_development', 'web_design']::feed_category[]
),
('Sophie Alpert', 
 'React and engineering', 
 'https://sophiebits.com/favicon.ico', 
 'https://sophiebits.com/atom.xml', 
 'en', 
 false,
 array['frontend_engineering', 'web_development', 'software_development']::feed_category[]
),
('Signal Blog', 
 'Privacy and security', 
 'data:image/png;base64,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', 
 'https://signal.org/blog/rss.xml', 
 'en', 
 false,
 array['cybersecurity', 'infrastructure', 'system_design']::feed_category[]
),
('Joel on Software', 
 'Software development insights', 
 'https://www.joelonsoftware.com/favicon.ico', 
 'https://www.joelonsoftware.com/feed/', 
 'en', 
 false,
 array['software_development', 'engineering_general', 'product_management']::feed_category[]
);

-- Other Notable Feeds
insert into rss_feeds (name, description, site_icon, url, language, is_active, categories) values
('TED Talks', 
 'Ideas worth spreading', 
 'https://www.ted.com/favicon.ico', 
 'http://feeds.feedburner.com/tedtalks_video', 
 'en', 
 false,
 array['personal_development', 'tech_news', 'leadership']::feed_category[]
),
('Harvard Business Review', 
 'Business management insights', 
 'https://hbr.org/favicon.ico', 
 'http://feeds.harvardbusiness.org/harvardbusiness/', 
 'en', 
 false,
 array['leadership', 'business_strategy', 'personal_development']::feed_category[]
);
-- Additional Notable Feeds Continued
insert into rss_feeds (name, description, site_icon, url, language, is_active, categories) values
('InfoQ', 
 'Software development news and trends', 
 'https://www.infoq.com/favicon.ico', 
 'https://feed.infoq.com/', 
 'en', 
 false,
 array['software_development', 'engineering_general', 'web_development']::feed_category[]
),
('ReadWrite', 
 'IoT and emerging technology', 
 'https://download.logo.wine/logo/ReadWrite/ReadWrite-Logo.wine.png', 
 'https://readwrite.com/feed/', 
 'en', 
 false,
 array['tech_news', 'mobile_development', 'software_development']::feed_category[]
),
('AngelList Weekly', 
 'Startup and venture capital insights', 
 'https://angel.co/favicon.ico', 
 'https://angel.co/newsletters/feed', 
 'en', 
 false,
 array['startup_news', 'venture_capital', 'business_strategy']::feed_category[]
),
('Stack Overflow Blog', 
 'Programming and developer community insights', 
 'https://stackoverflow.blog/favicon.ico', 
 'https://stackoverflow.blog/feed/', 
 'en', 
 false,
 array['software_development', 'engineering_general', 'web_development']::feed_category[]
),
('Fast.ai', 
 'Making AI more accessible', 
 'https://www.fast.ai/favicon.ico', 
 'https://www.fast.ai/index.xml', 
 'en', 
 false,
 array['artificial_intelligence', 'machine_learning', 'deep_learning']::feed_category[]
),
('DZone', 
 'Programming and development resources', 
 'https://dzone.com/favicon.ico', 
 'http://feeds.dzone.com/home', 
 'en', 
 false,
 array['software_development', 'web_development', 'engineering_general']::feed_category[]
),
('O Reilly Radar', 
 'Emerging technology trends', 
 'https://www.oreilly.com/favicon.ico', 
 'https://www.oreilly.com/radar/feed/index.xml', 
 'en', 
 false,
 array['tech_news', 'artificial_intelligence', 'software_development']::feed_category[]
),
('freeCodeCamp', 
 'Programming tutorials and tech articles', 
 'https://www.freecodecamp.org/favicon.ico', 
 'https://www.freecodecamp.org/news/rss/', 
 'en', 
 false,
 array['software_development', 'web_development', 'engineering_general']::feed_category[]
),
('Dev.to', 
 'Community of software developers', 
 'https://dev.to/favicon.ico', 
 'https://dev.to/feed', 
 'en', 
 false,
 array['software_development', 'web_development', 'frontend_engineering']::feed_category[]
),
('High Scalability', 
 'Building scalable websites', 
 'http://highscalability.com/favicon.ico', 
 'http://feeds.feedburner.com/HighScalability', 
 'en', 
 false,
 array['system_design', 'infrastructure', 'engineering_general']::feed_category[]
),
('Netflix Tech Blog', 
 'Netflix engineering insights', 
 'https://store-images.s-microsoft.com/image/apps.46851.9007199266246365.1f6d0339-ecce-4fe5-840a-652cd84111ad.ddef6be7-6304-41c0-a347-1d571b66dfb2', 
 'https://netflixtechblog.com/feed', 
 'en', 
 false,
 array['engineering_general', 'system_design', 'infrastructure']::feed_category[]
),
('Uber Engineering Blog', 
 'Engineering challenges at Uber', 
 'https://eng.uber.com/favicon.ico', 
 'https://eng.uber.com/feed/', 
 'en', 
 false,
 array['engineering_general', 'system_design', 'data_engineering']::feed_category[]
),
('Android Developers Blog', 
 'Official Android development news', 
 'https://developer.android.com/favicon.ico', 
 'https://android-developers.googleblog.com/feeds/posts/default', 
 'en', 
 false,
 array['mobile_development', 'software_development', 'engineering_general']::feed_category[]
),
('Chrome Developers Blog', 
 'Chrome and web platform updates', 
 'https://developer.chrome.com/favicon.ico', 
 'https://developer.chrome.com/feeds/blog.xml', 
 'en', 
 false,
 array['web_development', 'frontend_engineering', 'software_development']::feed_category[]
),
('AWS Blog', 
 'Amazon Web Services news and updates', 
 'https://aws.amazon.com/favicon.ico', 
 'https://aws.amazon.com/blogs/aws/feed/', 
 'en', 
 false,
 array['infrastructure', 'system_design', 'engineering_general']::feed_category[]
);

-- Additional Notable Feeds
insert into rss_feeds (name, description, site_icon, url, language, is_active, categories) values
('WIRED', 
 'Technology and cultural trends', 
 'https://www.wired.com/favicon.ico', 
 'https://www.wired.com/feed/rss', 
 'en', 
 false,
 array['tech_news', 'cybersecurity', 'artificial_intelligence']::feed_category[]
),
('Ars Technica', 
 'Technology news and analysis', 
 'https://arstechnica.com/favicon.ico', 
 'http://feeds.arstechnica.com/arstechnica/index', 
 'en', 
 false,
 array['tech_news', 'software_development', 'cybersecurity']::feed_category[]
),
('McKinsey Insights', 
 'Business and technology insights', 
 'https://www.mckinsey.com/favicon.ico', 
 'https://www.mckinsey.com/insights/rss', 
 'en', 
 false,
 array['business_strategy', 'leadership', 'tech_news']::feed_category[]
),
('Stanford AI Lab Blog', 
 'AI research from Stanford', 
 'https://ai.stanford.edu/favicon.ico', 
 'http://ai.stanford.edu/blog/feed.xml', 
 'en', 
 false,
 array['artificial_intelligence', 'machine_learning', 'research_papers']::feed_category[]
),
('ACM Queue', 
 'Software engineering practice', 
 'https://queue.acm.org/favicon.ico', 
 'https://queue.acm.org/rss/feeds/queuecontent.xml', 
 'en', 
 false,
 array['software_development', 'system_design', 'engineering_general']::feed_category[]
);

-- -- Venture Capital RSS Feed Inserts
insert into rss_feeds (name, description, site_icon, url, language, is_active, categories) values
(
  'Tomasz Tunguz',
  'Authoritative source for venture capitalists, entrepreneurs, and SaaS professionals. Offers in-depth analyses of SaaS metrics, startup growth strategies, and venture capital landscape.',
  'https://i1.feedspot.com/4096872.jpg?t=1607512747',
  'https://tomtunguz.com/index.xml',
  'en',
  false,
  array['venture_capital', 'startup_news', 'business_strategy']::feed_category[]
),
(
  'Hunter Walk',
  'Personal insights and professional experiences from Hunter Walk, partner at Homebrew seed stage venture fund. Features thought-provoking articles on tech, startups, and venture capital.',
  'https://i1.feedspot.com/4587526.jpg?t=1615289871',
  'https://hunterwalk.com/feed/',
  'en',
  false,
  array['venture_capital', 'startup_news', 'entrepreneurship']::feed_category[]
),
(
  'This is going to be BIG',
  'Blog by Charlie ODonnell of Brooklyn Bridge Ventures focusing on New York tech scene and venture capital insights.',
  'https://i1.feedspot.com/20867.jpg?t=1600243971',
  'https://feeds.feedburner.com/thisisgoingtobebig',
  'en',
  false,
  array['venture_capital', 'startup_news', 'tech_news']::feed_category[]
),
(
  'BW VENTURES',
  'Showcases entrepreneurial insights, technical tips and strategies for young startups. Focuses on adapting and launching commercially successful innovations.',
  'https://i1.feedspot.com/5673506.jpg?t=1695023773',
  'https://www.bw.ventures/blog',
  'en',
  false,
  array['venture_capital', 'entrepreneurship', 'startup_news']::feed_category[]
),
(
  'Red Rocket Ventures',
  'A strategic playbook with actionable how-to lessons on startup topics including business strategy, sales, marketing, technology, and fund raising.',
  'https://i1.feedspot.com/3404865.jpg',
  'http://redrocketvc.blogspot.com/feeds/posts/default',
  'en',
  false,
  array['venture_capital', 'entrepreneurship', 'business_strategy']::feed_category[]
),
(
  'Playfair Ventures',
  'Leading seed-stage venture capital firm blog covering investments in early-stage technology companies.',
  'https://i1.feedspot.com/5121488.jpg?t=1615290331',
  'https://medium.com/feed/playfair-capital-blog',
  'en',
  false,
  array['venture_capital', 'tech_news', 'startup_news']::feed_category[]
),
(
  'Aleph VC',
  'Venture capital insights focused on partnering with entrepreneurs to scale companies into globally recognized brands.',
  'https://i1.feedspot.com/4587570.jpg?t=1618319224',
  'https://medium.com/feed/aleph-vc',
  'en',
  false,
  array['venture_capital', 'entrepreneurship', 'business_strategy']::feed_category[]
),
(
  'Vator News',
  'Platform helping entrepreneurs find funding and investors get in on ground floor of tomorrows leading companies.',
  'https://i1.feedspot.com/197894.jpg?t=1650867671',
  'http://feeds.vator.tv/vatortv/news',
  'en',
  false,
  array['venture_capital', 'startup_news', 'tech_news']::feed_category[]
),
(
  'CFA Institute Enterprising Investor',
  'Insightful and practical analysis for investment professionals, focusing on current financial issues and market trends.',
  'https://i1.feedspot.com/4523142.jpg?t=1658833775',
  'https://blogs.cfainstitute.org/investor/feed/',
  'en',
  false,
  array['venture_capital', 'business_strategy', 'data_analytics']::feed_category[]
),
(
  'VC Cafe',
  'Popular blog on technology and venture capital, dedicated to Internet products and companies, with spotlight on Israel tech ecosystem.',
  'https://i1.feedspot.com/122607.jpg?t=1613627641',
  'https://www.vccafe.com/feed/',
  'en',
  false,
  array['venture_capital', 'tech_news', 'startup_news']::feed_category[]
),
(
  'Gust Blog',
  'Platform offering resources for entrepreneurs and investors, covering startup fundraising, business operations, and investment strategies.',
  'https://i1.feedspot.com/5425371.jpg?t=1658837659',
  'https://gust.com/blog',
  'en',
  false,
  array['venture_capital', 'entrepreneurship', 'business_strategy']::feed_category[]
),
(
  'Matt Turck',
  'Thoughts on tech startup world and venture capital from a prominent VC investor.',
  'https://i1.feedspot.com/18430.jpg?t=1650871429',
  'http://mattturck.com/feed/',
  'en',
  false,
  array['venture_capital', 'tech_news', 'startup_news']::feed_category[]
),
(
  'Academic VC',
  'Blog about academia, venture capital, and spaceships by Stephen Fleming.',
  'https://i1.feedspot.com/4587917.jpg?t=1652446159',
  'http://academicvc.com/feed/',
  'en',
  false,
  array['venture_capital', 'research_papers', 'tech_news']::feed_category[]
),
(
  'National Venture Capital Association',
  'Venture capitalists committed to funding Americas most innovative entrepreneurs.',
  'https://i1.feedspot.com/4423898.jpg?t=1652447685',
  'https://nvca.org/blog/feed/',
  'en',
  false,
  array['venture_capital', 'startup_news', 'business_strategy']::feed_category[]
),
(
  'AVC',
  'Daily musings about VC, technology, and entrepreneurship by Fred Wilson.',
  'https://i1.feedspot.com/5294492.jpg?t=1658841380',
  'https://avc.com/feed/',
  'en',
  false,
  array['venture_capital', 'tech_news', 'startup_news']::feed_category[]
),
(
  'Above the Crowd',
  'Insights from Bill Gurley, focusing on high-tech investing and innovation.',
  'https://i1.feedspot.com/5425388.jpg?t=1658839376',
  'https://abovethecrowd.com/',
  'en',
  false,
  array['venture_capital', 'tech_news', 'business_strategy']::feed_category[]
),
(
  'Paul Graham Essays',
  'Insights into developing SaaS businesses and startup ecosystem from Y Combinator co-founder.',
  'https://i1.feedspot.com/4146554.jpg?t=1658830530',
  'http://www.paulgraham.com/rss.html',
  'en',
  false,
  array['venture_capital', 'startup_news', 'entrepreneurship']::feed_category[]
),
(
  'Andreessen Horowitz',
  'Articles and podcasts on technology, innovation, and entrepreneurship from a16z team.',
  'https://i1.feedspot.com/4688236.jpg?t=1658830119',
  'https://a16z.com/feed',
  'en',
  false,
  array['venture_capital', 'tech_news', 'startup_news']::feed_category[]
),
(
  'For Entrepreneurs',
  'In-depth advice on startups and SaaS businesses by David Skok.',
  'https://i1.feedspot.com/1245402.jpg?t=1658834466',
  'https://www.forentrepreneurs.com/feed',
  'en',
  false,
  array['venture_capital', 'entrepreneurship', 'business_strategy']::feed_category[]
),
(
  'Seth Levine',
  'Technology investor insights focusing on startups and venture capital.',
  'https://i1.feedspot.com/4587955.jpg?t=1652443756',
  'https://www.sethlevine.com/feed',
  'en',
  false,
  array['venture_capital', 'tech_news', 'startup_news']::feed_category[]
),
(
  'Christoph Janz',
  'Deep dive into SaaS entrepreneurship and venture capital insights.',
  'https://i1.feedspot.com/58457.jpg?t=1610698071',
  'http://christophjanz.blogspot.com/feeds/posts/default',
  'en',
  false,
  array['venture_capital', 'startup_news', 'business_strategy']::feed_category[]
),
(
  'CFA Institute Enterprising Investor',
  'Insightful and practical analysis for investment professionals,focusing on current financial issues and market trends.',
  'https://i1.feedspot.com/4523142.jpg?t=1658833775',
  'https://blogs.cfainstitute.org/investor/feed',
  'en',
  false,
  array['venture_capital', 'business_strategy', 'data_analytics']::feed_category[]
),
(
  'GenuineVC',
  'I am a co-founder and Partner at NextView Ventures, a seed stage venture capital firm championing founders who redesign the Everyday Economy.',
  'https://i1.feedspot.com/5425311.jpg?t=1658831978',
  'https://genuinevc.com/feed',
  'en',
  false,
  array['venture_capital', 'startup_news', 'entrepreneurship']::feed_category[]
);
-- Marketing Category
insert into rss_feeds (name, description, site_icon, url, language, is_active, categories) values
('The Growth Show', 
 'HubSpot podcast exploring stories of business growth', 
 'https://hubspot.com/favicon.ico', 
 'http://thegrowthshow.hubspot.libsynpro.com/', 
 'en', 
 false,
 array['growth_marketing', 'business_strategy', 'digital_marketing']::feed_category[]
),
('Duct Tape Marketing', 
 'Small business marketing strategies and tips', 
 'https://149781471.v2.pressablecdn.com/wp-content/uploads/2022/08/15921-New-logo-Final-Transparent_Full-Color.png', 
 'https://ducttape.libsyn.com/rss', 
 'en', 
 false,
 array['digital_marketing', 'small_business', 'content_marketing']::feed_category[]
);

-- Interior Design Category
insert into rss_feeds (name, description, site_icon, url, language, is_active, categories) values
('Design Milk - Interior Design', 
 'Modern design trends and interior inspiration', 
 'https://design-milk.com/favicon.ico', 
 'https://design-milk.com/category/interior-design/feed/', 
 'en', 
 false,
 array['interior_design', 'product_design', 'design_systems']::feed_category[]
),
('Dezeen Interiors', 
 'Architecture and design magazine interiors section', 
 'https://www.dezeen.com/favicon.ico', 
 'https://www.dezeen.com/interiors/feed/', 
 'en', 
 false,
 array['interior_design', 'product_design', 'architecture']::feed_category[]
),
('Apartment Therapy', 
 'Home design and decor inspiration for everyday living', 
 'https://www.apartmenttherapy.com/favicon.ico', 
 'https://www.apartmenttherapy.com/design.rss', 
 'en', 
 false,
 array['interior_design', 'home_and_garden', 'lifestyle']::feed_category[]
);

-- Design Category
insert into rss_feeds (name, description, site_icon, url, language, is_active, categories) values
('Smashing Magazine', 
 'Web design and development resources', 
 'https://www.smashingmagazine.com/favicon.ico', 
 'https://www.smashingmagazine.com/feed', 
 'en', 
 false,
 array['web_design', 'web_development', 'frontend_engineering']::feed_category[]
),
('Nielsen Norman Group', 
 'UX research and user experience insights', 
 'https://yt3.googleusercontent.com/ytc/AIdro_ljsZw6A_hbeHDBc_ftg1DBLBlP4A_wQP-i_AueFZNMdw=s900-c-k-c0x00ffffff-no-rj', 
 'https://www.nngroup.com/feed/rss/', 
 'en', 
 false,
 array['ux_design', 'interaction_design', 'research_papers']::feed_category[]
),
('UX Collective', 
 'Curated stories on user experience, visual design, and product design', 
 'https://cdn-images-1.medium.com/v2/resize:fill:72:72/1*mDhF9X4VO0rCrJvWFatyxg.png', 
 'https://uxdesign.cc/feed', 
 'en', 
 false,
 array['ux_design', 'product_design', 'interaction_design']::feed_category[]
);
-- -- Venture Capital RSS Feed Inserts
-- insert into rss_feeds (name, description, site_icon, url, language, is_active, categories) values
-- (
--   'Venture Conjecture',
--   'Welcome to Venture Conjecture, a unique blog from a diverse group of contributors exploring all things Venture Capital including start-ups, funding, movers & shakers.',
--   'https://i1.feedspot.com/5294498.jpg?t=1624108033',
--   'https://www.ventureconjecture.com/blog-feed.xml',
--   'en',
--   false,
--   array['venture_capital', 'startup_news', 'funding']::feed_category[]
-- ),
-- (
--   'FinMasters',
--   'Expert-driven financial advice and comprehensive product reviews for achieving financial goals.',
--   'https://i1.feedspot.com/5303891.jpg?t=1626783180',
--   'https://finmasters.com/feed',
--   'en',
--   false,
--   array['venture_capital', 'investment_education', 'financial_planning']::feed_category[]
-- );
-- (
--   'Thomas Grota A personal view on venture capital',
--   'A personal view on Venture Capital - Opinions, Research and News about Corporate Venture Capital from Deutsche Telekom AG Investment Director.',
--   'https://i1.feedspot.com/1718553.jpg?t=1650884526',
--   'https://thomasgr.tumblr.com/rss',
--   'en',
--   false,
--   array['venture_capital', 'corporate_vc', 'research']::feed_category[]
-- ),
-- (
--   '280.vc',
--   'Authored by Rob Coneybeer, Founder of Shasta Ventures, focusing on early-stage technology investments.',
--   'https://i1.feedspot.com/8626.jpg?t=1652446778',
--   'https://280.vc/rss',
--   'en',
--   false,
--   array['venture_capital', 'tech_investments', 'startup_news']::feed_category[]
-- ),
-- (
--   'BreakingVC',
--   'Mistakes, lessons and successes of breaking into VC, authored by Ezra Galston.',
--   'https://i1.feedspot.com/1715811.jpg?t=1615290073',
--   'https://www.breakingvc.com/feed',
--   'en',
--   false,
--   array['venture_capital', 'vc_careers', 'startup_news']::feed_category[]
-- ),
-- (
--   'Boost VC',
--   'We are a Family of Founders making Sci-Fi a Reality! VR, blockchain, bots, space, AI.',
--   'https://i1.feedspot.com/4587569.jpg?t=1652445926',
--   'https://medium.com/feed/boost-vc',
--   'en',
--   false,
--   array['venture_capital', 'emerging_tech', 'blockchain']::feed_category[]
-- ),
-- (
--   'Pedro Almeida VC',
--   'VC at Armilar sharing insights on Portugal and Spain startups ecosystem.',
--   'https://i1.feedspot.com/5294496.jpg?t=1624250454',
--   'https://www.pedroalmeidavc.com/feed',
--   'en',
--   false,
--   array['venture_capital', 'european_startups', 'tech_news']::feed_category[]
-- ),
-- (
--   'The Business of Venture Capital',
--   'Blog by Mahendra R focusing on igniting security startups.',
--   'https://i1.feedspot.com/4587559.jpg?t=1615290123',
--   'http://feeds.feedburner.com/thebusinessofvc',
--   'en',
--   false,
--   array['venture_capital', 'security_startups', 'entrepreneurship']::feed_category[]
-- );