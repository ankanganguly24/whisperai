export interface OnboardingSlide {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly icon: any;
}

export const SLIDE_ANIMATION_DURATION = 500;

export const ONBOARDING_SLIDES: readonly OnboardingSlide[] = [
  {
    id: 1,
    title: 'Talk with intelligence that listens',
    description:
      'Meet Whisper AI — your personal space to create smart agents that understand you, guide you, and grow with you.',
    icon: require('../../assets/images/onboardingImage1.png'),
  },
  {
    id: 2,
    title: 'Build your own AI circle',
    description:
      'From fitness coaches to chefs to mentors — create unique AIs tailored for every part of your life. Each one remembers, responds, and evolves with you.',
    icon: require('../../assets/images/onboardingImage2.png'),
  },
  {
    id: 3,
    title: 'Minimal. Personal. Powerful.',
    description:
      'In a world full of noise, Whisper AI keeps it quiet — just you and your thoughts, amplified by intelligence that truly understands.',
    icon: require('../../assets/images/onboardingImage3.png'),
  },
];

export const ANIMATION = {
  ICON_SIZE: 300,
  INDICATOR_SIZE: 12,
  INDICATOR_ACTIVE_WIDTH: 24,
} as const;
