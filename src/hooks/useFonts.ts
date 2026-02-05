import { useFonts as useExpoFonts } from 'expo-font';
import { PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';

// Hook to load custom fonts
export function useAppFonts(): { fontsLoaded: boolean; fontError: Error | null } {
  const [fontsLoaded, fontError] = useExpoFonts({
    PressStart2P_400Regular,
  });

  return {
    fontsLoaded,
    fontError: fontError ?? null,
  };
}
