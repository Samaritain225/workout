import { Tabs } from 'expo-router';
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
  const { language } = useWorkoutStore();
  const { theme } = useTheme();

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
          height: 65,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
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
    fontSize: 22,
    opacity: 0.4,
  },
  iconFocused: {
    opacity: 1,
  },
});
