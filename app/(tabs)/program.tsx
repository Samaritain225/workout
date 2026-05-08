import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWorkoutStore } from '../../store/useWorkoutStore';
import { WeekBanner } from '../../components/WeekBanner';
import { WEEKS, GOLDEN_RULES, UPGRADES, getProgramForEquipment } from '../../constants/program';
import { SessionType } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { t } from '../../constants/translations';
import { COLORS } from '@/constants/theme';
import { router } from 'expo-router';

export default function ProgramScreen() {
  const { getCurrentWeekIndex, getRepsForExercise, language, userProfile } = useWorkoutStore();
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme);
  const currentWeekIndex = getCurrentWeekIndex();

  const [selectedWeekIndex, setSelectedWeekIndex] = useState(currentWeekIndex);
  const [activeSession, setActiveSession] = useState<SessionType>('morning');

  const week = getProgramForEquipment([WEEKS[selectedWeekIndex]], userProfile.equipment || ['none'])[0];
  const exercises = week.isLongTerm ? [] : week.session[activeSession];
  const isCurrentWeek = selectedWeekIndex === currentWeekIndex;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          <Text style={styles.title}>{t('program', language)}</Text>
          <TouchableOpacity onPress={() => router.push('/settings')} style={styles.settingsBtn}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Week selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.weekScroll}
          contentContainerStyle={styles.weekScrollContent}
        >
          {WEEKS.map((w, i) => {
            const isCurrent = i === currentWeekIndex;
            const isSelected = i === selectedWeekIndex;
            const isPast = i < currentWeekIndex;
            return (
              <TouchableOpacity
                key={w.id}
                onPress={() => setSelectedWeekIndex(i)}
                style={[
                  styles.weekChip,
                  isSelected && styles.weekChipSelected,
                  isPast && !isSelected && styles.weekChipPast,
                ]}
              >
                <Text style={[styles.weekChipText, isSelected && styles.weekChipTextSelected]}>
                  {w.label}
                </Text>
                {isCurrent && <View style={styles.currentDot} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Current week badge */}
        {isCurrentWeek && (
          <View style={styles.currentBadge}>
            <Text style={styles.currentBadgeText}>📍 You are here</Text>
          </View>
        )}

        {/* Week banner */}
        <WeekBanner week={week} showDeloadBadge />

        {/* Long-term view */}
        {week.isLongTerm ? (
          <LongTermView />
        ) : (
          <>
            {/* Session toggle */}
            <View style={styles.sessionToggle}>
              {(['morning', 'night'] as SessionType[]).map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setActiveSession(s)}
                  style={[styles.sessionBtn, activeSession === s && styles.sessionBtnActive]}
                >
                  <Text style={[styles.sessionBtnText, activeSession === s && styles.sessionBtnTextActive]}>
                    {s === 'morning' ? `☀️ ${t('morning', language)}` : `🌙 ${t('night', language)}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Exercise list (read-only) */}
            {exercises.map((ex) => (
              <View key={ex.id} style={styles.exRow}>
                <View style={styles.exInfo}>
                  <View style={styles.exNameRow}>
                    <Text style={styles.exName}>{ex.name}</Text>
                    {ex.isNew && (
                      <View style={styles.newBadge}>
                        <Text style={styles.newBadgeText}>new</Text>
                      </View>
                    )}
                  </View>
                  {ex.sub && <Text style={styles.exSub}>{ex.sub}</Text>}
                </View>
                <View style={styles.exReps}>
                  <Text style={styles.exRepsNum}>
                    {getRepsForExercise(week.id, ex.id, ex.reps)}
                    {ex.delta ? <Text style={styles.delta}> {ex.delta}</Text> : null}
                  </Text>
                  <Text style={styles.exUnit}>{ex.unit}</Text>
                </View>
              </View>
            ))}

            {/* Note */}
            <View style={styles.noteBox}>
              <Text style={styles.noteText}>
                <Text style={styles.noteBold}>Note: </Text>
                {week.session.note}
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function LongTermView() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return (
    <View style={{ gap: 12 }}>
      <View style={styles.ruleCard}>
        <Text style={styles.cardTitle}>The golden progression rule</Text>
        {GOLDEN_RULES.map((rule, i) => (
          <View key={i} style={styles.ruleRow}>
            <Text style={styles.ruleDot}>•</Text>
            <Text style={styles.ruleText}>{rule}</Text>
          </View>
        ))}
      </View>
      <View style={styles.ruleCard}>
        <Text style={styles.cardTitle}>Exercise upgrades when ready</Text>
        {UPGRADES.map((u, i) => (
          <View key={i} style={styles.upgradeRow}>
            <Text style={styles.upgradeName}>{u.name}</Text>
            <Text style={styles.upgradeDesc}>{u.desc}</Text>
          </View>
        ))}
      </View>
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
  weekScroll: { marginBottom: 12, marginHorizontal: -20 },
  weekScrollContent: { paddingHorizontal: 20, gap: 8 },
  weekChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  weekChipSelected: { backgroundColor: theme.primary, borderColor: theme.primary },
  weekChipPast: { backgroundColor: theme.inputBg },
  weekChipText: { fontSize: 13, color: theme.textSecondary, fontWeight: '500' },
  weekChipTextSelected: { color: theme.primaryContrast },
  currentDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.success },
  currentBadge: {
    backgroundColor: theme === COLORS.light ? '#F0FDF4' : '#064E3B',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  currentBadgeText: { fontSize: 12, color: theme.success, fontWeight: '500' },
  sessionToggle: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  sessionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.card,
    alignItems: 'center',
  },
  sessionBtnActive: { backgroundColor: theme.primary, borderColor: theme.primary },
  sessionBtnText: { fontSize: 14, fontWeight: '500', color: theme.textSecondary },
  sessionBtnTextActive: { color: theme.primaryContrast },
  exRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 7,
    borderWidth: 1,
    borderColor: theme.border,
  },
  exInfo: { flex: 1 },
  exNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  exName: { fontSize: 14, fontWeight: '500', color: theme.text },
  exSub: { fontSize: 11, color: theme.textSecondary, marginTop: 2 },
  newBadge: { backgroundColor: '#FEE2E2', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 99 },
  newBadgeText: { fontSize: 9, color: '#EF4444', fontWeight: '600' },
  exReps: { alignItems: 'flex-end' },
  exRepsNum: { fontSize: 19, fontWeight: '600', color: theme.text },
  delta: { fontSize: 11, color: theme.success, fontWeight: '600' },
  exUnit: { fontSize: 10, color: theme.textMuted },
  noteBox: {
    backgroundColor: theme.inputBg,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  noteText: { fontSize: 12, color: theme.textSecondary, lineHeight: 18 },
  noteBold: { fontWeight: '600', color: theme.text },
  ruleCard: {
    backgroundColor: theme.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  cardTitle: { fontSize: 14, fontWeight: '600', color: theme.text, marginBottom: 10 },
  ruleRow: { flexDirection: 'row', gap: 8, marginBottom: 7 },
  ruleDot: { fontSize: 12, color: theme.textMuted, marginTop: 1 },
  ruleText: { fontSize: 13, color: theme.textSecondary, flex: 1, lineHeight: 18 },
  upgradeRow: { marginBottom: 10 },
  upgradeName: { fontSize: 13, fontWeight: '600', color: theme.text },
  upgradeDesc: { fontSize: 12, color: theme.textSecondary, marginTop: 1 },
});
