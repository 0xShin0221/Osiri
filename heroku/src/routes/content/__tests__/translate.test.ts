import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../../../app';
import { ContentTranslator } from '../../../services/content/translator';
import { title } from 'process';

jest.mock('../../../services/content/translator', () => {
    return {
        ContentTranslator: jest.fn().mockImplementation(() => ({
            translate: jest.fn()
        }))
    };
});

describe('POST /content/translate', () => {
    const validTitle = 'Hello, world!';
    const validContent = 'Hello, world!';
    const validSourceLanguage = 'en';
    const validTargetLanguage = 'ja';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully translate content', async () => {
        const mockTranslator = {
            translate: jest.fn().mockImplementation(async () => ({
                success: true,
                data: {
                    title: 'Hello, world!',
                    translation: 'こんにちは、世界！',
                    key_terms: ['world'],
                    summary: '世界への挨拶を表現しています。'
                }
            }))
        };

        (ContentTranslator as jest.Mock).mockImplementation(() => mockTranslator);

        const response = await request(app)
            .post('/content/translate')
            .send({
                title: validTitle,
                content: validContent,
                sourceLanguage: validSourceLanguage,
                targetLanguage: validTargetLanguage
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            data: {
                title: 'Hello, world!',
                translation: 'こんにちは、世界！',
                key_terms: ['world'],
                summary: '世界への挨拶を表現しています。'
            }
        });
    });

    // it('should handle missing source language', async () => {
    //     const response = await request(app)
    //         .post('/content/translate')
    //         .send({
    //             content: validContent,
    //             targetLanguage: validTargetLanguage
    //         });

    //     expect(response.status).toBe(400);
    //     expect(response.body).toEqual({
    //         success: false,
    //         error: 'Invalid request data',
    //         details: expect.arrayContaining([
    //             expect.objectContaining({
    //                 path: ['sourceLanguage']
    //             })
    //         ])
    //     });
    // });

    // it('should handle missing target language', async () => {
    //     const response = await request(app)
    //         .post('/content/translate')
    //         .send({
    //             content: validContent,
    //             sourceLanguage: validSourceLanguage
    //         });

    //     expect(response.status).toBe(400);
    //     expect(response.body).toEqual({
    //         success: false,
    //         error: 'Invalid request data',
    //         details: expect.arrayContaining([
    //             expect.objectContaining({
    //                 path: ['targetLanguage']
    //             })
    //         ])
    //     });
    // });

    // it('should handle invalid language code', async () => {
    //     const response = await request(app)
    //         .post('/content/translate')
    //         .send({
    //             content: validContent,
    //             sourceLanguage: 'invalid',
    //             targetLanguage: validTargetLanguage
    //         });

    //     expect(response.status).toBe(400);
    //     expect(response.body).toEqual({
    //         success: false,
    //         error: 'Invalid request data',
    //         details: expect.arrayContaining([
    //             expect.objectContaining({
    //                 path: ['sourceLanguage']
    //             })
    //         ])
    //     });
    // });

    // it('should handle translation service error', async () => {
    //     const mockTranslator = {
    //         translate: jest.fn().mockImplementation(async () => ({
    //             success: false,
    //             error: 'Translation service unavailable'
    //         }))
    //     };

    //     (ContentTranslator as jest.Mock).mockImplementation(() => mockTranslator);

    //     const response = await request(app)
    //         .post('/content/translate')
    //         .send({
    //             content: validContent,
    //             sourceLanguage: validSourceLanguage,
    //             targetLanguage: validTargetLanguage
    //         });

    //     expect(response.status).toBe(500);
    //     expect(response.body).toEqual({
    //         success: false,
    //         error: 'Translation service unavailable'
    //     });
    // });
});