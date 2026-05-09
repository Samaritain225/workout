import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useWorkoutStore } from '../../store/useWorkoutStore';
import { ExerciseRow } from '../../components/ExerciseRow';
import { WeekBanner } from '../../components/WeekBanner';
import { getProgramForEquipment } from '../../constants/program';
import { ExercisePicker } from '../../components/ExercisePicker';
import { ExerciseDetailsModal } from '../../components/ExerciseDetailsModal';
import { StreakCelebration } from '../../components/StreakCelebration';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { EXERCISE_LIBRARY } from '../../constants/exercises';
import { SessionType, ExerciseTag, Exercise } from '../../types';
import { t } from '../../constants/translations';
import { useTheme } from '../../hooks/useTheme';
import { StatusBar } from 'expo-status-bar';

export default function TodayScreen() {
  const {
    startDate,
    startProgram,
    getCurrentWeek,
    isSessionDoneToday,
    getTodayLog,
    logSession,
    undoSession,
    setCustomReps,
    getRepsForExercise,
    getStreak,
    getWeeklyCompletionRate,
    customExerciseMap,
    setCustomExercise,
    language,
    userProfile,
  } = useWorkoutStore();

  const { theme, isDark } = useTheme();
  const styles = createStyles(theme);

  const [activeSession, setActiveSession] = useState<SessionType>('morning');
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [pickerOpen, setPickerOpen] = useState(false);
  const [swapTarget, setSwapTarget] = useState<{ slotId: string; tag: ExerciseTag } | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [newStreakCount, setNewStreakCount] = useState(0);
  const [customAddedExercises, setCustomAddedExercises] = useState<Exercise[]>([]);
  const [addingNew, setAddingNew] = useState(false);

  // Determine which session to show based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    setActiveSession(hour < 13 ? 'morning' : 'night');
  }, []);

  const weekUnfiltered = getCurrentWeek();
  const week = getProgramForEquipment([weekUnfiltered], userProfile.equipment || ['none'])[0];
  const rawExercises = week.session[activeSession];
  
  // Resolve exercises (check for swaps)
  const exercises = rawExercises.map(ex => {
    const swappedId = customExerciseMap[ex.id];
    if (swappedId) {
      const libEx = EXERCISE_LIBRARY.find(l => l.id === swappedId);
      if (libEx) {
        return { ...libEx, id: ex.id, originalName: libEx.name }; // Keep slot ID for tracking
      }
    }
    
    // Fallback dictionary for hardcoded program IDs to EXERCISE_LIBRARY IDs
    const fallbackMap: Record<string, string> = {
      'wide-pushup': 'push_ups',
      'pike-pushup': 'push_ups',
      'reg-pushup': 'push_ups',
      'diamond-pushup': 'push_ups',
      'decline-pushup': 'push_ups',
      'squat': 'squats',
      'lunge': 'lunges',
      'leg-raise': 'leg_raises',
      'plank-m': 'plank',
      'plank-n': 'plank',
      'glute-bridge': 'glute_bridges',
      'rev-crunch': 'reverse_crunches',
      'bicycle': 'crunches',
      'bulgarian-split': 'lunges',
      'hollow-hold': 'plank',
      'pull-ups': 'dips',
    };
    
    const finalMatchId = fallbackMap[ex.id];
    const fallbackEx = EXERCISE_LIBRARY.find(l => l.id === finalMatchId);

    if (fallbackEx) {
      return { 
        ...ex, 
        instructions: fallbackEx.instructions, 
        videoUrl: fallbackEx.videoUrl, 
        thumbnail: fallbackEx.thumbnail 
      };
    }

    return ex;
  });

  const finalExercises = [...exercises, ...customAddedExercises];

  const morningDone = isSessionDoneToday('morning');
  const nightDone = isSessionDoneToday('night');
  const sessionDone = isSessionDoneToday(activeSession);
  const streak = getStreak();
  const completionRate = getWeeklyCompletionRate();

  const currentDateFormatted = new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).toUpperCase();

  const handleSwap = (slotId: string, tag: ExerciseTag) => {
    setSwapTarget({ slotId, tag });
    setPickerOpen(true);
  };

  const onSelectExercise = (libEx: Exercise) => {
    if (addingNew) {
      if (finalExercises.some(ex => ex.id === libEx.id)) {
        Alert.alert('Already Added', 'This exercise is already in your session today.', [{ text: 'OK' }]);
      } else {
        setCustomAddedExercises(prev => [...prev, libEx]);
      }
      setPickerOpen(false);
      setAddingNew(false);
    } else if (swapTarget) {
      setCustomExercise(swapTarget.slotId, libEx.id);
      setPickerOpen(false);
      setSwapTarget(null);
    }
  };

  const toggleExercise = (id: string) => {
    if (sessionDone) return;
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleFinish = () => {
    const repsMap: Record<string, number> = {};
    finalExercises.forEach((ex) => {
      repsMap[ex.id] = getRepsForExercise(week.id, ex.id, ex.reps);
    });

    const streakBefore = getStreak();
    logSession(week.id, activeSession, Array.from(checked), repsMap);
    setChecked(new Set());
    setCustomAddedExercises([]);
    const streakAfter = useWorkoutStore.getState().getStreak();

    if (streakAfter > streakBefore) {
      setNewStreakCount(streakAfter);
      setShowStreakCelebration(true);
    } else {
      Alert.alert(
        activeSession === 'morning' ? (language === 'en' ? 'Morning done! 💪' : 'Matin terminé ! 💪') : (language === 'en' ? 'Night session done! 🌙' : 'Séance du soir terminée ! 🌙'),
        activeSession === 'morning' ? (language === 'en' ? 'See you tonight.' : 'À ce soir.') : (language === 'en' ? 'Rest and let your muscles rebuild.' : 'Reposez-vous et laissez vos muscles se reconstruire.'),
        [{ text: 'OK' }]
      );
    }
  };

  const handleUndo = () => {
    const log = getTodayLog(activeSession);
    if (log) {
      Alert.alert(
        language === 'en' ? 'Undo session?' : 'Annuler la séance ?',
        language === 'en' ? 'This will remove your completed session for today.' : 'Cela supprimera votre séance terminée pour aujourd\'hui.',
        [
          { text: t('cancel', language), style: 'cancel' },
          { text: t('undo', language), style: 'destructive', onPress: () => undoSession(log.id) },
        ]
      );
    }
  };

  const allChecked = finalExercises.length > 0 && checked.size === finalExercises.length;
  const someChecked = checked.size > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.dateLabel}>{currentDateFormatted}</Text>
            <Text style={styles.greeting}>{getGreeting(language)}</Text>
            <Text style={styles.weekLabel}>{t('week', language)} {week.id.split('-')[1]}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              onPress={() => router.push('/settings')}
              style={styles.settingsBtn}
            >
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
            <View style={styles.statsRow}>
              <StatChip value={streak} label={t('streak', language)} isStreak />
              <StatChip value={`${completionRate}%`} label={t('completion', language)} />
            </View>
          </View>
        </View>

        {/* Session toggle */}
        <View style={styles.sessionToggle}>
          {(['morning', 'night'] as SessionType[]).map((s) => {
            const done = s === 'morning' ? morningDone : nightDone;
            return (
              <TouchableOpacity
                key={s}
                onPress={() => { setActiveSession(s); setChecked(new Set()); setCustomAddedExercises([]); }}
                style={[styles.sessionBtn, activeSession === s && styles.sessionBtnActive]}
              >
                <Text style={[styles.sessionBtnText, activeSession === s && styles.sessionBtnTextActive]}>
                  {s === 'morning' ? `☀️ ${t('morning', language)}` : `🌙 ${t('night', language)}`}
                </Text>
                {done && <View style={styles.doneDot} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Week banner */}
        <WeekBanner week={week} showDeloadBadge />

        {/* Exercises */}
        {sessionDone ? (
          <View style={styles.doneCard}>
            <Text style={styles.doneEmoji}>✅</Text>
            <Text style={styles.doneTitle}>{language === 'en' ? 'Session complete!' : 'Séance terminée !'}</Text>
            <Text style={styles.doneSub}>
              {activeSession === 'morning'
                ? (language === 'en' ? "Great start. Come back tonight for your night session." : "Bon début. Revenez ce soir pour votre séance nocturne.")
                : (language === 'en' ? "Rest well. Muscles grow while you sleep." : "Reposez-vous bien. Les muscles grandissent pendant que vous dormez.")}
            </Text>
            <TouchableOpacity style={styles.undoBtn} onPress={handleUndo}>
              <Text style={styles.undoBtnText}>{t('undo', language)}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {finalExercises.map((ex) => (
              <ExerciseRow
                key={ex.id}
                exercise={ex}
                currentReps={getRepsForExercise(week.id, ex.id, ex.reps)}
                done={checked.has(ex.id)}
                onToggle={() => toggleExercise(ex.id)}
                onUpdateReps={(reps) => setCustomReps(week.id, ex.id, reps)}
                onSwap={() => handleSwap(ex.id, ex.tag)}
                onShowDetails={() => setSelectedExercise(ex)}
              />
            ))}

            {/* Add Custom Exercise Button */}
            <TouchableOpacity
              style={styles.addExerciseBtn}
              onPress={() => {
                setAddingNew(true);
                setPickerOpen(true);
              }}
            >
              <Text style={styles.addExerciseBtnText}>+ {language === 'en' ? 'Add Exercise' : 'Ajouter Exercice'}</Text>
            </TouchableOpacity>

            {/* Note */}
            <View style={styles.noteBox}>
              <Text style={styles.noteText}>
                <Text style={styles.noteBold}>Tip: </Text>
                {week.session.note}
              </Text>
            </View>

            {/* Finish button */}
            {someChecked && (
              <TouchableOpacity
                style={[styles.finishBtn, !allChecked && styles.finishBtnPartial]}
                onPress={handleFinish}
              >
                <Text style={styles.finishText}>
                  {allChecked ? `${t('complete_session', language)} ✓` : `${language === 'en' ? 'Done for now' : 'Fait pour l\'instant'} (${checked.size}/${finalExercises.length})`}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>

      <ExercisePicker
        visible={pickerOpen}
        onClose={() => { setPickerOpen(false); setAddingNew(false); }}
        onSelect={onSelectExercise}
        tag={addingNew ? undefined : (swapTarget?.tag ?? 'abs')}
        currentExerciseId={swapTarget ? customExerciseMap[swapTarget.slotId] : undefined}
      />
      <ExerciseDetailsModal
        visible={!!selectedExercise}
        exercise={selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />
      <StreakCelebration
        visible={showStreakCelebration}
        streak={newStreakCount}
        onComplete={() => setShowStreakCelebration(false)}
      />
    </SafeAreaView>
  );
}

function StatChip({ value, label, isStreak }: { value: string | number; label: string; isStreak?: boolean }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const pulse = useSharedValue(1);

  React.useEffect(() => {
    if (isStreak && typeof value === 'number' && value > 0) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1, // infinite
        true
      );
    } else {
      pulse.value = withTiming(1);
    }
  }, [isStreak, value]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View style={styles.chip}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        {isStreak && typeof value === 'number' && value > 0 && (
          <Animated.Text style={[animatedStyle, { fontSize: 16 }]}>🔥</Animated.Text>
        )}
        <Text style={styles.chipValue}>{value}</Text>
      </View>
      <Text style={styles.chipLabel}>{label}</Text>
    </View>
  );
}

function getGreeting(lang: string): string {
  const hour = new Date().getHours();
  if (hour < 12) return t('greeting_morning', lang as any);
  if (hour < 18) return t('greeting_afternoon', lang as any);
  return t('greeting_evening', lang as any);
}

const createStyles = (theme: any) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.background },
  scroll: { padding: 20, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  dateLabel: { fontSize: 11, fontWeight: '700', color: theme.textSecondary, letterSpacing: 1, marginBottom: 4 },
  greeting: { fontSize: 22, fontWeight: '700', color: theme.text },
  weekLabel: { fontSize: 13, color: theme.textSecondary, marginTop: 2 },
  headerRight: {
    alignItems: 'flex-end',
    gap: 10,
  },
  settingsBtn: {
    padding: 4,
    marginTop: -4,
  },
  settingsIcon: {
    fontSize: 22,
  },
  statsRow: { flexDirection: 'row', gap: 8 },
  chip: {
    backgroundColor: theme.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  chipValue: { fontSize: 16, fontWeight: '700', color: theme.text },
  chipLabel: { fontSize: 9, color: theme.textSecondary, fontWeight: '500' },
  sessionToggle: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  sessionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.inputBg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  sessionBtnActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  sessionBtnText: { fontSize: 14, fontWeight: '500', color: theme.textSecondary },
  sessionBtnTextActive: { color: theme.primaryContrast },
  doneDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.success,
  },
  doneCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  doneEmoji: { fontSize: 40, marginBottom: 12 },
  doneTitle: { fontSize: 18, fontWeight: '700', color: theme.text, marginBottom: 8 },
  doneSub: { fontSize: 13, color: theme.textSecondary, textAlign: 'center', lineHeight: 19, marginBottom: 20 },
  undoBtn: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8, borderWidth: 1, borderColor: theme.border },
  undoBtnText: { fontSize: 13, color: theme.textMuted },
  noteBox: {
    backgroundColor: theme.inputBg,
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  noteText: { fontSize: 12, color: theme.textSecondary, lineHeight: 18 },
  noteBold: { fontWeight: '600', color: theme.text },
  finishBtn: {
    backgroundColor: theme.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  finishBtnPartial: { backgroundColor: theme.textSecondary },
  finishText: { fontSize: 15, fontWeight: '600', color: theme.primaryContrast },
  addExerciseBtn: {
    backgroundColor: theme.background,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.border,
    borderStyle: 'dashed',
  },
  addExerciseBtnText: {
    color: theme.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
