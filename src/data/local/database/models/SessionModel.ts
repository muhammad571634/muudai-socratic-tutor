import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class SessionModel extends Model {
  static table = 'sessions';

  @field('subject') subject!: string;
  @field('topic') topic!: string;
  @date('started_at') startedAt!: Date;
  @date('completed_at') completedAt!: Date | null;
  @field('is_synced') isSynced!: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
