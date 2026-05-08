import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EXERCISE_LIBRARY } from '../constants/exercises';
import { Exercise, ExerciseTag } from '../types';
import * as Linking from 'expo-linking';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { t } from '../constants/translations';
import { useTheme } from '../hooks/useTheme';
import { StatusBar } from 'expo-status-bar';

interface ExercisePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
  tag: ExerciseTag;
  currentExerciseId?: string;
}

export function ExercisePicker({ visible, onClose, onSelect, tag, currentExerciseId }: ExercisePickerProps) {
  const { language } = useWorkoutStore();
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme);
  const alternatives = EXERCISE_LIBRARY.filter((ex) => ex.tag === tag);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View style={styles.header}>
          <Text style={styles.title}>{language === 'en' ? `Choose ${tag} exercise` : `Choisir exercice ${tag}`}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>{t('cancel', language)}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {alternatives.map((ex) => (
            <TouchableOpacity
              key={ex.id}
              style={[
                styles.card,
                currentExerciseId === ex.id && styles.cardActive,
              ]}
              onPress={() => onSelect(ex)}
            >
              <Text style={styles.cardTitle}>{ex.name}</Text>
              {ex.instructions && (
                <Text style={styles.cardDesc} numberOfLines={2}>
                  {ex.instructions}
                </Text>
              )}

              <View style={styles.footer}>
                {ex.videoUrl ? (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(ex.videoUrl!)}
                    style={styles.actionBtn}
                  >
                    <Text style={styles.actionText}>📺 {t('watch_video', language)}</Text>
                  </TouchableOpacity>
                ) : <View />}
                <View style={styles.selectBtn}>
                  <Text style={styles.selectText}>{t('select', language)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
  },
  closeBtn: {
    padding: 4,
  },
  closeText: {
    color: theme.accent,
    fontWeight: '600',
  },
  scroll: {
    padding: 16,
  },
  card: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  cardActive: {
    borderColor: theme.accent,
    borderWidth: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: theme.textSecondary,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: theme.inputBg,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 12,
    color: theme.textSecondary,
    fontWeight: '500',
  },
  selectBtn: {
    backgroundColor: theme.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectText: {
    color: theme.primaryContrast,
    fontSize: 13,
    fontWeight: '600',
  },
});
