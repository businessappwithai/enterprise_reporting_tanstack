/**
 * Embedding Service: Generate vector embeddings using Ollama (D23)
 *
 * Uses Ollama's embedding API to generate semantic embeddings for queries
 */

export class EmbeddingService {
  private ollamaUrl: string;
  private model: string = "bge-small"; // Small, efficient model for semantic search
  private cache: Map<string, number[]> = new Map();

  constructor() {
    this.ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  }

  /**
   * Generate embedding for text using Ollama (D23: self-hosted)
   */
  async embed(text: string): Promise<number[]> {
    if (!text || text.trim().length === 0) {
      return [];
    }

    // Check cache first
    const cacheKey = this.getCacheKey(text);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const response = await fetch(`${this.ollamaUrl}/api/embed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          input: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = (await response.json()) as { embeddings?: number[][] };

      if (!data.embeddings || data.embeddings.length === 0) {
        console.warn("[Embedding] No embeddings returned from Ollama");
        return [];
      }

      const embedding = data.embeddings[0];

      // Cache the result
      this.cache.set(cacheKey, embedding);

      // Limit cache size to 1000 entries
      if (this.cache.size > 1000) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }

      return embedding;
    } catch (error) {
      console.error("[Embedding] Failed to generate embedding:", error);
      // Return zero vector on error (similarity will be 0)
      return [];
    }
  }

  /**
   * Batch embed multiple texts
   */
  async embedBatch(texts: string[]): Promise<number[][]> {
    const results: number[][] = [];
    for (const text of texts) {
      const embedding = await this.embed(text);
      results.push(embedding);
    }
    return results;
  }

  /**
   * Clear cache (for memory management)
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache key (hash text for normalization)
   */
  private getCacheKey(text: string): string {
    // Simple hash: use text as-is if short, otherwise hash it
    if (text.length < 200) {
      return text;
    }

    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `hash_${Math.abs(hash)}`;
  }

  /**
   * Check if Ollama is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.ollamaUrl}/api/tags`, {
        method: "GET",
      });
      return response.ok;
    } catch (error) {
      console.warn("[Embedding] Ollama not available:", error);
      return false;
    }
  }

  /**
   * Check if model is loaded in Ollama
   */
  async isModelLoaded(): Promise<boolean> {
    try {
      const response = await fetch(`${this.ollamaUrl}/api/tags`, {
        method: "GET",
      });

      if (!response.ok) {
        return false;
      }

      const data = (await response.json()) as { models?: Array<{ name: string }> };

      if (!data.models) {
        return false;
      }

      return data.models.some((m) => m.name.includes(this.model));
    } catch (error) {
      console.warn("[Embedding] Failed to check model status:", error);
      return false;
    }
  }
}
