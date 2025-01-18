import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../../../app';
import { FeedRepository } from '../../../repositories/feed.repository';
import { RssFeed } from '../../../types/models';

jest.mock('../../../repositories/feed.repository');
jest.mock('../../../repositories/article.repository');


describe('POST /feeds/collect', () => {
    const validApiKey = 'test-api-key';

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.API_KEYS = validApiKey;
    });
    it('should return 401 when Supabase credentials are missing', async () => {
        (FeedRepository as jest.Mock).mockImplementation(() => {
            throw new Error('Missing Supabase credentials');
        });

        const response = await request(app)
            .post('/feeds/collect')
            .set('X-API-Key', validApiKey)
            .send();

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            success: false,
            error: 'Missing Supabase credentials'
        });
    });

    it('should successfully collect feeds', async () => {
        const currentDate = new Date().toISOString();
        
        const mockFeeds: RssFeed[] = [{
            id: 'abc-123',
            name: 'Y Combinator Blog',
            url: 'https://www.ycombinator.com/blog/rss/',
            language: 'en',
            description: 'Official blog of Y Combinator',
            is_active: true,
            last_fetched_at: currentDate,
            created_at: currentDate,
            updated_at: currentDate
        }];

        const mockRepo = {
            getActiveBatch: jest.fn().mockImplementation(async () => mockFeeds),
            updateLastFetched: jest.fn().mockImplementation(async () => undefined)
        };

        (FeedRepository as jest.Mock).mockImplementation(() => mockRepo);

        const response = await request(app)
            .post('/feeds/collect')
            .set('X-API-Key', validApiKey)
            .send();

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            data: {
                processedFeeds: 1,
                successCount: 1,
                failedFeeds: []
            }
        });
        expect(mockRepo.getActiveBatch).toHaveBeenCalled();
        expect(mockRepo.updateLastFetched).toHaveBeenCalledWith(mockFeeds[0].id);
    });

    it('should handle database errors gracefully', async () => {
        const mockRepo = {
            getActiveBatch: jest.fn().mockImplementation(async () => {
                throw new Error('Database error');
            }),
            updateLastFetched: jest.fn()
        };

        (FeedRepository as jest.Mock).mockImplementation(() => mockRepo);

        const response = await request(app)
            .post('/feeds/collect')
            .set('X-API-Key', validApiKey)
            .send();

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: false,
            error: 'Database error'
        });
    });

    it('should handle empty feed list', async () => {
        const mockRepo = {
            getActiveBatch: jest.fn().mockImplementation(async () => []),
            updateLastFetched: jest.fn()
        };

        (FeedRepository as jest.Mock).mockImplementation(() => mockRepo);

        const response = await request(app)
            .post('/feeds/collect')
            .set('X-API-Key', validApiKey)
            .send();

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            data: {
                processedFeeds: 0,
                successCount: 0,
                failedFeeds: []
            }
        });
    });

    it('should handle partial failures during feed processing', async () => {
        const currentDate = new Date().toISOString();
        const mockFeeds: RssFeed[] = [
            {
                id: 'success-feed',
                name: 'Success Feed',
                url: 'https://success.com/feed',
                language: 'en',
                description: 'This feed will succeed',
                is_active: true,
                last_fetched_at: currentDate,
                created_at: currentDate,
                updated_at: currentDate
            },
            {
                id: 'fail-feed',
                name: 'Failing Feed',
                url: 'https://fail.com/feed',
                language: 'en',
                description: 'This feed will fail',
                is_active: true,
                last_fetched_at: currentDate,
                created_at: currentDate,
                updated_at: currentDate
            }
        ];

        const mockRepo = {
            getActiveBatch: jest.fn().mockImplementation(async () => mockFeeds),
            updateLastFetched: jest.fn().mockImplementation(async (id) => {
                if (id === 'fail-feed') {
                    throw new Error('Feed processing failed');
                }
            })
        };

        (FeedRepository as jest.Mock).mockImplementation(() => mockRepo);

        const response = await request(app)
            .post('/feeds/collect')
            .set('X-API-Key', validApiKey)
            .send();

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            data: {
                processedFeeds: 2,
                successCount: 1,
                failedFeeds: [{
                    url: 'https://fail.com/feed',
                    error: 'Feed processing failed'
                }]
            }
        });
    });

    it('should handle null values in feed data', async () => {
        const currentDate = new Date().toISOString();
        const mockFeeds: RssFeed[] = [{
            id: 'abc-123',
            name: 'Test Feed',
            url: 'https://test.com/feed',
            language: 'en',
            description: null,
            is_active: true,
            last_fetched_at: null,
            created_at: currentDate,
            updated_at: currentDate
        }];

        const mockRepo = {
            getActiveBatch: jest.fn().mockImplementation(async () => mockFeeds),
            updateLastFetched: jest.fn().mockImplementation(async () => undefined)
        };

        (FeedRepository as jest.Mock).mockImplementation(() => mockRepo);

        const response = await request(app)
            .post('/feeds/collect')
            .set('X-API-Key', validApiKey)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.processedFeeds).toBe(1);
        expect(response.body.data.successCount).toBe(1);
    });
});