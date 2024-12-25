import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ContentTranslator } from '../translator';

const mockChatOpenAI = {
  invoke: jest.fn() as jest.MockedFunction<(messages: (HumanMessage | SystemMessage)[]) => Promise<AIMessage>>
};

jest.mock('@langchain/openai', () => ({
  ChatOpenAI: jest.fn(() => mockChatOpenAI)
}));

describe('ContentTranslator', () => {
  let translator: ContentTranslator;

  beforeEach(() => {
    jest.clearAllMocks();
    translator = new ContentTranslator();
  });

  describe('translate', () => {
    it('should successfully translate single content', async () => {
      const content = 'Hello World';
      const targetLanguage = 'Japanese';
      const translatedContent = 'こんにちは世界';
      
      mockChatOpenAI.invoke.mockResolvedValueOnce(new AIMessage(translatedContent));

      const result = await translator.translate(content, targetLanguage);

      expect(result.success).toBe(true);
      expect(result.data).toBe(translatedContent);
      expect(mockChatOpenAI.invoke).toHaveBeenCalledWith([
        expect.any(SystemMessage),
        expect.any(HumanMessage)
      ]);
    });

    it('should handle translation errors', async () => {
      const content = 'Hello World';
      const targetLanguage = 'Japanese';
      
      mockChatOpenAI.invoke.mockRejectedValueOnce(new Error('Translation failed'));

      const result = await translator.translate(content, targetLanguage);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Translation failed');
    });

    it('should handle unexpected response format', async () => {
      const content = 'Hello World';
      const targetLanguage = 'Japanese';
      
      // @ts-ignore - Intentionally returning invalid format for testing
      mockChatOpenAI.invoke.mockResolvedValueOnce({ text: 'invalid response' });

      const result = await translator.translate(content, targetLanguage);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unexpected response format from model');
    });
  });

  describe('translateBatch', () => {
    it('should successfully translate multiple contents', async () => {
      const contents = ['Hello', 'World'];
      const targetLanguage = 'Japanese';
      const translatedContents = 'こんにちは\n---NEW_TRANSLATION---\n世界';
      
      mockChatOpenAI.invoke.mockResolvedValueOnce(new AIMessage(translatedContents));

      const result = await translator.translateBatch(contents, targetLanguage);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(['こんにちは', '世界']);
      expect(mockChatOpenAI.invoke).toHaveBeenCalledWith([
        expect.any(SystemMessage),
        expect.any(HumanMessage)
      ]);
    });

    it('should handle batch translation errors', async () => {
      const contents = ['Hello', 'World'];
      const targetLanguage = 'Japanese';
      
      mockChatOpenAI.invoke.mockRejectedValueOnce(new Error('Batch translation failed'));

      const result = await translator.translateBatch(contents, targetLanguage);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Batch translation failed');
    });

    it('should handle mismatched translation count', async () => {
      const contents = ['Hello', 'World'];
      const targetLanguage = 'Japanese';
      const translatedContents = 'こんにちは';
      
      mockChatOpenAI.invoke.mockResolvedValueOnce(new AIMessage(translatedContents));

      const result = await translator.translateBatch(contents, targetLanguage);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Number of translations does not match input');
    });
  });
});