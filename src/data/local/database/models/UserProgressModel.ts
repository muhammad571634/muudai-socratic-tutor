import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, text } from '@nozbe/watermelondb/decorators';

export default class UserProgressModel extends Model {
  static table = 'user_progress';

  @field('xp') xp!: number;
  @field('streak_days') streakDays!: number;
  @field('is_streak_claimed_today') isStreakClaimedToday!: boolean;
  @text('last_active_date_iso') lastActiveDateIso!: string;
  @field('solved_problems_count') solvedProblemsCount!: number;
  @field('active_days_count') activeDaysCount!: number;
  @field('energy') energy!: number;
  @field('max_energy') maxEnergy!: number;
  @text('selected_subject') selectedSubject!: string;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
