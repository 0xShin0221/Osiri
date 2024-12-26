// src/services/content/translator.ts
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ServiceResponse } from "../../types/models";

const translationSchema = z.object({
  translation: z.string().describe("Translated content in target language"),
  key_terms: z.array(z.string()).max(5).describe("Up to 5 preserved technical terms"),
  summary: z.string().describe("3-5 key points summary in target language")
});

export class ContentTranslator {
  private model: ChatOpenAI;
  private chain: RunnableSequence;
  private parser: StructuredOutputParser<typeof translationSchema>;
  constructor() {
    this.model = new ChatOpenAI({
      temperature: 0.1,
      modelName: "gpt-4o-mini"
    });

    this.parser = StructuredOutputParser.fromZodSchema(translationSchema);

    const promptTemplate = ChatPromptTemplate.fromTemplate(`
      Translate the following text from {source_language} to {target_language}.
      
      Guidelines:
      1. Preserve technical terms and industry jargon in English
      2. Maintain the original's tone and formality
      3. Create a concise summary with 3-5 key points
      4. Identify up to 5 key technical terms that should be preserved
      
      Original text:
      {content}
      
      {format_instructions}
    `);

    this.chain = RunnableSequence.from([
      promptTemplate,
      this.model,
      this.parser
    ]);
  }

  async translate(
    content: string,
    sourceLang: string,
    targetLang: string
  ): Promise<ServiceResponse<{
    translation: string;
    key_terms: string[];
    summary: string;
  }>> {
    try {
      const response = await this.chain.invoke({
        content,
        source_language: sourceLang,
        target_language: targetLang,
        format_instructions: this.parser.getFormatInstructions()
      });

      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Translation failed"
      };
    }
  }
}