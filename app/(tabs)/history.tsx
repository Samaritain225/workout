import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import { EXERCISE_LIBRARY } from '@/constants/exercises';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/constants/translations';
import { WEEKS } from '@/constants/program';
import { WorkoutLog } from '@/types';
import { router } from 'expo-router';

export default function HistoryScreen() {
  const { logs, undoSession, language } = useWorkoutStore();
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme);

  // Group logs by date descending
  const grouped = groupByDate(logs);
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const handleDelete = (log: WorkoutLog) => {
    Alert.alert(
      'Remove session?',
      `This will remove the ${log.sessionType} session on ${formatDate(log.date)}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => undoSession(log.id) },
      ]
    );
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top, backgroundColor: theme.background }} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          <Text style={styles.title}>{t('history', language)}</Text>
          <TouchableOpacity onPress={() => router.push('/settings')} style={styles.settingsBtn}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {sortedDates.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📖</Text>
            <Text style={styles.emptyTitle}>No sessions yet</Text>
            <Text style={styles.emptySub}>
              Complete your first session and it will appear here.
            </Text>
          </View>
        ) : (
          sortedDates.map((date) => {
            const dayLogs = grouped[date];

            return (
              <View key={date} style={styles.dayGroup}>
                <Text style={styles.dateHeader}>
                  {formatDate(date)}
                </Text>
                {dayLogs.map((log) => (
                  <SessionCard key={log.id} log={log} onDelete={() => handleDelete(log)} theme={theme} />
                ))}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

function SessionCard({ log, onDelete, theme }: { log: WorkoutLog; onDelete: () => void; theme: any }) {
  const styles = createStyles(theme);
  const week = WEEKS.find((w) => w.id === log.weekId);
  const exercises = week
    ? [...week.session.morning, ...week.session.night].filter((e) =>
        log.completedExercises.includes(e.id)
      )
    : [];

  return (
    <View style={styles.logCard}>
      <View style={styles.cardHeader}>
        <View style={styles.sessionInfo}>
          <Text>{log.sessionType === 'morning' ? '☀️' : '🌙'}</Text>
          <Text style={styles.sessionText}>
            {log.sessionType === 'morning' ? 'Morning session' : 'Night session'}
          </Text>
        </View>
        <TouchableOpacity onPress={onDelete} style={styles.undoBtn}>
          <Text style={styles.undoText}>Remove</Text>
        </TouchableOpacity>
      </View>

      {exercises.map((ex) => (
        <View key={ex.id} style={styles.exRow}>
          <Text style={styles.exName}>{ex.name}</Text>
          <Text style={styles.exReps}>✓</Text>
        </View>
      ))}
    </View>
  );
}

function groupByDate(logs: WorkoutLog[]): Record<string, WorkoutLog[]> {
  return logs.reduce((acc, log) => {
    if (!acc[log.date]) acc[log.date] = [];
    acc[log.date].push(log);
    return acc;
  }, {} as Record<string, WorkoutLog[]>);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

const createStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  scroll: { padding: 20, paddingBottom: 40 + 80 },
  title: { fontSize: 26, fontWeight: '700', color: theme.text },
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  settingsBtn: { padding: 4 },
  settingsIcon: { fontSize: 22 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: theme.text, marginBottom: 8 },
  emptySub: { fontSize: 14, color: theme.textSecondary, textAlign: 'center' },
  dayGroup: { marginBottom: 24 },
  dateHeader: { fontSize: 12, fontWeight: '700', color: theme.textMuted, textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1 },
  logCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sessionInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sessionText: { fontSize: 15, fontWeight: '600', color: theme.text },
  undoBtn: { padding: 4 },
  undoText: { color: theme.danger, fontSize: 12, fontWeight: '500' },
  exRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  exName: { fontSize: 13, color: theme.textSecondary, flex: 1 },
  exReps: { fontSize: 13, fontWeight: '600', color: theme.text  },
});

