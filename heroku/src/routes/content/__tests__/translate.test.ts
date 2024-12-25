import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../../../app';
import { ContentTranslator } from '../../../services/content/translator';

jest.mock('../../../services/content/translator', () => {
    return {
        ContentTranslator: jest.fn().mockImplementation(() => ({
            translate: jest.fn(),
            translateBatch: jest.fn()
        }))
    };
});

describe('POST /content/translate', () => {
    const validContent = 'Hello, world!';
    const validBatchContent = ['Hello, world!', 'Good morning!'];
    const validTargetLanguage = 'ja';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully translate single content', async () => {
        const mockTranslator = {
            translate: jest.fn().mockImplementation(async () => ({
                success: true,
                data: 'こんにちは、世界！'
            }))
        };

        (ContentTranslator as jest.Mock).mockImplementation(() => mockTranslator);

        const response = await request(app)
            .post('/content/translate')
            .send({
                content: validContent,
                targetLanguage: validTargetLanguage
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            data: 'こんにちは、世界！'
        });
    });

    it('should successfully translate batch content', async () => {
        const mockTranslator = {
            translateBatch: jest.fn().mockImplementation(async () => ({
                success: true,
                data: ['こんにちは、世界！', 'おはようございます！']
            }))
        };

        (ContentTranslator as jest.Mock).mockImplementation(() => mockTranslator);

        const response = await request(app)
            .post('/content/translate')
            .send({
                content: validBatchContent,
                targetLanguage: validTargetLanguage
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            data: ['こんにちは、世界！', 'おはようございます！']
        });
    });

    // it('should handle empty content', async () => {
    //     const response = await request(app)
    //         .post('/content/translate')
    //         .send({
    //             content: '',
    //             targetLanguage: validTargetLanguage
    //         });

    //     expect(response.status).toBe(400);
    //     expect(response.body).toEqual({
    //         success: false,
    //         error: 'Invalid request data',
    //         details: expect.arrayContaining([
    //             expect.objectContaining({
    //                 path: ['content']
    //             })
    //         ])
    //     });
    // });

    // it('should handle empty batch content', async () => {
    //     const response = await request(app)
    //         .post('/content/translate')
    //         .send({
    //             content: [],
    //             targetLanguage: validTargetLanguage
    //         });

    //     expect(response.status).toBe(400);
    //     expect(response.body).toEqual({
    //         success: false,
    //         error: 'Invalid request data',
    //         details: expect.arrayContaining([
    //             expect.objectContaining({
    //                 path: ['content']
    //             })
    //         ])
    //     });
    // });

    it('should handle missing target language', async () => {
        const response = await request(app)
            .post('/content/translate')
            .send({
                content: validContent
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            success: false,
            error: 'Invalid request data',
            details: expect.arrayContaining([
                expect.objectContaining({
                    path: ['targetLanguage']
                })
            ])
        });
    });

    it('should handle translation service error', async () => {
        const mockTranslator = {
            translate: jest.fn().mockImplementation(async () => ({
                success: false,
                error: 'Translation service unavailable'
            }))
        };

        (ContentTranslator as jest.Mock).mockImplementation(() => mockTranslator);

        const response = await request(app)
            .post('/content/translate')
            .send({
                content: validContent,
                targetLanguage: validTargetLanguage
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: false,
            error: 'Translation service unavailable'
        });
    });

    it('should handle batch translation service error', async () => {
        const mockTranslator = {
            translateBatch: jest.fn().mockImplementation(async () => ({
                success: false,
                error: 'Batch translation failed'
            }))
        };

        (ContentTranslator as jest.Mock).mockImplementation(() => mockTranslator);

        const response = await request(app)
            .post('/content/translate')
            .send({
                content: validBatchContent,
                targetLanguage: validTargetLanguage
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: false,
            error: 'Batch translation failed'
        });
    });
});