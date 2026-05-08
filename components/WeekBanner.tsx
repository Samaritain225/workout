import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Week } from '../types';
import { useTheme } from '../hooks/useTheme';
import { COLORS } from '../constants/theme';

const PHASE_COLORS: Record<string, { bg: string; border: string; text: string; label: string }> = {
  blue:   { bg: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8', label: '#60A5FA' },
  green:  { bg: '#F0FDF4', border: '#BBF7D0', text: '#166534', label: '#4ADE80' },
  orange: { bg: '#FFF7ED', border: '#FED7AA', text: '#9A3412', label: '#FB923C' },
  purple: { bg: '#FAF5FF', border: '#E9D5FF', text: '#6B21A8', label: '#C084FC' },
};

interface Props {
  week: Week;
  showDeloadBadge?: boolean;
}

export function WeekBanner({ week, showDeloadBadge = false }: Props) {
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme);
  const colors = PHASE_COLORS[week.phaseColor] ?? PHASE_COLORS.blue;

  return (
    <View style={[styles.banner, { backgroundColor: !isDark ? colors.bg : '#1E3A8A', borderColor: !isDark ? colors.border : '#2563EB' }]}>
      <View style={styles.content}>
        <Text style={[styles.phase, { color: !isDark ? colors.label : '#93C5FD' }]}>{week.phase}</Text>
        <Text style={[styles.title, { color: !isDark ? colors.text : '#DBEAFE' }]}>{week.title}</Text>
        <Text style={[styles.desc, { color: !isDark ? colors.text : '#93C5FD' }]}>{week.desc}</Text>
      </View>
      {showDeloadBadge && week.isDeload && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Deload</Text>
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  banner: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  content: {
    flex: 1,
  },
  phase: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  desc: {
    lineHeight: 17,
    color: theme.textSecondary,
  },
  badge: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.text,
    textTransform: 'uppercase',
  },
});
