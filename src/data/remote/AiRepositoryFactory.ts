import { AppConfig } from '../../core/config';
import { ISocraticAiRepository } from '../../domain/repositories/ISocraticAiRepository';
import { GeminiSocraticDataSource } from './GeminiSocraticDataSource';
import { OpenAiSocraticDataSource } from './OpenAiSocraticDataSource';

let cachedRepository: ISocraticAiRepository | null = null;

/**
 * Factory function to retrieve the configured AI repository implementation (Gemini or OpenAI ChatGPT).
 * Follows Clean Architecture Dependency Inversion Principle (DIP).
 */
export function getSocraticAiRepository(): ISocraticAiRepository {
  if (cachedRepository) {
    return cachedRepository;
  }

  if (AppConfig.ai.activeProvider === 'openai') {
    cachedRepository = new OpenAiSocraticDataSource();
  } else {
    cachedRepository = new GeminiSocraticDataSource();
  }

  return cachedRepository;
}
