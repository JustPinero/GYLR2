import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Category } from '../types';
import { getCategoryInfo } from '../services/categorization';
import { colors } from '../constants/colors';

interface CategoryBadgeProps {
  category: Category;
  confirmed?: boolean;
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
  showLabel?: boolean;
  onPress?: () => void;
}

export function CategoryBadge({
  category,
  confirmed = true,
  size = 'medium',
  showIcon = true,
  showLabel = true,
  onPress,
}: CategoryBadgeProps): React.JSX.Element {
  const { icon, label, color } = getCategoryInfo(category);

  const sizeStyles = {
    small: {
      paddingVertical: 2,
      paddingHorizontal: 6,
      fontSize: 10,
      iconSize: 12,
    },
    medium: {
      paddingVertical: 4,
      paddingHorizontal: 10,
      fontSize: 12,
      iconSize: 14,
    },
    large: {
      paddingVertical: 6,
      paddingHorizontal: 14,
      fontSize: 14,
      iconSize: 18,
    },
  };

  const currentSize = sizeStyles[size];

  const content = (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: color + '20', // 20% opacity
          borderColor: color,
          paddingVertical: currentSize.paddingVertical,
          paddingHorizontal: currentSize.paddingHorizontal,
        },
      ]}
    >
      {showIcon && (
        <Text style={[styles.icon, { fontSize: currentSize.iconSize }]}>
          {icon}
        </Text>
      )}
      {showLabel && (
        <Text
          style={[
            styles.label,
            {
              color,
              fontSize: currentSize.fontSize,
              marginLeft: showIcon ? 4 : 0,
            },
          ]}
        >
          {label.toUpperCase()}
        </Text>
      )}
      {!confirmed && (
        <Text style={[styles.unconfirmed, { color: colors.warning }]}>?</Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 2,
    borderWidth: 2,
  },
  icon: {
    // fontSize set dynamically
  },
  label: {
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  unconfirmed: {
    marginLeft: 4,
    fontWeight: 'bold',
    fontSize: 12,
  },
});
