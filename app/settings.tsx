import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { t } from '../constants/translations';
import { useTheme } from '../hooks/useTheme';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants/theme';
import { router, Stack } from 'expo-router';
import { EquipmentType } from '../types';

export default function SettingsScreen() {
  const { language, setLanguage, userProfile, updateProfile, themeMode, setThemeMode, resetAll } = useWorkoutStore();
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme);
  
  const [height, setHeight] = useState(userProfile.height?.toString() || '');
  const [weight, setWeight] = useState(userProfile.weight?.toString() || '');
  const [age, setAge] = useState(userProfile.age?.toString() || '');

  const handleSaveProfile = () => {
    updateProfile({
      height: parseFloat(height) || undefined,
      weight: parseFloat(weight) || undefined,
      age: parseInt(age) || undefined,
    });
    Alert.alert(language === 'en' ? 'Success' : 'Succès', language === 'en' ? 'Profile updated' : 'Profil mis à jour');
  };

  const calculateBMI = () => {
    if (!userProfile.height || !userProfile.weight) return null;
    const h = userProfile.height / 100;
    const bmi = userProfile.weight / (h * h);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return language === 'en' ? 'Underweight' : 'Sous-poids';
    if (bmi < 25) return language === 'en' ? 'Normal weight' : 'Poids normal';
    if (bmi < 30) return language === 'en' ? 'Overweight' : 'Surpoids';
    return language === 'en' ? 'Obese' : 'Obèse';
  };

  const bmi = calculateBMI();

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ 
        headerShown: true, 
        title: t('settings', language),
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        headerShadowVisible: false
      }} />
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile', language)}</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('height', language)} (cm)</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={height}
              onChangeText={setHeight}
              placeholder="175"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('weight', language)} (kg)</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={weight}
              onChangeText={setWeight}
              placeholder="70"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('age', language)}</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={age}
              onChangeText={setAge}
              placeholder="25"
            />
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
            <Text style={styles.saveBtnText}>{t('save', language)}</Text>
          </TouchableOpacity>
        </View>

        {/* Body Insights */}
        {bmi && (
          <View style={[styles.section, styles.insightSection]}>
            <Text style={styles.sectionTitle}>Body Insights</Text>
            <View style={styles.bmiCard}>
              <View>
                <Text style={styles.bmiLabel}>Your BMI</Text>
                <Text style={styles.bmiValue}>{bmi}</Text>
              </View>
              <View style={styles.bmiCatBox}>
                <Text style={styles.bmiCatText}>{getBMICategory(parseFloat(bmi))}</Text>
              </View>
            </View>
            <Text style={styles.insightNote}>
              {language === 'en' 
                ? "This is a general indicator. Muscle mass can affect BMI accuracy for athletes."
                : "Ceci est un indicateur général. La masse musculaire peut affecter la précision de l'IMC pour les athlètes."}
            </Text>
          </View>
        )}

        {/* Equipment Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{language === 'en' ? 'Equipment' : 'Équipement'}</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity 
              style={[styles.toggleBtn, (userProfile.equipment || ['none']).includes('none') && styles.toggleBtnActive]}
              onPress={() => updateProfile({ equipment: ['none'] })}
            >
              <Text style={[styles.toggleText, (userProfile.equipment || ['none']).includes('none') && styles.toggleTextActive]}>
                {language === 'en' ? 'None' : 'Aucun'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleBtn, (userProfile.equipment || []).includes('dumbbells') && styles.toggleBtnActive]}
              onPress={() => {
                let current = userProfile.equipment || (['none'] as EquipmentType[]);
                const withoutNone = current.filter(e => e !== 'none');
                let newEq: EquipmentType[];
                if (withoutNone.includes('dumbbells')) {
                  const removed = withoutNone.filter(e => e !== 'dumbbells');
                  newEq = removed.length === 0 ? ['none'] : removed;
                } else {
                  newEq = [...withoutNone, 'dumbbells'];
                }
                updateProfile({ equipment: newEq });
              }}
            >
              <Text style={[styles.toggleText, (userProfile.equipment || []).includes('dumbbells') && styles.toggleTextActive]}>
                {language === 'en' ? 'Dumbbells' : 'Haltères'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('language', language)}</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity 
              style={[styles.toggleBtn, language === 'en' && styles.toggleBtnActive]}
              onPress={() => setLanguage('en')}
            >
              <Text style={[styles.toggleText, language === 'en' && styles.toggleTextActive]}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleBtn, language === 'fr' && styles.toggleBtnActive]}
              onPress={() => setLanguage('fr')}
            >
              <Text style={[styles.toggleText, language === 'fr' && styles.toggleTextActive]}>Français</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{language === 'en' ? 'Appearance' : 'Apparence'}</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity 
              style={[styles.toggleBtn, themeMode === 'light' && styles.toggleBtnActive]}
              onPress={() => setThemeMode('light')}
            >
              <Text style={[styles.toggleText, themeMode === 'light' && styles.toggleTextActive]}>
                {language === 'en' ? 'Light' : 'Clair'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleBtn, themeMode === 'dark' && styles.toggleBtnActive]}
              onPress={() => setThemeMode('dark')}
            >
              <Text style={[styles.toggleText, themeMode === 'dark' && styles.toggleTextActive]}>
                {language === 'en' ? 'Dark' : 'Sombre'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleBtn, themeMode === 'system' && styles.toggleBtnActive]}
              onPress={() => setThemeMode('system')}
            >
              <Text style={[styles.toggleText, themeMode === 'system' && styles.toggleTextActive]}>
                {language === 'en' ? 'Auto' : 'Auto'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reset Section */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.resetBtn} onPress={() => {
            Alert.alert(
              language === 'en' ? 'Reset All Data' : 'Réinitialiser toutes les données',
              language === 'en' ? 'Are you sure? This cannot be undone.' : 'Êtes-vous sûr ? Cela ne peut pas être annulé.',
              [
                { text: t('cancel', language), style: 'cancel' },
                { text: language === 'en' ? 'Reset' : 'Réinitialiser', style: 'destructive', onPress: resetAll }
              ]
            );
          }}>
            <Text style={styles.resetText}>
              {language === 'en' ? 'Reset Progress' : 'Réinitialiser la progression'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.version}>Workout App v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.background },
  scroll: { padding: 20 },
  title: { fontSize: 28, fontWeight: '700', color: theme.text, marginBottom: 24 },
  section: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.border,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 16 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, color: theme.textSecondary, marginBottom: 6 },
  input: {
    backgroundColor: theme.inputBg,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: theme.text,
    borderWidth: 1,
    borderColor: theme.borderStrong,
  },
  saveBtn: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: { color: theme.primaryContrast, fontWeight: '600', fontSize: 15 },
  // Insights
  insightSection: { 
    backgroundColor: theme === COLORS.light ? '#F0F9FF' : '#082F49', 
    borderColor: theme === COLORS.light ? '#BAE6FD' : '#075985' 
  },
  bmiCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  bmiLabel: { fontSize: 12, color: theme.accent },
  bmiValue: { fontSize: 32, fontWeight: '800', color: theme.text },
  bmiCatBox: { backgroundColor: theme.accent, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  bmiCatText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  insightNote: { fontSize: 11, color: theme.textSecondary, fontStyle: 'italic', lineHeight: 16 },
  // Toggles
  toggleRow: { flexDirection: 'row', gap: 10 },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.borderStrong,
    backgroundColor: theme.card,
    alignItems: 'center',
  },
  toggleBtnActive: { backgroundColor: theme.primary, borderColor: theme.primary },
  toggleText: { fontSize: 14, fontWeight: '500', color: theme.textSecondary },
  toggleTextActive: { color: theme.primaryContrast },
  // Footer
  footer: { alignItems: 'center', marginTop: 12, paddingBottom: 40 },
  resetBtn: { padding: 12 },
  resetText: { color: theme.danger, fontSize: 14, fontWeight: '500' },
  version: { fontSize: 12, color: theme.textMuted, marginTop: 8 },
});
