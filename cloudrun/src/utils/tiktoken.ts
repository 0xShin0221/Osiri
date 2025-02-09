import { get_encoding, Tiktoken, TiktokenEncoding } from "tiktoken";


export type SupportedModel = 
  | "gpt-4" 
  | "gpt-3.5-turbo" 
  | "gpt-4-turbo-preview"
  | "gpt-4o-mini";

export class TokenCounter {
  private encoder: Tiktoken | null = null;
  private modelName: SupportedModel;

  constructor(model: SupportedModel = 'gpt-4o-mini') {
    this.modelName = model;
    console.info(`Initializing TokenCounter for model: ${model}`);
  }

  async initialize(): Promise<void> {
    try {
      const encoding = this.modelName === 'gpt-4o-mini' ? "o200k_base" : "cl100k_base";
      this.encoder = get_encoding(encoding);
      console.info(`Initialized encoder with ${encoding} encoding for ${this.modelName}`);
    } catch (error) {
      console.error('Failed to initialize encoder:', error);
      throw new Error('Token counter initialization failed');
    }
  }

  countTokens(text: string): number {
    if (!this.encoder) {
      throw new Error('Token counter not initialized');
    }
    return this.encoder.encode(text).length;
  }

  estimateTranslationTokens(content: {
    title: string;
    text: string;
    sourceLang: string;
    targetLang: string;
  }): number {
    if (!this.encoder) {
      throw new Error('Token counter not initialized');
    }

    // Count tokens in the input content
    const titleTokens = this.countTokens(content.title);
    const textTokens = this.countTokens(content.text);

    // Add system message tokens (estimated)
    const systemPrompt = `Translate from ${content.sourceLang} to ${content.targetLang}`;
    const systemTokens = this.countTokens(systemPrompt);

    // Add format instruction tokens (estimated)
    const formatInstructions = 'Return JSON with title, translation, key_points, and summary';
    const formatTokens = this.countTokens(formatInstructions);

    // Add safety margin (20%)
    const totalTokens = (titleTokens + textTokens + systemTokens + formatTokens) * 1.2;

    return Math.ceil(totalTokens);
  }

  async splitContentForTranslation(content: string, maxTokens: number = 4000): Promise<string[]> {
    if (!this.encoder) {
      throw new Error('Token counter not initialized');
    }

    const tokens = this.encoder.encode(content); // Encode content into tokens (returns number[])
    const chunks: string[] = [];
    let currentChunk: number[] = []; // Use a number[] as a temporary holder
  
    for (const token of tokens) {
      if (currentChunk.length >= maxTokens) {
        // Convert to Uint32Array for decoding, then decode and store the result
        const chunkArray = new Uint32Array(currentChunk);
        chunks.push(new TextDecoder().decode(this.encoder.decode(chunkArray)));
        currentChunk = []; // Reset currentChunk for the next batch
      }
      currentChunk.push(token);
    }

    // Add remaining chunk
    if (currentChunk.length > 0) {
        const chunkArray = new Uint32Array(currentChunk);
         chunks.push(new TextDecoder().decode(this.encoder.decode(chunkArray)));
    }

    return chunks;
  }

  dispose(): void {
    if (this.encoder) {
      this.encoder.free();
      this.encoder = null;
    }
  }
}
