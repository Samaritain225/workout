import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  Linking,
  Platform,
  Image,
} from 'react-native';
import { Exercise } from '../types';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { t } from '../constants/translations';
import { useTheme } from '../hooks/useTheme';

interface Props {
  visible: boolean;
  exercise: Exercise | null;
  onClose: () => void;
}

export function ExerciseDetailsModal({ visible, exercise, onClose }: Props) {
  const { language } = useWorkoutStore();
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme, isDark);

  if (!exercise) return null;

  const handleWatchDemo = async () => {
    if (exercise.videoUrl) {
      const supported = await Linking.canOpenURL(exercise.videoUrl);
      if (supported) {
        await Linking.openURL(exercise.videoUrl);
      }
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Tap background to close */}
        <Pressable style={styles.backgroundPress} onPress={onClose} />
        
        <View style={styles.sheet}>
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>
          
          <Text style={styles.title}>{exercise.name}</Text>
          
          <View style={styles.tagsRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{exercise.tag.toUpperCase()}</Text>
            </View>
            <View style={[styles.tag, styles.tagNeutral]}>
              <Text style={[styles.tagText, styles.tagNeutralText]}>{exercise.equipment?.join(', ') || 'none'}</Text>
            </View>
          </View>

          {exercise.thumbnail && (
            <Image 
              source={exercise.thumbnail} 
              style={styles.thumbnail} 
              resizeMode="cover"
            />
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{language === 'en' ? 'Instructions' : 'Instructions'}</Text>
            <Text style={styles.instructions}>
              {exercise.instructions?.[language as 'en' | 'fr'] || (language === 'en' ? 'No instructions provided.' : 'Aucune instruction fournie.')}
            </Text>
          </View>

          {!!exercise.videoUrl && (
            <TouchableOpacity style={styles.videoBtn} onPress={handleWatchDemo}>
              <Text style={styles.videoBtnIcon}>▶</Text>
              <Text style={styles.videoBtnText}>{language === 'en' ? 'Watch Demo' : 'Voir la Démo'}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>{t('cancel', language)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (theme: any, isDark: boolean) => StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  backgroundPress: {
    flex: 1,
  },
  sheet: {
    backgroundColor: theme.card,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  dragHandleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: theme.border,
    borderRadius: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.text,
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    backgroundColor: isDark ? '#374151' : '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.text,
  },
  tagNeutral: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.border,
  },
  tagNeutralText: {
    color: theme.textSecondary,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 24,
  },
  section: {
    backgroundColor: theme.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 8,
  },
  instructions: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 22,
  },
  videoBtn: {
    backgroundColor: theme.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 8,
  },
  videoBtnIcon: {
    fontSize: 16,
    color: theme.primaryContrast,
  },
  videoBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.primaryContrast,
  },
  closeBtn: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textSecondary,
  },
});
