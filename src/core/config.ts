export const AppConfig = {
  gemini: {
    apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || '',
    model: 'gemini-3.5-flash',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
  },

  gamification: {
    maxDailyMistakesForReview: 10,
    mysteryChestCooldownHours: 24,
  },
  energy: {
    maxEnergy: 5,
    refillIntervalSeconds: 600, // 10 daqiqa
    refillIntervalMs: 600 * 1000, // 600,000 ms (10 daqiqa)
  }
};
