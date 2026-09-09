export type AiProviderType = 'gemini' | 'openai';

export const AppConfig = {
  ai: {
    activeProvider: (process.env.EXPO_PUBLIC_AI_PROVIDER || 'gemini') as AiProviderType,
  },
  gemini: {
    apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || '',
    model: 'gemini-3.8-flash',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
  },
  openai: {
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY || '',
    model: process.env.EXPO_PUBLIC_OPENAI_MODEL || 'gpt-4o-mini',
    endpoint: 'https://api.openai.com/v1',
  },

  gamification: {
    maxDailyMistakesForReview: 10,
    mysteryChestCooldownHours: 24,
  },
  energy: {
    maxEnergy: 5,
    refillIntervalSeconds: 3 * 3600, // 3 soat (10,800 soniya)
    refillIntervalMs: 3 * 3600 * 1000, // 10,800,000 ms (3 soat)
  }
};
