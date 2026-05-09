import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withRepeat,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';
import { useWorkoutStore } from '../store/useWorkoutStore';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface Props {
  visible: boolean;
  streak: number;
  onComplete: () => void;
}

export function StreakCelebration({ visible, streak, onComplete }: Props) {
  const { theme } = useTheme();
  const { language } = useWorkoutStore();
  const styles = createStyles(theme);

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const flameScale = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      // Haptic burst
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      scale.value = 0;
      opacity.value = 1;

      // Pop in
      scale.value = withSpring(1, { damping: 12, stiffness: 90 }, () => {
        // Pulse the flame
        flameScale.value = withRepeat(
          withSequence(
            withTiming(1.2, { duration: 300 }),
            withTiming(1, { duration: 300 })
          ),
          3, // pulse 3 times
          true
        );
      });

      // Fade out and close after 2.5 seconds
      opacity.value = withDelay(
        2500,
        withTiming(0, { duration: 400 }, (finished) => {
          if (finished) {
            runOnJS(onComplete)();
          }
        })
      );
    }
  }, [visible]);

  if (!visible) return null;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const flameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
  }));

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <Animated.Text style={[styles.flame, flameStyle]}>🔥</Animated.Text>
          <Text style={styles.title}>
            {language === 'en' ? 'Streak Increased!' : 'Série Augmentée !'}
          </Text>
          <Text style={styles.subtitle}>
            {language === 'en' ? `${streak} Days Strong` : `${streak} Jours Consécutifs`}
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: theme.card,
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    width: width * 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  flame: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.primary,
    textAlign: 'center',
  },
});
