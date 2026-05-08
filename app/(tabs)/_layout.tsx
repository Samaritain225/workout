import { Tabs, router } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { t } from '../../constants/translations';
import { useWorkoutStore } from '../../store/useWorkoutStore';
import { useTheme } from '../../hooks/useTheme';

interface TabIconProps {
  focused: boolean;
  icon: string;
}

function TabIcon({ focused, icon }: TabIconProps) {
  const { theme } = useTheme();
  return (
    <View style={styles.iconWrap}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>{icon}</Text>
    </View>
  );
}

export default function TabLayout() {
  const { language, startDate } = useWorkoutStore();
  const { theme } = useTheme();

  useEffect(() => {
    if (!startDate) {
      router.replace('/onboarding');
    }
  }, [startDate]);

  if (!startDate) return null;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        lazy: false,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          height: 80,
          paddingBottom: 24,
          paddingTop: 12,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: t('today', language),
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="⚡" />
          ),
        }}
      />
      <Tabs.Screen
        name="program"
        options={{
          tabBarLabel: t('program', language),
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="📋" />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          tabBarLabel: t('progress', language),
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="📈" />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarLabel: t('history', language),
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="🗓" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 26,
    opacity: 0.4,
    marginBottom: 4,
  },
  iconFocused: {
    opacity: 1,
  },
});
