import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../../../app';
import { ContentScraper } from '../../../services/content/scraper';

jest.mock('../../../services/content/scraper');

describe('POST /content/scrape', () => {
    const validUrl = 'https://example.com/article';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully scrape content', async () => {
        const mockScraper = {
            scrape: jest.fn().mockImplementation(async () => ({
                success: true,
                data: 'Scraped content text'
            }))
        };

        (ContentScraper as jest.Mock).mockImplementation(() => mockScraper);

        const response = await request(app)
            .post('/content/scrape')
            .send({
                url: validUrl,
                options: {
                    timeout: 5000,
                    waitUntil: 'domcontentloaded'
                }
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            data: 'Scraped content text'
        });
    });
    it('should handle scraping failure', async () => {
        const mockScraper = {
            scrape: jest.fn().mockImplementation(async () => ({
                success: false,
                error: 'Failed to access the website'
            }))
        };

        (ContentScraper as jest.Mock).mockImplementation(() => mockScraper);

        const response = await request(app)
            .post('/content/scrape')
            .send({
                url: validUrl
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: false,
            error: 'Failed to access the website'
        });
    });

    it('should handle invalid URL format', async () => {
        const response = await request(app)
            .post('/content/scrape')
            .send({
                url: 'invalid-url'
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            success: false,
            error: 'Invalid request data',
            details: expect.arrayContaining([
                expect.objectContaining({
                    path: ['url']
                })
            ])
        });
    });

    it('should handle invalid options', async () => {
        const response = await request(app)
            .post('/content/scrape')
            .send({
                url: validUrl,
                options: {
                    waitUntil: 'invalid-option'
                }
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            success: false,
            error: 'Invalid request data',
            details: expect.arrayContaining([
                expect.objectContaining({
                    path: ['options', 'waitUntil']
                })
            ])
        });
    });

    it('should handle timeout', async () => {
        const mockScraper = {
            scrape: jest.fn().mockImplementation(async () => ({
                success: false,
                error: 'Navigation timeout exceeded'
            }))
        };

        (ContentScraper as jest.Mock).mockImplementation(() => mockScraper);

        const response = await request(app)
            .post('/content/scrape')
            .send({
                url: validUrl,
                options: {
                    timeout: 1000
                }
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: false,
            error: 'Navigation timeout exceeded'
        });
    });
});