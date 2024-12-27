import { Request, Response } from 'express';
import { z } from 'zod';
import { withValidation } from '../../middleware/requestHandler';
import { BatchProcessor } from '../../services/batch/batchProcessor';
import { FeedRepository } from '../../repositories/feed.repository';
import { ArticleRepository } from '../../repositories/article.repository';
import { withErrorHandling } from '../../middleware/errorHandler';

const batchOptionsSchema = z.object({
  forceFetch: z.boolean().optional().default(false),
  batchSize: z.number().optional().default(10),
  retryCount: z.number().optional().default(3)
}).optional();

type BatchStatus = {
  feedsProcessed: number;
  articlesCreated: number;
  contentScraped: number;
  translationsCompleted: number;
  errors: Array<{
    stage: string;
    error: string;
    itemId?: string;
  }>;
};

async function runBatchProcess(options: any) {
  const status: BatchStatus = {
    feedsProcessed: 0,
    articlesCreated: 0,
    contentScraped: 0,
    translationsCompleted: 0,
    errors: []
  };

  const feedRepository = new FeedRepository();
  const articleRepository = new ArticleRepository();
  const batchProcessor = new BatchProcessor(feedRepository, articleRepository);

  try {
    console.info('Starting batch process');
    const result = await batchProcessor.process({
      ...options,
      onProgress: (stage: string, count: number) => {
        switch (stage) {
          case 'feed':
            status.feedsProcessed = count;
            break;
          case 'article':
            status.articlesCreated = count;
            break;
          case 'scrape':
            status.contentScraped = count;
            break;
          case 'translate':
            status.translationsCompleted = count;
            break;
        }
        console.info('Progress update:', { stage, count, status });
      },
      onError: (stage: string, error: Error, itemId?: string) => {
        status.errors.push({
          stage,
          error: error.message,
          itemId
        });
        console.error('Process error:', { stage, error: error.message, itemId });
      }
    });

    console.info('Batch process completed:', {
      status,
      processingTime: result.processingTime,
      newArticlesCount: result.newArticlesCount,
      updatedArticlesCount: result.updatedArticlesCount
    });
    
  } catch (error) {
    if (status.errors.length === 0) {
      status.errors.push({
        stage: 'batch',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }

    console.error('Batch process failed:', {
      status,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export const processBatch = withValidation(batchOptionsSchema)(
  withErrorHandling(async (req: Request, res: Response) => {
    const options = req.body || {};

    // Send immediate response
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: 'Batch processing started'
    });

    // Start batch process in background
    setImmediate(() => {
      runBatchProcess(options).catch(error => {
        console.error('Background batch process failed:', error);
      });
    });
  })
);