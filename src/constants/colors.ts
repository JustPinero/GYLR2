// Game Dev Story inspired pixel art color palette
export const colors = {
  // Background
  bgPrimary: '#2C2137',
  bgSecondary: '#3D2944',
  bgTertiary: '#4A3550',

  // Category colors
  work: '#E85D75',
  play: '#50C878',
  health: '#4ECDC4',
  romance: '#FF6B9D',
  study: '#9B59B6',
  uncategorized: '#6B6B6B',

  // UI colors
  textPrimary: '#FFFEF2',
  textSecondary: '#C9B8A8',
  textMuted: '#8B7B6B',
  accent: '#FFD93D',
  border: '#5D4954',

  // State colors
  success: '#7FCD91',
  error: '#E85D75',
  warning: '#FFB347',

  // Tab bar
  tabBarBackground: '#1A1520',
  tabBarActive: '#FFD93D',
  tabBarInactive: '#6B5B6B',
} as const;

export type ColorName = keyof typeof colors;
