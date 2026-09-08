import AsyncStorage from '@react-native-async-storage/async-storage';

export class AsyncStorageService {
  private static readonly PREFIX = '@muudai_';

  private static formatKey(key: string): string {
    return `${this.PREFIX}${key}`;
  }

  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const fullKey = this.formatKey(key);
      const rawValue = await AsyncStorage.getItem(fullKey);
      if (!rawValue) {
        return null;
      }
      return JSON.parse(rawValue) as T;
    } catch (error) {
      console.error(`[AsyncStorageService] Failed to read key: ${key}`, error);
      return null;
    }
  }

  static async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const fullKey = this.formatKey(key);
      const serializedValue = JSON.stringify(value);
      await AsyncStorage.setItem(fullKey, serializedValue);
    } catch (error) {
      console.error(`[AsyncStorageService] Failed to save key: ${key}`, error);
      throw new Error(`Offline storage error: unable to save ${key}`);
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      const fullKey = this.formatKey(key);
      await AsyncStorage.removeItem(fullKey);
    } catch (error) {
      console.error(`[AsyncStorageService] Failed to remove key: ${key}`, error);
    }
  }

  static async clearAll(): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const muudKeys = allKeys.filter((k) => k.startsWith(this.PREFIX));
      if (muudKeys.length > 0) {
        await AsyncStorage.multiRemove(muudKeys);
      }
    } catch (error) {
      console.error('[AsyncStorageService] Failed to clear storage', error);
    }
  }
}
