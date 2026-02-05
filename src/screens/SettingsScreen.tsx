import { Alert } from 'react-native';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector, useAppDispatch } from '../hooks';
import {
  selectUserEmail,
  selectUserName,
  logout,
} from '../store/settingsSlice';
import { clearEvents } from '../store/eventsSlice';
import { clearStoredMappings } from '../store/categoriesSlice';
import { signOut } from '../services/googleAuth';
import { colors } from '../constants/colors';

export function SettingsScreen(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const userEmail = useAppSelector(selectUserEmail);
  const userName = useAppSelector(selectUserName);

  const handleSignOut = (): void => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            dispatch(clearEvents());
            dispatch(logout());
          },
        },
      ]
    );
  };

  const handleClearMappings = (): void => {
    Alert.alert(
      'Clear Category Mappings',
      'This will reset all learned category preferences. Events will need to be re-categorized.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            dispatch(clearStoredMappings());
            Alert.alert('Done', 'Category mappings cleared.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* User Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {userName?.charAt(0)?.toUpperCase() ?? userEmail?.charAt(0)?.toUpperCase() ?? '?'}
                </Text>
              </View>
              <View style={styles.userDetails}>
                {userName && (
                  <Text style={styles.userName}>{userName}</Text>
                )}
                <Text style={styles.userEmail}>{userEmail ?? 'Not signed in'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleClearMappings}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemIcon}>🗑️</Text>
                <View>
                  <Text style={styles.menuItemTitle}>Clear Category Mappings</Text>
                  <Text style={styles.menuItemSubtitle}>
                    Reset learned category preferences
                  </Text>
                </View>
              </View>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <View style={styles.aboutItem}>
              <Text style={styles.aboutLabel}>App Name</Text>
              <Text style={styles.aboutValue}>Get Your Life Right</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.aboutItem}>
              <Text style={styles.aboutLabel}>Version</Text>
              <Text style={styles.aboutValue}>1.0.0</Text>
            </View>
          </View>
        </View>

        {/* Sign Out Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Your calendar data is stored locally and synced with Google Calendar.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.bgPrimary,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  menuItemArrow: {
    fontSize: 20,
    color: colors.textMuted,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  aboutLabel: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  aboutValue: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 16,
  },
  signOutButton: {
    backgroundColor: colors.error + '20',
    borderWidth: 2,
    borderColor: colors.error,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  signOutButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.error,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footer: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
  },
});
