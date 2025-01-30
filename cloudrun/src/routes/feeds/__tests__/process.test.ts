import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../../../app';
import { ArticleRepository } from '../../../repositories/article.repository';
// import { ServiceResponse } from '../../../types/models';

jest.mock('../../../repositories/article.repository');

describe('POST /feeds/process', () => {
    const validApiKey = 'test-api-key';

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.API_KEYS = validApiKey;
    });
    const validFeedId = '123e4567-e89b-12d3-a456-426614174000';
    const validItems = [
        {
            title: 'Test Article',
            content: 'This is a test article content',
            link: 'https://example.com/article'
        }
    ];

    it('should successfully process feed items', async () => {
        const mockArticleRepo = {
            saveMany: jest.fn().mockImplementation(async () => ({
                success: true,
                data: { count: 1 }
            }))
        };

        (ArticleRepository as jest.Mock).mockImplementation(() => mockArticleRepo);

        const response = await request(app)
            .post('/feeds/process')
            .set('X-API-Key', validApiKey)
            .send({
                feedId: validFeedId,
                items: validItems
            });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            feedId: validFeedId,
        });
    });

    it('should validate feed ID format', async () => {
        const response = await request(app)
            .post('/feeds/process')
            .set('X-API-Key', validApiKey)
            .send({
                feedId: 'invalid-uuid',
                items: validItems
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            success: false,
            error: 'Invalid request data',
            details: expect.arrayContaining([
                expect.objectContaining({
                    path: ['feedId']
                })
            ])
        });
    });

    it('should validate items structure', async () => {
        const response = await request(app)
            .post('/feeds/process')
            .set('X-API-Key', validApiKey)
            .send({
                feedId: validFeedId,
                items: [{
                    title: 'Test',
                    // missing content and link
                }]
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            success: false,
            error: 'Invalid request data',
            details: expect.arrayContaining([
                expect.objectContaining({
                    path: expect.arrayContaining(['items'])
                })
            ])
        });
    });

    it('should validate item URL format', async () => {
        const response = await request(app)
            .post('/feeds/process')
            .set('X-API-Key', validApiKey)
            .send({
                feedId: validFeedId,
                items: [{
                    title: 'Test Article',
                    content: 'Content',
                    link: 'invalid-url'
                }]
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            success: false,
            error: 'Invalid request data',
            details: expect.arrayContaining([
                expect.objectContaining({
                    path: expect.arrayContaining(['items'])
                })
            ])
        });
    });

    it('should handle empty item list', async () => {
        const response = await request(app)
            .post('/feeds/process')
            .set('X-API-Key', validApiKey)
            .send({
                feedId: validFeedId,
                items: []
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            feedId: validFeedId,
            itemsProcessed: 0
        });
    });

    // it('should handle article creation failure', async () => {
    //     const mockArticleRepo = {
    //         saveMany: jest.fn().mockImplementation(async () => ({
    //             success: false,
    //             error: 'Database error'
    //         }))
    //     };

    //     (ArticleRepository as jest.Mock).mockImplementation(() => mockArticleRepo);

    //     const response = await request(app)
    //         .post('/feeds/process')
    //         .send({
    //             feedId: validFeedId,
    //             items: validItems
    //         });

    //     expect(response.status).toBe(200);
    //     expect(response.body).toEqual({
    //         success: false,
    //         error: 'Database error'
    //     });
    // });

    // it('should handle duplicate articles gracefully', async () => {
    //     const mockArticleRepo = {
    //         saveMany: jest.fn().mockImplementation(async () => ({
    //             success: true,
    //             data: { 
    //                 count: 0,
    //                 skipped: 1 
    //             }
    //         }))
    //     };

    //     (ArticleRepository as jest.Mock).mockImplementation(() => mockArticleRepo);

    //     const response = await request(app)
    //         .post('/feeds/process')
    //         .send({
    //             feedId: validFeedId,
    //             items: validItems
    //         });

    //     expect(response.status).toBe(200);
    //     expect(response.body).toEqual({
    //         success: true,
    //         data: {
    //             processedItems: 1,
    //             savedItems: 0,
    //             skippedItems: 1
    //         }
    //     });
    // });

    // it('should handle large batch of items', async () => {
    //     const largeItemList = Array(100).fill(null).map((_, index) => ({
    //         title: `Article ${index}`,
    //         content: `Content ${index}`,
    //         link: `https://example.com/article/${index}`
    //     }));

    //     const mockArticleRepo = {
    //         saveMany: jest.fn().mockImplementation(async () => ({
    //             success: true,
    //             data: { count: largeItemList.length }
    //         }))
    //     };

    //     (ArticleRepository as jest.Mock).mockImplementation(() => mockArticleRepo);

    //     const response = await request(app)
    //         .post('/feeds/process')
    //         .send({
    //             feedId: validFeedId,
    //             items: largeItemList
    //         });

    //     expect(response.status).toBe(200);
    //     expect(response.body.success).toBe(true);
    //     expect(response.body.data.processedItems).toBe(largeItemList.length);
    //     expect(response.body.data.savedItems).toBe(largeItemList.length);
    // });
});