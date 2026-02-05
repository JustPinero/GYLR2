import { StyleSheet, View, Text } from 'react-native';
import { colors } from '../constants/colors';

export function LifeScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Life Panel</Text>
      <Text style={styles.subtitle}>Your time allocation and roasts</Text>
      <View style={styles.placeholderChart}>
        <Text style={styles.chartText}>Pie Chart</Text>
        <Text style={styles.chartSubtext}>Coming Soon</Text>
      </View>
      <View style={styles.judgmentCard}>
        <Text style={styles.judgmentTitle}>Your Judgment</Text>
        <Text style={styles.judgmentText}>
          Connect your calendar to get roasted!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  placeholderChart: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.bgSecondary,
    borderWidth: 3,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  chartText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textMuted,
  },
  chartSubtext: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  judgmentCard: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  judgmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: 12,
  },
  judgmentText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
