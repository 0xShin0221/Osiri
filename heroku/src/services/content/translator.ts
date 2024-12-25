import { ChatOpenAI } from '@langchain/openai';
import { 
  AIMessage, 
  BaseMessage,
  HumanMessage,
  SystemMessage 
} from '@langchain/core/messages';
import { ServiceResponse } from '../../types/models';

export class ContentTranslator {
  private model: ChatOpenAI;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0.3,
      maxRetries: 3,
    });
  }

  async translate(content: string, targetLanguage: string): Promise<ServiceResponse<string>> {
    try {
      const messages: BaseMessage[] = [
        new SystemMessage({
          content: `You are a professional translator. Translate the following text to ${targetLanguage}. 
                   Maintain the original meaning, tone, and formatting.`
        }),
        new HumanMessage({ content })
      ];
      
      const response = await this.model.invoke(messages);

      if (response instanceof AIMessage && typeof response.content === 'string') {
        return {
          success: true,
          data: response.content
        };
      }

      throw new Error('Unexpected response format from model');
    } catch (error) {
      console.error('Translation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Translation failed'
      };
    }
  }

  async translateBatch(contents: string[], targetLanguage: string): Promise<ServiceResponse<string[]>> {
    try {
      const messages: BaseMessage[] = [
        new SystemMessage({
          content: `You are a professional translator. Translate each of the following texts to ${targetLanguage}.
                   Maintain the original meaning and tone. Return each translation on a new line, 
                   separated by '---NEW_TRANSLATION---'.`
        }),
        new HumanMessage({
          content: contents.join('\n---INPUT_SEPARATOR---\n')
        })
      ];

      const response = await this.model.invoke(messages);
      
      if (response instanceof AIMessage && typeof response.content === 'string') {
        const translations = response.content
          .split('---NEW_TRANSLATION---')
          .map(t => t.trim())
          .filter(t => t.length > 0);

        if (translations.length !== contents.length) {
          throw new Error('Number of translations does not match input');
        }

        return {
          success: true,
          data: translations
        };
      }

      throw new Error('Unexpected response format from model');
    } catch (error) {
      console.error('Batch translation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Batch translation failed'
      };
    }
  }

  // Helper method to process model response
  private validateResponse(response: AIMessage): string {
    if (typeof response.content !== 'string') {
      throw new Error('Expected string response from model');
    }
    return response.content;
  }
}