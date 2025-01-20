import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { decode, encode } from "gpt-tokenizer";
import type { ServiceResponse } from "../../types/models";

interface TranslationChunk {
  translation: string;
  key_points: string[];
}

// Modify the schema to be more strict with character limits
const translationSchema = z.object({
  title: z.string()
    .max(200)
    .describe(
      "Translated title in the target language, keeping it concise and clear.",
    ),
  translation: z.string().describe(
    "Translated content in the target language.",
  ),
  key_points: z.array(z.string().max(300)) // Explicit limit per key point
    .max(5)
    .describe(
      "3-5 key points that are important for understanding the article, each should be concise.",
    ),
  summary: z.string()
    .max(350) // Reduced from 400 to give some buffer for different character encodings
    .describe(
      "A focused summary capturing the article's essence in about 300 characters. Include:\n" +
        "1. Main topic\n" +
        "2. Key findings\n" +
        "3. Business implications\n" +
        "Keep it very concise, especially for non-Latin scripts.",
    ),
});

const CHUNK_SIZE = 12000;
const OVERLAP_SIZE = 200;
const MAX_RETRIES = 3;
const INITIAL_TIMEOUT = 30000;
const RETRY_DELAY = 1000;

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
    You are an editor specialized in startup and technology industry analysis.
    Please translate and analyze the following article with a focus on business value and technical insights:

    Source Language: {source_language}
    Target Language: {target_language}

    Translation Requirements:

    1. Length Requirements:
      - Summary must be VERY concise (max 350 characters)
      - Each key point must be under 300 characters
      - Title should be clear but brief

    2. Key Points Extraction Guidelines:
      - Business Impact: Identify specific market opportunities, revenue potential, or competitive advantages
      - Technical Innovation: Highlight unique technological solutions or breakthroughs
      - Growth Metrics: Extract specific numbers about user growth, funding, or market size
      - Strategic Moves: Note important partnerships, acquisitions, or market expansions
      - Future Implications: Point out potential industry changes or future developments

    3. Summary Structure:
      - Problem/Opportunity: What market need or challenge is being addressed?
      - Solution/Innovation: What unique approach or technology is being used?
      - Market Impact: What are the business implications or market effects?
      - Competitive Edge: What distinguishes this from existing solutions?

    4. Content Guidelines:
      - Use industry-standard terminology
      - Include specific metrics and numbers when available
      - Maintain technical accuracy in translations
      - Focus on actionable insights
      - For non-Latin scripts, prioritize clarity while maintaining technical precision

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

  private normalizeTranslationResponse(
    response: z.infer<typeof translationSchema>,
  ): z.infer<typeof translationSchema> {
    // Ensure summary is well within length limit
    if (response.summary) {
      response.summary = response.summary.slice(0, 350);
    }

    // Normalize key points
    if (response.key_points) {
      response.key_points = response.key_points.map((point) =>
        point.slice(0, 300)
      );
    }

    // Normalize title
    if (response.title) {
      response.title = response.title.slice(0, 200);
    }

    return response;
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
    // Move isFirstChunk outside of try block to make it available in catch block
    const isFirstChunk = chunkIndex === 0;

    try {
      const isFirstChunkInstructions = isFirstChunk
        ? "This is the first chunk. Please extract key points and write a summary. The response must be valid JSON, with properly escaped characters."
        : "This is a continuation chunk. Focus on maintaining content flow.";

      const chainResponse = await this.chain.invoke({
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

      const response = this.normalizeTranslationResponse(chainResponse);

      console.debug("Translation response:", {
        summaryLength: Buffer.byteLength(response.summary, "utf8"),
        summary: response.summary,
      });

      return {
        success: true,
        data: {
          translation: response.translation,
          key_points: isFirstChunk ? response.key_points : [],
        },
      };
    } catch (error) {
      console.error("Translation error:", error);

      if (
        error instanceof Error &&
        error.message.includes("OUTPUT_PARSING_FAILURE")
      ) {
        console.warn(
          "JSON parsing error detected, attempting to clean response",
        );
        try {
          // Type assertion to access cause property
          const rawResponse =
            (error as { cause?: { message: string } }).cause?.message || "";
          const cleanedJson = this.cleanupJsonString(rawResponse);
          const parsedResponse = JSON.parse(cleanedJson);
          const normalizedResponse = this.normalizeTranslationResponse(
            parsedResponse,
          );
          return {
            success: true,
            data: {
              translation: normalizedResponse.translation,
              key_points: isFirstChunk ? normalizedResponse.key_points : [],
            },
          };
        } catch (cleanupError) {
          console.error("Failed to clean and parse response:", cleanupError);
        }
      }

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

      console.error("Translation process failed after all retries", error);
      return {
        success: false,
        error: error instanceof Error
          ? error.message
          : "Translation process failed after retries",
      };
    }
  }
  private cleanupJsonString(text: string): string {
    // First, remove markdown code block if present
    let cleanedText = text.replace(/```json\n?/, "").replace(/\n?```$/, "");

    // Try to find the start of the JSON object
    const jsonStart = cleanedText.indexOf("{");
    if (jsonStart !== -1) {
      cleanedText = cleanedText.slice(jsonStart);
    }

    // Clean up whitespace and special characters
    cleanedText = cleanedText
      .replace(/[\n\r\t]/g, " ") // Replace newlines, tabs with spaces
      .replace(/\s+/g, " ") // Collapse multiple spaces
      .replace(/\\/g, "\\\\") // Escape backslashes
      .replace(/"/g, '\\"') // Escape quotes
      .trim(); // Remove leading/trailing whitespace

    // Ensure the text starts with { and ends with }
    if (!cleanedText.startsWith("{")) {
      cleanedText = `{${cleanedText}`;
    }
    if (!cleanedText.endsWith("}")) {
      cleanedText = `${cleanedText}}`;
    }

    return cleanedText;
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
      const chunks = totalTokens > CHUNK_SIZE
        ? this.splitIntoChunks(content)
        : [content];

      console.info(`Content split into ${chunks.length} chunks`);

      const translatedChunks: string[] = [];
      let allKeyPoints: string[] = [];
      let previousContext = "";

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

        const chunkTokens = encode(chunkResult.data.translation);
        previousContext = decode(chunkTokens.slice(-OVERLAP_SIZE));
      }

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

      const finalTranslation = translatedChunks.join(" ");

      let summary = "";
      if (chunks.length > 1) {
        const summaryResult = await this.translateChunk(
          title,
          `${finalTranslation.slice(0, 1000)}...`,
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
