import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import { Exercise } from '../types';
import { Timer } from './Timer';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { t } from '../constants/translations';
import { useTheme } from '../hooks/useTheme';
import { COLORS } from '../constants/theme';
import * as Haptics from 'expo-haptics';

const createTagColors = (theme: any) => ({
  upper: { bg: theme === COLORS.dark ? '#1E3A8A' : '#DBEAFE', text: theme === COLORS.dark ? '#BFDBFE' : '#1D4ED8' },
  abs:   { bg: theme === COLORS.dark ? '#064E3B' : '#D1FAE5', text: theme === COLORS.dark ? '#6EE7B7' : '#065F46' },
  legs:  { bg: theme === COLORS.dark ? '#78350F' : '#FEF3C7', text: theme === COLORS.dark ? '#FCD34D' : '#92400E' },
  core:  { bg: theme === COLORS.dark ? '#4C1D95' : '#EDE9FE', text: theme === COLORS.dark ? '#C4B5FD' : '#5B21B6' },
});

interface Props {
  exercise: Exercise;
  currentReps: number;
  done: boolean;
  onToggle: () => void;
  onUpdateReps: (reps: number) => void;
  onSwap?: () => void;
  disabled?: boolean;
}

export function ExerciseRow({ exercise, currentReps, done, onToggle, onUpdateReps, onSwap, disabled }: Props) {
  const { language } = useWorkoutStore();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const tagColors = createTagColors(theme);
  
  const [editOpen, setEditOpen] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);
  const [editValue, setEditValue] = useState(String(currentReps));
  const tagColor = tagColors[exercise.tag as keyof typeof tagColors] ?? tagColors.core;

  const isTimed = exercise.unit.toLowerCase().includes('sec') || exercise.unit.toLowerCase().includes('min');

  const swipeableRef = useRef<React.ElementRef<typeof ReanimatedSwipeable>>(null);

  const handleSaveReps = () => {
    const parsed = parseInt(editValue, 10);
    if (!isNaN(parsed) && parsed > 0) {
      onUpdateReps(parsed);
    }
    setEditOpen(false);
  };

  const handleSwipeOpen = () => {
    if (!onSwap) return;

    Alert.alert(
      t('replace_exercise', language),
      t('replace_desc', language),
      [
        {
          text: t('cancel', language),
          style: 'cancel',
          onPress: () => swipeableRef.current?.close(),
        },
        {
          text: t('select', language),
          onPress: () => {
            onSwap();
            swipeableRef.current?.close();
          },
        },
      ]
    );
  };

  const renderRightActions = () => {
    if (!onSwap || done) return null;
    return (
      <View style={styles.swipeAction}>
        <Text style={styles.swipeActionText}>{t('select', language)} 🔁</Text>
      </View>
    );
  };

  return (
    <>
      <ReanimatedSwipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        onSwipeableWillOpen={handleSwipeOpen}
        friction={2}
        rightThreshold={40}
        overshootRight={false}
      >
        <View style={[
          styles.row, 
          done && styles.rowDone,
          timerOpen && styles.rowTimerOpen
        ]}>
          <TouchableOpacity
            onPress={() => {
              if (!done) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              } else {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              onToggle();
            }}
            disabled={disabled}
            style={[styles.checkbox, done && styles.checkboxDone]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {done && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>

          <View style={styles.info}>
            <View style={styles.nameRow}>
              <Text style={[styles.name, done && styles.nameDone]}>{exercise.name}</Text>
              {exercise.isNew && (
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>new</Text>
                </View>
              )}
              <View style={[styles.tagBadge, { backgroundColor: tagColor.bg }]}>
                <Text style={[styles.tagText, { color: tagColor.text }]}>{exercise.tag}</Text>
              </View>
            </View>
            {exercise.sub && (
              <Text style={styles.sub}>{exercise.sub}</Text>
            )}
          </View>

          <TouchableOpacity 
            onPress={() => { 
              if (isTimed && !done) {
                setTimerOpen(!timerOpen);
              } else {
                setEditValue(String(currentReps)); 
                setEditOpen(true); 
              }
            }} 
            style={styles.repsBtn}
          >
            <View style={styles.repsContent}>
              <Text style={[styles.repsNum, done && styles.repsDone]}>{currentReps}</Text>
              <Text style={styles.unit}>{exercise.unit}</Text>
              {exercise.delta && <Text style={styles.delta}>{exercise.delta}</Text>}
            </View>
            {onSwap && !done && (
              <View style={styles.dragHandle}>
                <View style={styles.dragDot} />
                <View style={styles.dragDot} />
                <View style={styles.dragDot} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {timerOpen && !done && (
          <Timer 
            initialSeconds={currentReps} 
            onComplete={(val) => {
              if (val > 0) onUpdateReps(val);
            }} 
          />
        )}
      </ReanimatedSwipeable>

      <Modal visible={editOpen} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setEditOpen(false)}>
          <Pressable style={styles.modal} onPress={() => {}}>
            <Text style={styles.modalTitle}>{t('update_reps', language)}</Text>
            <Text style={styles.modalSub}>{exercise.name}</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={editValue}
              onChangeText={setEditValue}
              autoFocus
              selectTextOnFocus
              placeholderTextColor={theme.textMuted}
            />
            <Text style={styles.inputHint}>{exercise.unit}</Text>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditOpen(false)}>
                <Text style={styles.cancelText}>{t('cancel', language)}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveReps}>
                <Text style={styles.saveText}>{t('save', language)}</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.card,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  rowDone: {
    opacity: 0.6,
    backgroundColor: theme.background,
  },
  rowTimerOpen: {
    marginBottom: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.borderStrong,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxDone: {
    backgroundColor: theme.success,
    borderColor: theme.success,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.text,
  },
  nameDone: {
    textDecorationLine: 'line-through',
    color: theme.textSecondary,
  },
  sub: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  tagBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  newBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newBadgeText: {
    fontSize: 10,
    color: '#EF4444',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  repsBtn: {
    paddingLeft: 12,
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 12,
  },
  repsContent: {
    alignItems: 'flex-end',
  },
  dragHandle: {
    gap: 3,
    paddingVertical: 4,
  },
  dragDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: theme.textMuted,
    opacity: 0.5,
  },
  repsNum: { fontSize: 20, fontWeight: '800', color: theme.text, lineHeight: 22 },
  repsDone: {
    color: theme.textSecondary,
  },
  unit: { fontSize: 10, color: theme.textSecondary, marginTop: 1, textTransform: 'lowercase' },
  delta: {
    fontSize: 10,
    color: theme.success,
    fontWeight: '700',
    marginBottom: -2,
  },
  // Modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: theme.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: theme.inputBg,
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    fontWeight: '800',
    color: theme.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  inputHint: {
    fontSize: 12,
    color: theme.textMuted,
    marginBottom: 24,
  },
  modalBtns: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    color: theme.textSecondary,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: theme.primary,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 15,
    color: theme.primaryContrast,
    fontWeight: '600',
  },
  swipeAction: {
    backgroundColor: theme.accent,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    borderRadius: 14,
    marginBottom: 8,
    flex: 1,
  },
  swipeActionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
