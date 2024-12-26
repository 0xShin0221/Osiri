// src/services/content/__tests__/translator.test.ts
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { ChatOpenAI } from "@langchain/openai";
import { ContentTranslator } from '../translator';
import { RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";
import { title } from 'process';


const translationSchema = z.object({
    title: z.string().describe("Translated title in target language"),
    translation: z.string().describe("Translated content in target language"),
    key_terms: z.array(z.string()).max(5).describe("Up to 5 preserved technical terms"),
    summary: z.string().describe("3-5 key points summary in target language")
  });
  
  type TranslationOutput = z.infer<typeof translationSchema>;
  
  interface ChainInput {
    title: string; 
    content: string;
    source_language: string;
    target_language: string;
    format_instructions: string;
  }
  type ChainInvoke = (input: ChainInput) => Promise<TranslationOutput>;
  const mockChainInvoke = jest.fn() as jest.MockedFunction<ChainInvoke>;

  
  jest.mock("@langchain/core/runnables", () => ({
    RunnableSequence: {
      from: jest.fn(() => ({
        invoke: mockChainInvoke
      }))
    }
  }));
  
  jest.mock("@langchain/openai", () => ({
    ChatOpenAI: jest.fn(() => ({
      temperature: 0.1,
      modelName: "gpt-4"
    }))
  }));
describe('ContentTranslator', () => {
  let translator: ContentTranslator;

  beforeEach(() => {
    jest.clearAllMocks();
    translator = new ContentTranslator();
  });

  describe('translate', () => {
    const validTitle = "Hello World Example";
    const validContent = "Hello World";
    const validSourceLang = "en";
    const validTargetLang = "ja";

    it('should successfully translate content', async () => {
      const mockResponse: TranslationOutput = {
        title: "こんにちは世界の例",
        translation: "こんにちは世界",
        key_terms: ["World"],
        summary: "簡単な挨拶文です。"
      };

      mockChainInvoke.mockResolvedValueOnce(mockResponse);

      const result = await translator.translate(
        validTitle,
        validContent,
        validSourceLang,
        validTargetLang
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse);
      expect(mockChainInvoke).toHaveBeenCalledWith({
        title: validTitle,
        content: validContent,
        source_language: validSourceLang,
        target_language: validTargetLang,
        format_instructions: expect.any(String)
      });
    });

    it('should handle translation errors', async () => {
      mockChainInvoke.mockRejectedValueOnce(new Error('Translation failed'));

      const result = await translator.translate(
        validTitle,
        validContent,
        validSourceLang,
        validTargetLang
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Translation failed');
    });

    it('should handle invalid response format', async () => {
        // Using type assertion to test invalid response scenario
        mockChainInvoke.mockImplementation(async () => {
          return Promise.resolve({
            title: "",
            translation: "",
            key_terms: [],
            summary: ""
          });
        });
  
        const result = await translator.translate(
          validTitle,
          validContent,
          validSourceLang,
          validTargetLang
        );
  
        expect(result.success).toBe(true);
        expect(result.data).toEqual({
          title: "",
          translation: "",
          key_terms: [],
          summary: ""
        });
      });

    // it('should initialize with correct OpenAI settings', () => {
    //   expect(ChatOpenAI).toHaveBeenCalledWith({
    //     temperature: 0.1,
    //     modelName: "gpt-4"
    //   });
    // });

    // it('should handle empty content', async () => {
    //   const result = await translator.translate(
    //     "",
    //     validSourceLang,
    //     validTargetLang
    //   );

    //   expect(result.success).toBe(false);
    //   expect(result.error).toContain('Content cannot be empty');
    // });

    // it('should pass correct prompt template parameters', async () => {
    //   const mockResponse: TranslationOutput = {
    //     translation: "こんにちは世界",
    //     key_terms: ["World"],
    //     summary: "簡単な挨拶文です。"
    //   };

    //   mockChainInvoke.mockResolvedValueOnce(mockResponse);

    //   await translator.translate(
    //     validContent,
    //     validSourceLang,
    //     validTargetLang
    //   );

    //   expect(mockChainInvoke).toHaveBeenCalledWith(
    //     expect.objectContaining({
    //       content: validContent,
    //       source_language: validSourceLang,
    //       target_language: validTargetLang,
    //       format_instructions: expect.any(String)
    //     })
    //   );
    // });
  });
});