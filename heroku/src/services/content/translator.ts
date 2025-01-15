import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { decode, encode } from "gpt-tokenizer";
import type { ServiceResponse } from "../../types/models";

const translationSchema = z.object({
  title: z.string().describe(
    "Translated title in the target language, ensuring the meaning is clear and understandable.",
  ),
  translation: z.string().describe(
    "Translated content in the target language.",
  ),
  key_points: z.array(z.string())
    .max(5)
    .describe(
      "3-5 key points that are important for understanding the article, each around 300-500 characters.",
    ),
  summary: z.string()
    .max(400)
    .describe(
      "A concise summary of the article focusing on the main ideas. Maximum 500 characters.",
    ),
});

const CHUNK_SIZE = 12000; // Size of each chunk (targeting ~75% of max output tokens)
const OVERLAP_SIZE = 200; // Number of tokens to overlap between chunks

const MAX_RETRIES = 3;
const INITIAL_TIMEOUT = 30000; // 30 seconds
const RETRY_DELAY = 1000; // 1 second

interface TranslationChunk {
  translation: string;
  key_points: string[];
}

export class ContentTranslator {
  private model: ChatOpenAI;
  private chain: RunnableSequence;
  private parser: StructuredOutputParser<typeof translationSchema>;

  constructor() {
    console.info("Initializing ContentTranslator");

    this.model = new ChatOpenAI({
      temperature: 0.2,
      model: "gpt-4o-mini",
      timeout: INITIAL_TIMEOUT,
      maxRetries: MAX_RETRIES,
    });

    this.parser = StructuredOutputParser.fromZodSchema(translationSchema);

    const promptTemplate = ChatPromptTemplate.fromTemplate(`
         Carefully translate the following content with high precision:

        Source Language: {source_language}
        Target Language: {target_language}

        Translation Requirements:
        - Translate title and text accurately
        - Preserve original meaning and nuance
        - Maintain technical terminology
        - Extract key points if this is the first chunk
        - Maintain content flow between chunks
        - Keep summary concise (maximum 400 characters)
        
        Chunk Information:
        - Total Chunks: {total_chunks}
        - Current Chunk: {current_chunk}
        
        {is_first_chunk_instructions}

        Original Title: {title}
        Original Text: {content}
        
        Previous Context (if any): {previous_context}
        
        {format_instructions}
      `);

    this.chain = RunnableSequence.from([
      promptTemplate,
      this.model,
      this.parser,
    ]);
  }

  private countTokens(text: string): number {
    return encode(text).length;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private splitIntoChunks(content: string): string[] {
    const tokens = encode(content);
    const chunks: string[] = [];
    let currentIndex = 0;

    while (currentIndex < tokens.length) {
      const chunk = tokens.slice(
        currentIndex,
        currentIndex + CHUNK_SIZE,
      );
      chunks.push(decode(chunk));
      currentIndex += CHUNK_SIZE - OVERLAP_SIZE;
    }

    return chunks;
  }

  private async translateChunk(
    title: string,
    content: string,
    sourceLang: string,
    targetLang: string,
    chunkIndex: number,
    totalChunks: number,
    previousContext = "",
    retryCount = 0,
  ): Promise<ServiceResponse<TranslationChunk>> {
    try {
      const isFirstChunk = chunkIndex === 0;
      const isFirstChunkInstructions = isFirstChunk
        ? "This is the first chunk. Please extract key points and write a summary."
        : "This is a continuation chunk. Focus on maintaining content flow.";

      const response = await this.chain.invoke({
        title,
        content,
        source_language: sourceLang,
        target_language: targetLang,
        total_chunks: totalChunks,
        current_chunk: chunkIndex + 1,
        is_first_chunk_instructions: isFirstChunkInstructions,
        previous_context: previousContext,
        format_instructions: this.parser.getFormatInstructions(),
      });

      return {
        success: true,
        data: {
          translation: response.translation,
          key_points: isFirstChunk ? response.key_points : [],
        },
      };
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        console.warn(
          `Translation attempt ${retryCount + 1} failed, retrying...`,
        );
        await this.delay(RETRY_DELAY * (retryCount + 1));
        return this.translateChunk(
          title,
          content,
          sourceLang,
          targetLang,
          chunkIndex,
          totalChunks,
          previousContext,
          retryCount + 1,
        );
      }

      console.error("Chunk translation failed after all retries", error);
      return {
        success: false,
        error: error instanceof Error
          ? error.message
          : "Translation failed after retries",
      };
    }
  }

  async translate(
    title: string,
    content: string,
    sourceLang: string,
    targetLang: string,
  ): Promise<
    ServiceResponse<{
      title: string;
      translation: string;
      key_points: string[];
      summary: string;
    }>
  > {
    console.info("Starting translation", {
      title,
      contentLength: content.length,
      sourceLang,
      targetLang,
    });

    const totalTokens = this.countTokens(content);
    console.info(`Content tokens: ${totalTokens}`);

    try {
      // Split content into chunks if necessary
      const chunks = totalTokens > CHUNK_SIZE
        ? this.splitIntoChunks(content)
        : [content];

      console.info(`Content split into ${chunks.length} chunks`);

      const translatedChunks: string[] = [];
      let allKeyPoints: string[] = [];
      let previousContext = "";

      // Translate each chunk
      for (let i = 0; i < chunks.length; i++) {
        const chunkResult = await this.translateChunk(
          title,
          chunks[i],
          sourceLang,
          targetLang,
          i,
          chunks.length,
          previousContext,
        );

        if (!chunkResult.success || !chunkResult.data) {
          return {
            success: false,
            error: chunkResult.error || `Failed to translate chunk ${i + 1}`,
          };
        }

        translatedChunks.push(chunkResult.data.translation);
        if (chunkResult.data.key_points.length > 0) {
          allKeyPoints = chunkResult.data.key_points;
        }

        // Store the end of this chunk for context in the next chunk
        const chunkTokens = encode(chunkResult.data.translation);
        previousContext = decode(chunkTokens.slice(-OVERLAP_SIZE));
      }

      // Get title translation if multiple chunks
      let translatedTitle = title;
      if (chunks.length > 1) {
        const titleResult = await this.translateChunk(
          title,
          title,
          sourceLang,
          targetLang,
          0,
          1,
        );
        if (titleResult.success && titleResult.data) {
          translatedTitle = titleResult.data.translation;
        }
      }

      // Combine all translations
      const finalTranslation = translatedChunks.join(" ");

      // Generate final summary for long content
      let summary = "";
      if (chunks.length > 1) {
        const summaryResult = await this.translateChunk(
          title,
          `${finalTranslation.slice(0, 1000)}...`, // Use start of content for summary
          targetLang,
          targetLang,
          0,
          1,
        );
        if (summaryResult.success && summaryResult.data) {
          summary = summaryResult.data.translation;
        }
      }

      return {
        success: true,
        data: {
          title: translatedTitle,
          translation: finalTranslation,
          key_points: allKeyPoints,
          summary: summary || `${finalTranslation.slice(0, 500)}...`,
        },
      };
    } catch (error) {
      console.error("Translation process failed", error);
      return {
        success: false,
        error: error instanceof Error
          ? error.message
          : "Translation process failed",
      };
    }
  }
}
