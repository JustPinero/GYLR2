import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { JudgePersonality } from '../types';
import { PixelButton } from './PixelButton';
import { colors } from '../constants/colors';

interface JudgmentCardProps {
  judgment: string | null;
  loading: boolean;
  onRequestJudgment: () => void;
  personality: JudgePersonality;
  disabled?: boolean;
}

const personalityInfo: Record<JudgePersonality, { icon: string; name: string }> = {
  sarcastic_friend: { icon: '😏', name: 'Sarcastic Friend' },
  cruel_comedian: { icon: '🎭', name: 'Cruel Comedian' },
  disappointed_parent: { icon: '😔', name: 'Disappointed Parent' },
};

export function JudgmentCard({
  judgment,
  loading,
  onRequestJudgment,
  personality,
  disabled = false,
}: JudgmentCardProps): React.JSX.Element {
  const { icon, name } = personalityInfo[personality];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🎭</Text>
        <Text style={styles.headerTitle}>Your Judgment</Text>
      </View>

      {/* Personality Badge */}
      <View style={styles.personalityBadge}>
        <Text style={styles.personalityIcon}>{icon}</Text>
        <Text style={styles.personalityName}>{name}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.accent} />
            <Text style={styles.loadingText}>Judging your life choices...</Text>
          </View>
        ) : judgment ? (
          <Text style={styles.judgmentText}>"{judgment}"</Text>
        ) : (
          <Text style={styles.placeholderText}>
            Ready to hear what we think about how you spend your time?
          </Text>
        )}
      </View>

      {/* Button */}
      <View style={styles.buttonContainer}>
        <PixelButton
          title={judgment ? 'Roast Me Again' : 'Get Roasted'}
          onPress={onRequestJudgment}
          loading={loading}
          disabled={disabled}
          variant="primary"
        />
      </View>

      {/* Disclaimer */}
      <Text style={styles.disclaimer}>
        Powered by AI • Just for fun
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    backgroundColor: colors.bgTertiary,
  },
  headerIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  personalityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: colors.accent + '15',
  },
  personalityIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  personalityName: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  content: {
    padding: 20,
    minHeight: 100,
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  judgmentText: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  placeholderText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    alignItems: 'center',
  },
  disclaimer: {
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    paddingBottom: 12,
  },
});
