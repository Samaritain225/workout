import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { EquipmentType } from '../types';

export default function OnboardingScreen() {
  const { updateProfile, startProgram, language } = useWorkoutStore();
  const [step, setStep] = useState(1);
  const [equipment, setEquipment] = useState<EquipmentType[]>(['none']);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      updateProfile({ equipment });
      startProgram();
      router.replace('/(tabs)');
    }
  };

  const toggleEquipment = (type: EquipmentType) => {
    if (type === 'none') {
      setEquipment(['none']);
      return;
    }
    
    setEquipment(prev => {
      const withoutNone = prev.filter(e => e !== 'none');
      if (withoutNone.includes(type)) {
        const removed = withoutNone.filter(e => e !== type);
        return removed.length === 0 ? ['none'] : removed;
      }
      return [...withoutNone, type];
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Progress Dots */}
      <View style={styles.progressContainer}>
        {[1, 2, 3].map(i => (
          <View key={i} style={[styles.progressDot, step >= i && styles.progressDotActive]} />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <View style={styles.content}>
            <Text style={styles.emoji}>🚀</Text>
            <Text style={styles.title}>Welcome to Workout Tracker</Text>
            <Text style={styles.description}>
              Your personalised home workout program. 15 minutes, morning and night.
            </Text>
          </View>
        )}

        {step === 2 && (
          <View style={styles.content}>
            <Text style={styles.emoji}>🏋️</Text>
            <Text style={styles.title}>What equipment do you have?</Text>
            <Text style={styles.description}>
              We'll tailor your program based on what's available to you.
            </Text>
            
            <View style={styles.optionsContainer}>
              <TouchableOpacity 
                style={[styles.optionCard, equipment.includes('none') && styles.optionCardActive]}
                onPress={() => toggleEquipment('none')}
              >
                <Text style={styles.optionEmoji}>🏠</Text>
                <View>
                  <Text style={[styles.optionTitle, equipment.includes('none') && styles.optionTextActive]}>None</Text>
                  <Text style={[styles.optionDesc, equipment.includes('none') && styles.optionTextActive]}>Bodyweight only</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.optionCard, equipment.includes('dumbbells') && styles.optionCardActive]}
                onPress={() => toggleEquipment('dumbbells')}
              >
                <Text style={styles.optionEmoji}>💪</Text>
                <View>
                  <Text style={[styles.optionTitle, equipment.includes('dumbbells') && styles.optionTextActive]}>Dumbbells</Text>
                  <Text style={[styles.optionDesc, equipment.includes('dumbbells') && styles.optionTextActive]}>Include dumbbell variants</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.content}>
            <Text style={styles.emoji}>✅</Text>
            <Text style={styles.title}>Your plan is ready!</Text>
            <Text style={styles.description}>
              Based on your selection, we've generated a perfect program for you.
            </Text>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryText}>Equipment: {equipment.includes('none') ? 'Bodyweight' : equipment.join(', ')}</Text>
              <Text style={styles.summaryText}>Sessions: Morning & Night</Text>
              <Text style={styles.summaryText}>Duration: 15 mins/session</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>{step === 3 ? "Start My Program" : "Continue"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    paddingTop: 60,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#374151',
  },
  progressDotActive: {
    backgroundColor: '#3B82F6',
    width: 24,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  optionsContainer: {
    width: '100%',
    gap: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#374151',
  },
  optionCardActive: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  optionEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  optionTextActive: {
    color: '#3B82F6',
  },
  summaryCard: {
    backgroundColor: '#1F2937',
    padding: 24,
    borderRadius: 16,
    width: '100%',
    gap: 12,
  },
  summaryText: {
    color: '#E5E7EB',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    padding: 30,
    paddingBottom: 50,
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
