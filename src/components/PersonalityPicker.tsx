import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { JudgePersonality } from '../types';
import { colors } from '../constants/colors';

interface PersonalityPickerProps {
  selected: JudgePersonality;
  onSelect: (personality: JudgePersonality) => void;
}

interface PersonalityOption {
  id: JudgePersonality;
  icon: string;
  name: string;
  description: string;
}

const personalities: PersonalityOption[] = [
  {
    id: 'sarcastic_friend',
    icon: '😏',
    name: 'Sarcastic Friend',
    description: 'Playful teasing with love',
  },
  {
    id: 'cruel_comedian',
    icon: '🎭',
    name: 'Cruel Comedian',
    description: 'No filter, maximum roast',
  },
  {
    id: 'disappointed_parent',
    icon: '😔',
    name: 'Disappointed Parent',
    description: 'Guilt trips and heavy sighs',
  },
];

export function PersonalityPicker({
  selected,
  onSelect,
}: PersonalityPickerProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      {personalities.map((personality) => {
        const isSelected = selected === personality.id;

        return (
          <TouchableOpacity
            key={personality.id}
            style={[styles.option, isSelected && styles.optionSelected]}
            onPress={() => onSelect(personality.id)}
            activeOpacity={0.7}
          >
            {/* Radio indicator */}
            <View style={styles.radioContainer}>
              <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                {isSelected && <View style={styles.radioInner} />}
              </View>
            </View>

            {/* Icon */}
            <Text style={styles.icon}>{personality.icon}</Text>

            {/* Text content */}
            <View style={styles.textContainer}>
              <Text style={[styles.name, isSelected && styles.nameSelected]}>
                {personality.name}
              </Text>
              <Text style={styles.description}>{personality.description}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.bgSecondary,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: colors.border,
  },
  optionSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent + '15',
  },
  radioContainer: {
    marginRight: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgPrimary,
  },
  radioOuterSelected: {
    borderColor: colors.accent,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  nameSelected: {
    color: colors.accent,
  },
  description: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
