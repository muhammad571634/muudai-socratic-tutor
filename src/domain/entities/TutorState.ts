export type TutorVoiceState = 'idle' | 'listening' | 'thinking' | 'speaking';

export interface TutorStateConfig {
  /** i18n kalitlari — matn UI qatlamida `t(...)` bilan olinadi. */
  labelKey: string;
  hintKey: string;
  iconName: string;
}

export const TUTOR_STATE_CONFIGS: Record<TutorVoiceState, TutorStateConfig> = {
  idle: {
    labelKey: 'tutorState.idle.label',
    hintKey: 'tutorState.idle.hint',
    iconName: 'sparkles',
  },
  listening: {
    labelKey: 'tutorState.listening.label',
    hintKey: 'tutorState.listening.hint',
    iconName: 'mic',
  },
  thinking: {
    labelKey: 'tutorState.thinking.label',
    hintKey: 'tutorState.thinking.hint',
    iconName: 'bulb',
  },
  speaking: {
    labelKey: 'tutorState.speaking.label',
    hintKey: 'tutorState.speaking.hint',
    iconName: 'volume-high',
  },
};
