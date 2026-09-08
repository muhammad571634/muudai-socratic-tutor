export type TutorVoiceState = 'idle' | 'listening' | 'thinking' | 'speaking';

export interface TutorStateConfig {
  label: string;
  hint: string;
  iconName: string;
}

export const TUTOR_STATE_CONFIGS: Record<TutorVoiceState, TutorStateConfig> = {
  idle: {
    label: 'Ready to Help',
    hint: 'Point at your notebook and tap to ask',
    iconName: 'sparkles',
  },
  listening: {
    label: 'Listening to You...',
    hint: 'Explain where you got stuck...',
    iconName: 'mic',
  },
  thinking: {
    label: 'Analyzing Problem...',
    hint: 'Finding the best Socratic hint...',
    iconName: 'bulb',
  },
  speaking: {
    label: 'AI Tutor Explaining',
    hint: 'Listen carefully or interrupt anytime',
    iconName: 'volume-high',
  },
};
