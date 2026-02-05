// Pixel font configuration
// Using Press Start 2P for authentic retro pixel aesthetic

export const fonts = {
  // Pixel font for headers and buttons
  pixel: 'PressStart2P_400Regular',

  // System font for body text (better readability)
  system: undefined, // Uses system default
} as const;

// Font sizes optimized for pixel font
// Note: Pixel fonts need smaller sizes to look good
export const fontSizes = {
  // Pixel font sizes
  pixelSmall: 8,
  pixelMedium: 10,
  pixelLarge: 12,
  pixelXLarge: 14,

  // System font sizes
  caption: 11,
  body: 14,
  bodyLarge: 16,
  title: 18,
  header: 20,
} as const;

// Typography presets
export const typography = {
  // Pixel font styles (for headers, buttons)
  pixelHeader: {
    fontFamily: fonts.pixel,
    fontSize: fontSizes.pixelLarge,
    letterSpacing: 0,
  },
  pixelButton: {
    fontFamily: fonts.pixel,
    fontSize: fontSizes.pixelSmall,
    letterSpacing: 0,
  },
  pixelCaption: {
    fontFamily: fonts.pixel,
    fontSize: fontSizes.pixelSmall,
    letterSpacing: 0,
  },

  // System font styles (for readable body text)
  body: {
    fontSize: fontSizes.body,
    lineHeight: 22,
  },
  caption: {
    fontSize: fontSizes.caption,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
} as const;
