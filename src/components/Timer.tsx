import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { COLORS } from '@/constants/theme';

interface TimerProps {
  initialSeconds: number;
  onComplete: (finalSeconds: number) => void;
}

export function Timer({ initialSeconds, onComplete }: TimerProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const handleStartStop = () => {
    if (isActive) {
      onComplete(seconds);
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setSeconds(0);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.displayRow}>
        <Text style={[styles.timerText, isActive && styles.timerTextActive]}>
          {formatTime(seconds)}
        </Text>
        <Text style={styles.targetText}>/ {initialSeconds}s</Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity 
          onPress={handleStartStop} 
          style={[styles.btn, isActive ? styles.stopBtn : styles.startBtn]}
        >
          <Text style={styles.btnText}>{isActive ? 'Stop' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
          <Text style={styles.resetBtnText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme === COLORS.light ? '#F9FAFB' : '#111827',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: -8,
    marginBottom: 8,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: theme === COLORS.light ? '#F3F4F6' : '#1F2937',
  },
  displayRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 14,
  },
  timerText: {
    fontSize: 28,
    fontWeight: '700',
    color: theme === COLORS.light ? '#111827' : '#FFFFFF',
  },
  timerTextActive: {
    color: '#3B82F6',
  },
  targetText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    flex: 2,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startBtn: {
    backgroundColor: theme === COLORS.light ? '#111827' : '#3B82F6',
  },
  stopBtn: {
    backgroundColor: '#EF4444',
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: theme === COLORS.light ? '#FFFFFF' : '#1F2937',
    borderWidth: 1,
    borderColor: theme === COLORS.light ? '#E5E7EB' : '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  resetBtnText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '500',
  },
});
