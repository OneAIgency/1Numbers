/**
 * AI Provider Base Class
 *
 * Abstract base class for AI model providers (Claude, Ollama, etc.).
 * Provides common interface for text generation, streaming, and model management.
 */

export interface GenerateOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
  systemPrompt?: string;
  timeout?: number;
}

export interface GenerateResult {
  content: string;
  model: string;
  tokensInput: number;
  tokensOutput: number;
  finishReason: 'stop' | 'length' | 'error';
  duration: number;
}

export interface StreamChunk {
  content: string;
  done: boolean;
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  maxTokens: number;
  supportsStreaming: boolean;
  costPerInputToken?: number;
  costPerOutputToken?: number;
}

export interface ProviderHealth {
  healthy: boolean;
  latency?: number;
  error?: string;
  availableModels?: string[];
}

export abstract class AIProvider {
  protected readonly name: string;
  protected readonly defaultModel: string;
  protected readonly defaultTemperature: number;
  protected readonly defaultMaxTokens: number;

  constructor(
    name: string,
    defaultModel: string,
    defaultTemperature: number = 0.7,
    defaultMaxTokens: number = 4096
  ) {
    this.name = name;
    this.defaultModel = defaultModel;
    this.defaultTemperature = defaultTemperature;
    this.defaultMaxTokens = defaultMaxTokens;
  }

  /**
   * Get provider name
   */
  getName(): string {
    return this.name;
  }

  /**
   * Get default model
   */
  getDefaultModel(): string {
    return this.defaultModel;
  }

  /**
   * Generate text completion
   */
  abstract generate(prompt: string, options?: GenerateOptions): Promise<GenerateResult>;

  /**
   * Generate text with streaming
   */
  abstract generateStream(
    prompt: string,
    options?: GenerateOptions
  ): AsyncGenerator<StreamChunk, void, unknown>;

  /**
   * Get available models
   */
  abstract listModels(): Promise<ModelInfo[]>;

  /**
   * Check provider health
   */
  abstract healthCheck(): Promise<ProviderHealth>;

  /**
   * Estimate cost for a generation
   */
  abstract estimateCost(tokensInput: number, tokensOutput: number, model?: string): number;

  /**
   * Parse response to extract code blocks
   */
  protected extractCodeBlocks(content: string): Array<{ language: string; code: string }> {
    const blocks: Array<{ language: string; code: string }> = [];
    const regex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      const code = match[2];
      if (code !== undefined) {
        blocks.push({
          language: match[1] || 'text',
          code: code.trim()
        });
      }
    }

    return blocks;
  }

  /**
   * Parse JSON from response
   */
  protected extractJson<T>(content: string): T | null {
    // Try to extract JSON from markdown code blocks first
    const jsonBlockMatch = content.match(/```json\n([\s\S]*?)```/);
    if (jsonBlockMatch && jsonBlockMatch[1] !== undefined) {
      try {
        return JSON.parse(jsonBlockMatch[1]) as T;
      } catch {
        // Fall through to try raw parsing
      }
    }

    // Try to parse raw JSON
    try {
      return JSON.parse(content) as T;
    } catch {
      return null;
    }
  }

  /**
   * Build messages array for chat models
   */
  protected buildMessages(
    prompt: string,
    systemPrompt?: string
  ): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }

    messages.push({ role: 'user', content: prompt });

    return messages;
  }

  /**
   * Merge options with defaults
   */
  protected mergeOptions(options?: GenerateOptions): {
    model: string;
    temperature: number;
    maxTokens: number;
    timeout: number;
    stopSequences?: string[];
    systemPrompt?: string;
  } {
    const result: {
      model: string;
      temperature: number;
      maxTokens: number;
      timeout: number;
      stopSequences?: string[];
      systemPrompt?: string;
    } = {
      model: options?.model ?? this.defaultModel,
      temperature: options?.temperature ?? this.defaultTemperature,
      maxTokens: options?.maxTokens ?? this.defaultMaxTokens,
      timeout: options?.timeout ?? 120000
    };

    if (options?.stopSequences !== undefined) {
      result.stopSequences = options.stopSequences;
    }
    if (options?.systemPrompt !== undefined) {
      result.systemPrompt = options.systemPrompt;
    }

    return result;
  }
}

/**
 * Provider factory type
 */
export type AIProviderFactory = (config: Record<string, unknown>) => AIProvider;

/**
 * Registry for AI providers
 */
export class AIProviderRegistry {
  private providers: Map<string, AIProvider> = new Map();
  private factories: Map<string, AIProviderFactory> = new Map();

  /**
   * Register a provider factory
   */
  registerFactory(name: string, factory: AIProviderFactory): void {
    this.factories.set(name, factory);
  }

  /**
   * Create and register a provider instance
   */
  createProvider(name: string, config: Record<string, unknown>): AIProvider {
    const factory = this.factories.get(name);
    if (!factory) {
      throw new Error(`No factory registered for provider: ${name}`);
    }

    const provider = factory(config);
    this.providers.set(name, provider);
    return provider;
  }

  /**
   * Get a registered provider
   */
  getProvider(name: string): AIProvider | undefined {
    return this.providers.get(name);
  }

  /**
   * Get all registered providers
   */
  getAllProviders(): AIProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Check health of all providers
   */
  async healthCheckAll(): Promise<Map<string, ProviderHealth>> {
    const results = new Map<string, ProviderHealth>();

    const checks = Array.from(this.providers.entries()).map(async ([name, provider]) => {
      try {
        const health = await provider.healthCheck();
        results.set(name, health);
      } catch (error) {
        results.set(name, {
          healthy: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    });

    await Promise.all(checks);
    return results;
  }
}

// Singleton registry
let providerRegistryInstance: AIProviderRegistry | null = null;

export function getAIProviderRegistry(): AIProviderRegistry {
  if (!providerRegistryInstance) {
    providerRegistryInstance = new AIProviderRegistry();
  }
  return providerRegistryInstance;
}
