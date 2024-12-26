// src/services/content/translator.ts
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ServiceResponse } from "../../types/models";

const translationSchema = z.object({
    title: z.string().describe("Translated title in the target language, ensuring the meaning is clear and understandable."),
    translation: z.string().describe("Translated content in the target language."),
    key_points: z.array(z.string())
      .max(5)
      .describe("3-5 key points that are important for understanding the article, each around 300-500 characters."),
    summary: z.string().describe("A concise summary of the article, focusing on the main ideas.")
});

export class ContentTranslator {
    private model: ChatOpenAI;
    private chain: RunnableSequence;
    private parser: StructuredOutputParser<typeof translationSchema>;
  
    constructor() {
      console.info("Initializing ContentTranslator");
  
      this.model = new ChatOpenAI({
        temperature: 0.2,
        model: "gpt-4o-mini",
        timeout: 15000
      });
      console.info("ChatOpenAI model initialized with temperature 0.2 and model gpt-4o-mini");
  
      this.parser = StructuredOutputParser.fromZodSchema(translationSchema);
      console.info("StructuredOutputParser initialized with translation schema");
  
      const promptTemplate = ChatPromptTemplate.fromTemplate(`
         Carefully translate the following content with high precision:

        Source Language: {source_language}
        Target Language: {target_language}

        Translation Requirements:
        - Translate title and text accurately
        - Preserve original meaning and nuance
        - Maintain technical terminology
        - Extract 3-5 key points (200-500 characters each)
        - Write a concise summary

        IMPORTANT: If translation is not possible or content is unclear, return an error explanation.

        Original Title: {title}
        Original Text: {content}
        
        {format_instructions}
        `);
      console.info("ChatPromptTemplate created with translation guidelines");
  
      this.chain = RunnableSequence.from([
        promptTemplate,
        this.model,
        this.parser
      ]);
      console.info("RunnableSequence initialized with prompt template, model, and parser");
    }
  
    async translate(
      title: string,
      content: string,
      sourceLang: string,
      targetLang: string
    ): Promise<ServiceResponse<{
      title: string;
      translation: string;
      key_points: string[];
      summary: string;
    }>> {
      console.info("Starting translation", {
        title,
        sourceLang,
        targetLang
      });
  
      try {
        const response = await this.chain.invoke({
          title,
          content,
          source_language: sourceLang,
          target_language: targetLang,
          format_instructions: this.parser.getFormatInstructions()
        });
  
        console.info("Translation successful", {
          title: response.title,
          key_points: response.key_points,
          summary: response.summary
        });
  
        return {
          success: true,
          data: response
        };
      } catch (error) {
        console.error("Translation failed", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Translation failed"
        };
      }
    }
  }