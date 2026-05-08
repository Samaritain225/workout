import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Polyline, Circle, Line, Text as SvgText } from 'react-native-svg';
import { useWorkoutStore } from '../../store/useWorkoutStore';
import { EXERCISE_LIBRARY } from '../../constants/exercises';
import { useTheme } from '../../hooks/useTheme';
import { t } from '../../constants/translations';
import { router } from 'expo-router';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - 40 - 32;
const CHART_HEIGHT = 120;
const PAD = { top: 12, right: 12, bottom: 28, left: 36 };

const TAG_COLORS: Record<string, string> = {
  upper: '#3B82F6',
  abs: '#22C55E',
  legs: '#F59E0B',
  core: '#A855F7',
};

export default function ProgressScreen() {
  const { getProgressForExercise, getWeeklyCompletionRate, getStreak, logs, language } = useWorkoutStore();
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme);
  
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState('');

  const filteredExercises = EXERCISE_LIBRARY.filter(ex => 
    ex.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedEx = filteredExercises.find((e) => e.id === selectedId) || filteredExercises[0];
  const entries = selectedEx ? getProgressForExercise(selectedEx.id) : [];
  const streak = getStreak();
  const rate = getWeeklyCompletionRate();
  const totalSessions = logs.length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} stickyHeaderIndices={[1]}>
        <View style={styles.pageHeader}>
          <Text style={styles.title}>{t('progress', language)}</Text>
          <TouchableOpacity onPress={() => router.push('/settings')} style={styles.settingsBtn}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <StatCard value={streak} label={t('day_streak', language)} emoji="🔥" />
          <StatCard value={`${rate}%`} label={t('this_week', language)} emoji="📅" />
          <StatCard value={totalSessions} label={t('sessions', language)} emoji="⚡" />
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder={language === 'en' ? "Search exercise..." : "Rechercher exercice..."}
              placeholderTextColor={theme.textMuted}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {selectedEx ? (
          <View style={styles.exCard}>
            <View style={styles.exHeader}>
              <View>
                <Text style={styles.exName}>{selectedEx.name}</Text>
                <Text style={styles.exTag}>{selectedEx.tag}</Text>
              </View>
              {entries.length > 0 && (
                <View style={styles.statBox}>
                  <Text style={styles.exStatLabel}>{t('latest', language)}</Text>
                  <Text style={styles.statVal}>{entries[entries.length - 1].reps}</Text>
                </View>
              )}
            </View>
            {entries.length < 2 ? (
              <View style={styles.emptyChart}>
                <Text style={styles.emptyText}>{t('not_enough_data', language)}</Text>
              </View>
            ) : (
              <ProgressChart entries={entries} color={TAG_COLORS[selectedEx.tag] ?? '#3B82F6'} />
            )}
          </View>
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>{t('no_results', language)}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ProgressChart({ entries, color }: { entries: { date: string; reps: number }[]; color: string }) {
  const w = CHART_WIDTH - PAD.left - PAD.right;
  const h = CHART_HEIGHT - PAD.top - PAD.bottom;
  const maxReps = Math.max(...entries.map((e) => e.reps));
  const minReps = Math.min(...entries.map((e) => e.reps));
  const range = maxReps - minReps || 1;

  const points = entries.map((e, i) => {
    const x = PAD.left + (i / (entries.length - 1)) * w;
    const y = PAD.top + h - ((e.reps - minReps) / range) * h;
    return { x, y };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
      <Polyline points={polylinePoints} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      {points.map((p, i) => <Circle key={i} cx={p.x} cy={p.y} r={4} fill={color} />)}
    </Svg>
  );
}

function StatCard({ value, label, emoji }: { value: string | number; label: string; emoji: string }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.statCard}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.background },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '700', color: theme.text },
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  settingsBtn: { padding: 4 },
  settingsIcon: { fontSize: 22 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: { 
    flex: 1, 
    borderRadius: 14, 
    borderWidth: 1, 
    padding: 12, 
    alignItems: 'center',
    backgroundColor: theme.card,
    borderColor: theme.border,
  },
  statEmoji: { fontSize: 20, marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: '700', color: theme.text },
  statLabel: { fontSize: 10, color: theme.textMuted, fontWeight: '500', marginTop: 2 },
  searchContainer: { backgroundColor: theme.background, paddingBottom: 12, paddingTop: 4 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  searchIcon: { marginRight: 8, fontSize: 16 },
  searchInput: { flex: 1, height: 44, fontSize: 15, color: theme.text },
  exCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  exHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  exName: { fontSize: 16, fontWeight: '700', color: theme.text, marginBottom: 2 },
  exTag: { fontSize: 11, color: theme.accent, fontWeight: '600', textTransform: 'uppercase' },
  statBox: { alignItems: 'flex-end' },
  exStatLabel: { fontSize: 10, color: theme.textMuted, textTransform: 'uppercase', marginBottom: 2 },
  statVal: { fontSize: 20, fontWeight: '800', color: theme.text },
  emptyChart: { alignItems: 'center', paddingVertical: 28 },
  emptyText: { fontSize: 12, color: theme.textMuted, textAlign: 'center', lineHeight: 18, maxWidth: 220 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: theme.text, marginBottom: 8 },
});
