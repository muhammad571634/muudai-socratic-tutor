import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const mySchema = appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: 'user_progress',
      columns: [
        { name: 'xp', type: 'number' },
        { name: 'streak_days', type: 'number' },
        { name: 'is_streak_claimed_today', type: 'boolean' },
        { name: 'last_active_date_iso', type: 'string' },
        { name: 'solved_problems_count', type: 'number' },
        { name: 'active_days_count', type: 'number' },
        { name: 'energy', type: 'number' },
        { name: 'max_energy', type: 'number' },
        { name: 'selected_subject', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'sessions',
      columns: [
        { name: 'subject', type: 'string' },
        { name: 'topic', type: 'string' },
        { name: 'started_at', type: 'number' },
        { name: 'completed_at', type: 'number', isOptional: true },
        { name: 'is_synced', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
});
