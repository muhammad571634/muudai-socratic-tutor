import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { mySchema } from './schema';
import UserProgressModel from './models/UserProgressModel';
import SessionModel from './models/SessionModel';

const adapter = new SQLiteAdapter({
  schema: mySchema,
  // (You might want to pass experimentalUseJSI: true here if you're using a custom dev client, but false is safer in basic Expo)
  jsi: false,
  onSetUpError: error => {
    // Database failed to load -- offer the user to reload the app or log out
    console.error('WatermelonDB setup error', error);
  }
});

export const database = new Database({
  adapter,
  modelClasses: [
    UserProgressModel,
    SessionModel,
  ],
});
