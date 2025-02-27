-- Add financial categories to feed_category enum
ALTER TYPE feed_category ADD VALUE IF NOT EXISTS 'market_news';          
ALTER TYPE feed_category ADD VALUE IF NOT EXISTS 'stock_analysis';       
ALTER TYPE feed_category ADD VALUE IF NOT EXISTS 'trading';             
ALTER TYPE feed_category ADD VALUE IF NOT EXISTS 'technical_analysis';   
ALTER TYPE feed_category ADD VALUE IF NOT EXISTS 'fundamental_analysis'; 
ALTER TYPE feed_category ADD VALUE IF NOT EXISTS 'financial_markets';    
ALTER TYPE feed_category ADD VALUE IF NOT EXISTS 'personal_finance';     
ALTER TYPE feed_category ADD VALUE IF NOT EXISTS 'corporate_finance';    
ALTER TYPE feed_category ADD VALUE IF NOT EXISTS 'economics';           
ALTER TYPE feed_category ADD VALUE IF NOT EXISTS 'risk_management';     
