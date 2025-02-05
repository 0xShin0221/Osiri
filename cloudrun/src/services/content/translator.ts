import { z } from "zod";
// import { ChatOpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Client } from "langsmith";
import { decode, encode } from "gpt-tokenizer";
import { ConfigManager } from "../../lib/config";
import { LangChainTracer } from "@langchain/core/tracers/tracer_langchain";
import type { ServiceResponse } from "../../types/models";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// Define the structure for translation chunks
interface TranslationChunk {
  translation: string;
  titleTranslated?: string;
  titleOriginal?: string;
  key_points: string[];
}

// Define the translation schema with Zod for validation
const translationSchema = z.object({
  titleTranslated: z.string()
    .max(200)
    .describe(
      "Translated title in the target language. Keep technical terms in their original form when appropriate. Format should be natural in the target language.",
    ),
  titleOriginal: z.string()
    .max(200)
    .describe(
      "Original title preserved for reference.",
    ),
  translation: z.string().describe(
    "Translated content in the target language.",
  ),
  key_points: z.array(z.string().max(300))
    .max(5)
    .describe(
      "3-5 key points that are important for understanding the article.",
    ),
  summary: z.string()
    .max(800) // Reduced max length for summaries
    .describe(
      "A concise but comprehensive summary that captures the essence of the article. Include:\n" +
        "1. Background context and key problem/opportunity\n" +
        "2. Main solution or innovation\n" +
        "3. Business impact and market significance\n" +
        "4. Key technical insights (if relevant)\n\n" +
        "Note: Create a complete, self-contained summary without truncation.\n" +
        "- For Japanese: Aim for 500-800 characters\n" +
        "- For English/Latin scripts: Aim for 600-900 characters\n" +
        "- For other scripts: Adjust length while maintaining comprehensive coverage",
    ),
});

// Constants for translation processing
const CHUNK_SIZE = 12000;
const OVERLAP_SIZE = 200;
const MAX_RETRIES = 3;
const INITIAL_TIMEOUT = 30000;
const RETRY_DELAY = 1000;

export class ContentTranslator {
  // private model: ChatOpenAI;
  private model: ChatGoogleGenerativeAI;
  private chain: RunnableSequence;
  private parser: StructuredOutputParser<typeof translationSchema>;
  private config: ConfigManager;
  private tracer: LangChainTracer;

  constructor() {
    console.info("Initializing ContentTranslator");
    this.config = ConfigManager.getInstance();

    // Initialize configurations
    // const openAIConfig = this.config.getOpenAIConfig();
    const langchainConfig = this.config.getLangChainConfig();
    const googleGeminiConfig = this.config.getGoogleGeminiConfig();

    // Setup LangSmith client
    const client = new Client({
      apiKey: langchainConfig.langsmithApiKey,
      apiUrl: langchainConfig.endpoint,
    });

    // Setup tracer
    this.tracer = new LangChainTracer({
      client,
      projectName: langchainConfig.projectName,
    });

    // Initialize OpenAI model
    // this.model = new ChatOpenAI({
    //   temperature: 0.2,
    //   model: "gpt-4o-mini",
    //   timeout: INITIAL_TIMEOUT,
    //   maxRetries: MAX_RETRIES,
    //   apiKey: openAIConfig.apiKey,
    // });
    this.model = new ChatGoogleGenerativeAI({
      temperature: 0.2,
      model: "gemini-1.5-flash",
      apiKey: googleGeminiConfig.apiKey,
      maxRetries: MAX_RETRIES,
    });
    this.parser = StructuredOutputParser.fromZodSchema(translationSchema);

    // Setup translation prompt template
    const promptTemplate = ChatPromptTemplate.fromTemplate(`
      You are an editor specialized in startup and technology industry analysis.
      Please translate and analyze the following article with a focus on business value and technical insights.

      Source Language: {source_language}
      Target Language: {target_language}

      Translation Requirements:
      
      1. **Title Translation Rules**:
      - Preserve technical terms, product names, and established industry terms in their original form
      - Follow target language conventions for displaying foreign terms (e.g., parentheses, specific scripts, or transliteration)
      - When technical terms have widely accepted local translations, use both:
        * Primary: locally accepted translation
        * Secondary: original term in parentheses when needed for clarity
      - Maintain word order and grammar structure natural to the target language
      - Keep proper nouns in their original form unless they have widely accepted translations in the target language
      - For industry-specific abbreviations (API, SDK, UI/UX, etc.):
        * Keep them in their original form if commonly used in the target region
        * Add explanatory text if the abbreviation is not commonly known in the target region

      
      2. **Content and Summary Translation**:
        - Ensure summaries are comprehensive but concise:
          * Japanese: ~1000 characters
          * English/Latin scripts: ~1500 characters
          * Other scripts: Adjust while maintaining comprehensive coverage
        - Each key point must be under 300 characters.
      
      3. **Key Points Extraction Guidelines**:
        - Business Impact: Identify specific market opportunities, revenue potential, or competitive advantages
        - Technical Innovation: Highlight unique technological solutions or breakthroughs
        - Growth Metrics: Extract specific numbers about user growth, funding, or market size
        - Strategic Moves: Note important partnerships, acquisitions, or market expansions
        - Future Implications: Point out potential industry changes or future developments

      4. **Summary Structure**:
        - Problem/Opportunity: What market need or challenge is being addressed?
        - Solution/Innovation: What unique approach or technology is being used?
        - Market Impact: What are the business implications or market effects?
        - Competitive Edge: What distinguishes this from existing solutions?

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

  // Normalize translation response to ensure it meets length constraints
  private normalizeTranslationResponse(
    response: z.infer<typeof translationSchema>,
  ): z.infer<typeof translationSchema> {
    const normalized = { ...response };
    if (normalized.titleTranslated) {
      normalized.titleTranslated = normalized.titleTranslated.slice(0, 200);
    }
    if (normalized.titleOriginal) {
      normalized.titleOriginal = normalized.titleOriginal.slice(0, 200);
    }

    // Normalize summary to new shorter length
    if (normalized.summary) {
      normalized.summary = normalized.summary.slice(0, 800);
    }

    if (normalized.key_points) {
      normalized.key_points = normalized.key_points.map((point) =>
        point.slice(0, 300)
      );
    }

    // Ensure translation is a string
    if (normalized.translation) {
      normalized.translation = String(normalized.translation);
    }

    return normalized;
  }
  // Count tokens in text using GPT tokenizer
  private countTokens(text: string): number {
    return encode(text).length;
  }

  // Utility function for delay between retries
  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Split content into manageable chunks for translation
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

  // Translate a single chunk of content
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
    const isFirstChunk = chunkIndex === 0;
    const isTitleOnlyTranslation = content === title;

    try {
      // Prepare the context for the AI model
      const chainResponse = await this.chain.invoke({
        title,
        content,
        source_language: sourceLang,
        target_language: targetLang,
        total_chunks: totalChunks,
        current_chunk: chunkIndex + 1,
        is_first_chunk: isFirstChunk,
        is_title_translation: isTitleOnlyTranslation,
        previous_context: previousContext,
        format_instructions: this.parser.getFormatInstructions(),
      }, { callbacks: [this.tracer] });

      const response = this.normalizeTranslationResponse(chainResponse);

      if (isTitleOnlyTranslation) {
        // For title-only translation, return both original and translated
        return {
          success: true,
          data: {
            titleTranslated: response.titleTranslated,
            titleOriginal: title,
            translation: response.translation, // In case we need the raw translation
            key_points: [], // Empty for title-only translations
          },
        };
      } else {
        // For content chunks, only include title information in first chunk
        return {
          success: true,
          data: {
            titleTranslated: isFirstChunk
              ? response.titleTranslated
              : undefined,
            titleOriginal: isFirstChunk ? title : undefined,
            translation: response.translation,
            key_points: isFirstChunk ? response.key_points : [],
          },
        };
      }
    } catch (error) {
      console.error("Translation error:", error);

      // Handle JSON parsing errors
      if (
        error instanceof Error &&
        error.message.includes("OUTPUT_PARSING_FAILURE")
      ) {
        console.warn(
          "JSON parsing error detected, attempting to clean response",
        );
        try {
          const rawResponse =
            (error as { cause?: { message: string } }).cause?.message || "";
          const cleanedJson = this.cleanupJsonString(rawResponse);
          const parsedResponse = JSON.parse(cleanedJson);
          const normalizedResponse = this.normalizeTranslationResponse(
            parsedResponse,
          );

          // Apply the same logic as above for the cleaned response
          if (isTitleOnlyTranslation) {
            return {
              success: true,
              data: {
                titleTranslated: normalizedResponse.titleTranslated,
                titleOriginal: title,
                translation: normalizedResponse.translation,
                key_points: [],
              },
            };
          } else {
            return {
              success: true,
              data: {
                titleTranslated: isFirstChunk
                  ? normalizedResponse.titleTranslated
                  : undefined,
                titleOriginal: isFirstChunk ? title : undefined,
                translation: normalizedResponse.translation,
                key_points: isFirstChunk ? normalizedResponse.key_points : [],
              },
            };
          }
        } catch (cleanupError) {
          console.error("Failed to clean and parse response:", cleanupError);
        }
      }

      // Handle retries
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

      return {
        success: false,
        error: error instanceof Error
          ? error.message
          : "Translation process failed after retries",
      };
    }
  }
  // Clean up JSON string for parsing
  private cleanupJsonString(text: string): string {
    let cleanedText = text.replace(/```json\n?/, "").replace(/\n?```$/, "");

    const jsonStart = cleanedText.indexOf("{");
    if (jsonStart !== -1) {
      cleanedText = cleanedText.slice(jsonStart);
    }

    cleanedText = cleanedText
      .replace(/[\n\r\t]/g, " ")
      .replace(/\s+/g, " ")
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .trim();

    if (!cleanedText.startsWith("{")) {
      cleanedText = `{${cleanedText}`;
    }
    if (!cleanedText.endsWith("}")) {
      cleanedText = `${cleanedText}}`;
    }

    return cleanedText;
  }

  // Main translation method
  async translate(
    title: string,
    content: string,
    sourceLang: string,
    targetLang: string,
  ): Promise<
    ServiceResponse<{
      titleTranslated: string;
      titleOriginal: string;
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

    try {
      // First translate the title separately
      const titleResult = await this.translateChunk(
        title,
        title,
        sourceLang,
        targetLang,
        0,
        1,
      );

      if (!titleResult.success || !titleResult.data) {
        return {
          success: false,
          error: titleResult.error || "Failed to translate title",
        };
      }

      // Store both original and translated titles
      const translatedTitle = titleResult.data.titleTranslated || title;
      const originalTitle = title;

      // Process content translation as before...
      const totalTokens = this.countTokens(content);
      const chunks = totalTokens > CHUNK_SIZE
        ? this.splitIntoChunks(content)
        : [content];

      console.info(`Content split into ${chunks.length} chunks`);

      const translatedChunks: string[] = [];
      let allKeyPoints: string[] = [];
      let previousContext = "";

      for (let i = 0; i < chunks.length; i++) {
        const chunkResult = await this.translateChunk(
          translatedTitle, // Use translated title for context
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

      const finalTranslation = translatedChunks.join(" ");

      let summary = "";
      if (chunks.length > 1) {
        const summaryResult = await this.translateChunk(
          translatedTitle,
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
          titleTranslated: translatedTitle,
          titleOriginal: originalTitle,
          translation: finalTranslation,
          key_points: allKeyPoints,
          summary: summary ||
            await this.generateCompleteSummary(finalTranslation, targetLang),
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

  // Generate a complete summary for the translated content
  private async generateCompleteSummary(
    content: string,
    targetLang: string,
  ): Promise<string> {
    try {
      const result = await this.translateChunk(
        "",
        content,
        targetLang,
        targetLang,
        0,
        1,
      );

      if (!result.success || !result.data) {
        console.error("Failed to generate summary", result.error);
        return content.slice(0, 1000);
      }

      return result.data.translation;
    } catch (error) {
      console.error("Summary generation failed:", error);
      return content.slice(0, 1000);
    }
  }
}
