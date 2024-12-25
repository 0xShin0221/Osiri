import { BatchResults } from "../../../types/batch";

export interface StepResult {
  [key: string]: number;
}

export interface StepProcessor {
  execute(
    results: BatchResults,
    onProgress?: (stage: string, count: number) => void,
    onError?: (stage: string, error: Error, itemId?: string) => void
  ): Promise<StepResult>;
}