import { useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleSignInButton } from '../components';
import { signInWithGoogle } from '../services/googleAuth';
import { useAppDispatch } from '../hooks';
import { setAuthenticated, setTokens } from '../store/settingsSlice';
import { colors } from '../constants/colors';

export function AuthScreen(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (): Promise<void> => {
    setLoading(true);
    try {
      const tokens = await signInWithGoogle();

      if (tokens) {
        dispatch(setTokens({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken ?? null,
          expiresAt: tokens.expiresAt,
        }));
        dispatch(setAuthenticated({ isAuthenticated: true, email: null }));
      } else {
        Alert.alert(
          'Sign In Cancelled',
          'You need to sign in with Google to use this app.'
        );
      }
    } catch (error) {
      Alert.alert(
        'Sign In Failed',
        'There was a problem signing in. Please try again.'
      );
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Title Area */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>📊</Text>
          </View>
          <Text style={styles.title}>Get Your Life Right</Text>
          <Text style={styles.subtitle}>GYLR</Text>
        </View>

        {/* Description */}
        <View style={styles.description}>
          <Text style={styles.tagline}>
            Your calendar. Our judgment.
          </Text>
          <Text style={styles.descriptionText}>
            Connect your Google Calendar and let us roast how you spend your time.
            Categorize your events and get brutally honest (but funny) feedback
            on your life choices.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <FeatureItem icon="📅" text="Sync your Google Calendar" />
          <FeatureItem icon="🏷️" text="Categorize your events" />
          <FeatureItem icon="📊" text="See your time breakdown" />
          <FeatureItem icon="🎭" text="Get roasted by AI" />
        </View>

        {/* Sign In Button */}
        <View style={styles.buttonContainer}>
          <GoogleSignInButton
            onPress={handleSignIn}
            loading={loading}
          />
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          We only read your calendar to judge you.{'\n'}
          We never share your data.
        </Text>
      </View>
    </SafeAreaView>
  );
}

interface FeatureItemProps {
  icon: string;
  text: string;
}

function FeatureItem({ icon, text }: FeatureItemProps): React.JSX.Element {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: colors.bgSecondary,
    borderWidth: 3,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: 'bold',
    letterSpacing: 4,
    marginTop: 4,
  },
  description: {
    alignItems: 'center',
    marginBottom: 32,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.accent,
    marginBottom: 12,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  features: {
    width: '100%',
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  footer: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
