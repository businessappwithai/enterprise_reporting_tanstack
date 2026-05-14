/**
 * Vector embeddings for logs using pgvector
 * Generates semantic embeddings for log messages for similarity search
 */

/**
 * Generate a simple vector embedding from text
 * For production, this would use OpenAI or similar API
 * This version uses a deterministic hash-based approach for testing
 */
export function generateTextEmbedding(text: string): number[] {
  // Create a 1536-dimensional vector (OpenAI embedding size)
  const vector = new Array(1536).fill(0);

  // Simple hash-based approach: use character codes to distribute values
  const normalized = text.toLowerCase().trim();

  for (let i = 0; i < normalized.length; i++) {
    const charCode = normalized.charCodeAt(i);
    const index = (charCode * 997 + i * 13) % 1536; // Distribute across dimensions
    vector[index] += (charCode / 256) * 0.1; // Small weight per character
  }

  // Normalize the vector to unit length
  let magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (magnitude === 0) magnitude = 1;

  return vector.map((val) => val / magnitude);
}

/**
 * Generate embeddings for log message and metadata combined
 */
export function generateLogEmbedding(
  message: string,
  component: string,
  level: string,
  metadata?: Record<string, unknown>
): number[] {
  // Combine all text for embedding
  let combinedText = `[${level}] ${component}: ${message}`;

  if (metadata) {
    const metadataStr = Object.entries(metadata)
      .map(([key, value]) => {
        if (typeof value === "object") {
          return `${key}:${JSON.stringify(value).substring(0, 100)}`;
        }
        return `${key}:${String(value).substring(0, 50)}`;
      })
      .join(" ");
    combinedText += ` ${metadataStr}`;
  }

  return generateTextEmbedding(combinedText);
}

/**
 * Calculate cosine similarity between two vectors
 * Used for finding similar logs
 */
export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  for (let i = 0; i < Math.min(vec1.length, vec2.length); i++) {
    dotProduct += vec1[i] * vec2[i];
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }

  mag1 = Math.sqrt(mag1);
  mag2 = Math.sqrt(mag2);

  if (mag1 === 0 || mag2 === 0) return 0;

  return dotProduct / (mag1 * mag2);
}
