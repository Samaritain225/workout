import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import Svg, { Polyline, Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import { EXERCISE_LIBRARY } from '@/constants/exercises';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/constants/translations';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - 40 - 32;
const CHART_HEIGHT = 160;
const PAD = { top: 20, right: 12, bottom: 20, left: 12 };

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
  const [selectedId, setSelectedId] = useState(EXERCISE_LIBRARY[0].id);

  const filteredExercises = EXERCISE_LIBRARY.filter(ex => 
    ex.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedEx = EXERCISE_LIBRARY.find((e) => e.id === selectedId) || EXERCISE_LIBRARY[0];
  const entries = selectedEx ? getProgressForExercise(selectedEx.id) : [];
  const streak = getStreak();
  const rate = getWeeklyCompletionRate();
  const totalSessions = logs.length;

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top, backgroundColor: theme.background }} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(600).delay(100).springify()}>
          <View style={styles.pageHeader}>
            <Text style={styles.title}>{t('progress', language)}</Text>
            <TouchableOpacity onPress={() => router.push('/settings')} style={styles.settingsBtn}>
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(200).springify()}>
          <View style={styles.statsRow}>
            <StatCard value={streak} label={t('day_streak', language)} emoji="🔥" color="#F59E0B" />
            <StatCard value={`${rate}%`} label={t('this_week', language)} emoji="📅" color="#3B82F6" />
            <StatCard value={totalSessions} label={t('sessions', language)} emoji="⚡" color="#22C55E" />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(300).springify()}>
          <View style={styles.exCard}>
            <View style={styles.exHeader}>
              <View>
                <Text style={styles.exTag}>{selectedEx.tag}</Text>
                <Text style={styles.exName}>{selectedEx.name}</Text>
              </View>
              {entries.length > 0 && (
                <View style={styles.statBox}>
                  <Text style={styles.statVal}>{entries[entries.length - 1].reps}</Text>
                  <Text style={styles.exStatLabel}>{selectedEx.unit}</Text>
                </View>
              )}
            </View>
            
            {entries.length < 2 ? (
              <View style={styles.emptyChart}>
                <Text style={styles.emptyText}>{t('not_enough_data', language)}</Text>
              </View>
            ) : (
              <ProgressChart 
                entries={entries} 
                color={TAG_COLORS[selectedEx.tag] ?? '#3B82F6'} 
                isDark={isDark}
              />
            )}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(400).springify()}>
          <View style={styles.searchContainer}>
            <View style={styles.searchBox}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder={language === 'en' ? "Filter exercises..." : "Filtrer exercices..."}
                placeholderTextColor={theme.textMuted}
                value={search}
                onChangeText={setSearch}
              />
            </View>
          </View>
        </Animated.View>

        <View style={styles.exerciseList}>
          {filteredExercises.map((ex, i) => (
            <Animated.View key={ex.id} entering={FadeInRight.delay(500 + i * 50).duration(400)}>
              <TouchableOpacity 
                style={[
                  styles.exerciseItem, 
                  selectedId === ex.id && styles.exerciseItemSelected,
                  { borderLeftColor: TAG_COLORS[ex.tag] }
                ]}
                onPress={() => setSelectedId(ex.id)}
              >
                <View style={styles.exItemInfo}>
                  <Text style={[styles.exItemName, selectedId === ex.id && styles.exItemTextSelected]}>
                    {ex.name}
                  </Text>
                  <Text style={styles.exItemTag}>{ex.tag}</Text>
                </View>
                <Text style={styles.exItemArrow}>→</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
          
          {filteredExercises.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyTitle}>{t('no_results', language)}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function ProgressChart({ entries, color, isDark }: { entries: { date: string; reps: number }[]; color: string; isDark: boolean }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  const w = CHART_WIDTH - PAD.left - PAD.right;
  const h = CHART_HEIGHT - PAD.top - PAD.bottom;
  
  const allReps = entries.map((e) => e.reps);
  const maxReps = Math.max(...allReps);
  const minReps = Math.min(...allReps);
  const range = maxReps - minReps || 1;

  // Add 10% padding to range
  const yMin = Math.max(0, minReps - range * 0.1);
  const yMax = maxReps + range * 0.1;
  const yRange = yMax - yMin;

  const points = entries.map((e, i) => {
    const x = PAD.left + (i / (entries.length - 1)) * w;
    const y = PAD.top + h - ((e.reps - yMin) / yRange) * h;
    return { x, y };
  });

  const linePath = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x},${CHART_HEIGHT - PAD.bottom} L${points[0].x},${CHART_HEIGHT - PAD.bottom} Z`;

  return (
    <View style={styles.chartWrapper}>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.2" />
            <Stop offset="1" stopColor={color} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        
        {/* Horizontal grid lines */}
        {[0, 0.5, 1].map((p) => (
          <Path
            key={p}
            d={`M${PAD.left},${PAD.top + h * p} L${PAD.left + w},${PAD.top + h * p}`}
            stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
            strokeWidth="1"
          />
        ))}

        <Path d={areaPath} fill="url(#grad)" />
        <Path d={linePath} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        
        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={4} fill={isDark ? '#1E293B' : '#FFFFFF'} stroke={color} strokeWidth={2} />
        ))}
      </Svg>
    </View>
  );
}

function StatCard({ value, label, emoji, color }: { value: string | number; label: string; emoji: string; color: string }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconBg, { backgroundColor: color + '15' }]}>
        <Text style={styles.statEmoji}>{emoji}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  scroll: { padding: 20, paddingBottom: 100 },
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '800', color: theme.text },
  settingsBtn: { padding: 8, borderRadius: 12, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border },
  settingsIcon: { fontSize: 20 },
  
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { 
    flex: 1, 
    borderRadius: 20, 
    borderWidth: 1, 
    padding: 16, 
    alignItems: 'center',
    backgroundColor: theme.card,
    borderColor: theme.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconBg: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statEmoji: { fontSize: 20 },
  statValue: { fontSize: 20, fontWeight: '800', color: theme.text },
  statLabel: { fontSize: 10, color: theme.textSecondary, fontWeight: '600', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  
  exCard: {
    backgroundColor: theme.card,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  exHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  exTag: { fontSize: 11, color: theme.accent, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  exName: { fontSize: 20, fontWeight: '800', color: theme.text },
  statBox: { alignItems: 'flex-end', backgroundColor: theme.inputBg, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  exStatLabel: { fontSize: 10, color: theme.textMuted, textTransform: 'uppercase', fontWeight: '700' },
  statVal: { fontSize: 22, fontWeight: '900', color: theme.text },
  
  chartWrapper: { alignItems: 'center', justifyContent: 'center' },
  emptyChart: { height: 160, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 13, color: theme.textMuted, textAlign: 'center', lineHeight: 20, maxWidth: 240 },
  
  searchContainer: { marginBottom: 16 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1,
    borderColor: theme.border,
  },
  searchIcon: { marginRight: 10, fontSize: 18 },
  searchInput: { flex: 1, fontSize: 15, color: theme.text, fontWeight: '500' },
  
  exerciseList: { gap: 10 },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.card,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
    borderLeftWidth: 4,
  },
  exerciseItemSelected: {
    backgroundColor: theme.inputBg,
    borderColor: theme.accent,
  },
  exItemInfo: { flex: 1 },
  exItemName: { fontSize: 15, fontWeight: '600', color: theme.text },
  exItemTextSelected: { color: theme.accent },
  exItemTag: { fontSize: 10, color: theme.textMuted, textTransform: 'uppercase', marginTop: 2, fontWeight: '600' },
  exItemArrow: { fontSize: 16, color: theme.textMuted },
  
  empty: { paddingVertical: 40, alignItems: 'center' },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: theme.textMuted },
});
