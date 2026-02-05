import { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList,
  ViewToken,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PixelButton } from '../components';
import { colors } from '../constants/colors';
import { hapticSelection } from '../utils/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STORAGE_KEY = '@gylr/has_onboarded';

interface OnboardingScreenProps {
  onComplete: () => void;
}

interface OnboardingPage {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const pages: OnboardingPage[] = [
  {
    id: 'welcome',
    icon: '🎮',
    title: 'Get Your Life Right',
    description:
      'Track how you spend your time and get AI-powered roasts about your life choices.',
  },
  {
    id: 'how-it-works',
    icon: '📅',
    title: 'How It Works',
    description:
      'Connect your Google Calendar, categorize your events, and see where your time really goes.',
  },
  {
    id: 'categories',
    icon: '📊',
    title: '5 Life Categories',
    description:
      'Work, Play, Health, Romance, Study — watch your life breakdown in a beautiful pie chart.',
  },
  {
    id: 'judge',
    icon: '🎭',
    title: 'Meet Your Judge',
    description:
      'Choose between Sarcastic Friend, Cruel Comedian, or Disappointed Parent to roast your choices.',
  },
];

export function OnboardingScreen({
  onComplete,
}: OnboardingScreenProps): React.JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const firstItem = viewableItems[0];
      if (firstItem && firstItem.index !== null && firstItem.index !== undefined) {
        setCurrentIndex(firstItem.index);
        hapticSelection();
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = (): void => {
    if (currentIndex < pages.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const handleSkip = async (): Promise<void> => {
    await markOnboarded();
    onComplete();
  };

  const handleGetStarted = async (): Promise<void> => {
    await markOnboarded();
    onComplete();
  };

  const isLastPage = currentIndex === pages.length - 1;

  const renderPage = ({ item }: { item: OnboardingPage }): React.JSX.Element => (
    <View style={styles.page}>
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip button */}
      {!isLastPage && (
        <View style={styles.skipContainer}>
          <PixelButton
            title="Skip"
            onPress={handleSkip}
            variant="secondary"
            style={styles.skipButton}
          />
        </View>
      )}

      {/* Pages */}
      <FlatList
        ref={flatListRef}
        data={pages}
        renderItem={renderPage}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
      />

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {pages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* Bottom button */}
      <View style={styles.bottomContainer}>
        {isLastPage ? (
          <PixelButton
            title="Get Started"
            onPress={handleGetStarted}
            variant="primary"
            style={styles.bottomButton}
          />
        ) : (
          <PixelButton
            title="Next"
            onPress={handleNext}
            variant="primary"
            style={styles.bottomButton}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

// Helper to mark onboarding as complete
async function markOnboarded(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, 'true');
  } catch {
    // Ignore storage errors
  }
}

// Helper to check if user has onboarded
export async function hasOnboarded(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

// Helper to reset onboarding (for testing)
export async function resetOnboarding(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  skipContainer: {
    position: 'absolute',
    top: 60,
    right: 16,
    zIndex: 10,
  },
  skipButton: {
    minWidth: 80,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  page: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  icon: {
    fontSize: 80,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginHorizontal: 6,
  },
  dotActive: {
    backgroundColor: colors.accent,
    width: 24,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  bottomButton: {
    alignSelf: 'stretch',
  },
});
