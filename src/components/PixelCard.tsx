import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../constants/colors';

interface PixelCardProps {
  children: React.ReactNode;
  title?: string;
  titleIcon?: string;
  variant?: 'default' | 'highlighted' | 'error';
  style?: ViewStyle;
  noPadding?: boolean;
}

export function PixelCard({
  children,
  title,
  titleIcon,
  variant = 'default',
  style,
  noPadding = false,
}: PixelCardProps): React.JSX.Element {
  const containerStyle = [
    styles.container,
    styles[variant],
    style,
  ];

  const contentStyle = [
    styles.content,
    noPadding && styles.noPadding,
  ];

  return (
    <View style={containerStyle}>
      {/* Highlight edge (top-left) */}
      <View style={styles.highlightEdge} />

      {/* Header */}
      {title && (
        <View style={styles.header}>
          {titleIcon && <Text style={styles.headerIcon}>{titleIcon}</Text>}
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
      )}

      {/* Content */}
      <View style={contentStyle}>{children}</View>

      {/* Shadow edge (bottom-right) */}
      <View style={styles.shadowEdge} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 2,
    borderWidth: 3,
    borderColor: colors.border,
    overflow: 'hidden',
    position: 'relative',
  },
  default: {
    borderColor: colors.border,
  },
  highlighted: {
    borderColor: colors.accent,
  },
  error: {
    borderColor: colors.error,
  },
  highlightEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 3,
    height: 3,
    backgroundColor: colors.bgTertiary,
  },
  shadowEdge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 3,
    height: 3,
    backgroundColor: '#1A1520',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    backgroundColor: colors.bgTertiary,
  },
  headerIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  content: {
    padding: 16,
  },
  noPadding: {
    padding: 0,
  },
});
