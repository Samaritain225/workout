import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutLog, SessionType, Language, UserProfile } from '@/types';
import { WEEKS, getWeekIndexFromStartDate } from '@/constants/program';

interface WorkoutStore {
  // Onboarding
  startDate: string | null;
  customReps: Record<string, number>;
  logs: WorkoutLog[];
  morningNotifTime: string | null; // "HH:MM"
  nightNotifTime: string | null;   // "HH:MM"
  customExerciseMap: Record<string, string>; // slotId -> libraryExerciseId
  language: Language;
  userProfile: UserProfile;
  themeMode: 'light' | 'dark' | 'system';

  // --- Computed helpers ---
  getCurrentWeekIndex: () => number;
  getCurrentWeek: () => typeof WEEKS[0];
  getTodayLog: (sessionType: SessionType) => WorkoutLog | null;
  isSessionDoneToday: (sessionType: SessionType) => boolean;
  getStreak: () => number;
  getRepsForExercise: (weekId: string, exerciseId: string, defaultReps: number) => number;
  getProgressForExercise: (exerciseId: string) => { date: string; reps: number }[];
  getWeeklyCompletionRate: () => number;

  // --- Actions ---
  startProgram: () => void;
  logSession: (weekId: string, sessionType: SessionType, completedExercises: string[], repsMap: Record<string, number>) => void;
  undoSession: (logId: string) => void;
  setCustomReps: (weekId: string, exerciseId: string, reps: number) => void;
  setCustomExercise: (slotId: string, libraryId: string) => void;
  setNotifTime: (session: SessionType, time: string | null) => void;
  setLanguage: (lang: Language) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  resetAll: () => void;
}

const todayStr = () => new Date().toISOString().split('T')[0];

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      startDate: null,
      customReps: {},
      logs: [],
      morningNotifTime: null,
      nightNotifTime: null,
      customExerciseMap: {},
      language: 'en',
      userProfile: { equipment: ['none'] },
      themeMode: 'system',

      // --- Computed ---
      getCurrentWeekIndex: () => {
        const { startDate } = get();
        if (!startDate) return 0;
        return getWeekIndexFromStartDate(startDate);
      },

      getCurrentWeek: () => {
        const idx = get().getCurrentWeekIndex();
        return WEEKS[Math.min(idx, WEEKS.length - 1)];
      },

      getTodayLog: (sessionType) => {
        const today = todayStr();
        return get().logs.find(
          (l) => l.date === today && l.sessionType === sessionType
        ) ?? null;
      },

      isSessionDoneToday: (sessionType) => {
        return get().getTodayLog(sessionType) !== null;
      },

      getStreak: () => {
        const { logs } = get();
        if (logs.length === 0) return 0;

        const today = new Date();
        let streak = 0;
        let currentDate = new Date(today);

        // Check if today has at least one session
        const todayLog = logs.find((l) => l.date === todayStr());
        if (!todayLog) {
          // Check yesterday
          currentDate.setDate(currentDate.getDate() - 1);
        }

        while (true) {
          const dateStr = currentDate.toISOString().split('T')[0];
          const hasSession = logs.some((l) => l.date === dateStr);
          if (!hasSession) break;
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        }

        return streak;
      },

      getRepsForExercise: (weekId, exerciseId, defaultReps) => {
        const key = `${weekId}-${exerciseId}`;
        return get().customReps[key] ?? defaultReps;
      },

      getProgressForExercise: (exerciseId) => {
        const { logs } = get();
        const entries: { date: string; reps: number }[] = [];

        logs.forEach((log) => {
          if (log.repsMap && log.repsMap[exerciseId] !== undefined) {
            entries.push({ date: log.date, reps: log.repsMap[exerciseId] });
          }
        });

        // Sort by date ascending
        return entries.sort((a, b) => a.date.localeCompare(b.date));
      },

      getWeeklyCompletionRate: () => {
        const { logs } = get();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const cutoff = sevenDaysAgo.toISOString().split('T')[0];

        const recentLogs = logs.filter((l) => l.date >= cutoff);
        // Max possible = 2 sessions/day × 7 days = 14
        return Math.min(Math.round((recentLogs.length / 14) * 100), 100);
      },

      // --- Actions ---
      startProgram: () => {
        set({ startDate: new Date().toISOString().split('T')[0] });
      },

      logSession: (weekId, sessionType, completedExercises, repsMap) => {
        const newLog: WorkoutLog = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          date: todayStr(),
          weekId,
          sessionType,
          completedExercises,
          completedAt: new Date().toISOString(),
          repsMap,
        };
        set((state) => ({ logs: [...state.logs, newLog] }));
      },

      undoSession: (logId) => {
        set((state) => ({ logs: state.logs.filter((l) => l.id !== logId) }));
      },

      setCustomReps: (weekId, exerciseId, newReps) => {
        const state = get();
        // Use the current effective reps (custom or default) to calculate the delta
        const currentReps = state.getRepsForExercise(weekId, exerciseId, -1);
        
        let effectiveCurrent = currentReps;
        if (currentReps === -1) {
          // If no custom reps, find the default from the program
          const week = WEEKS.find(w => w.id === weekId);
          const ex = [...(week?.session.morning || []), ...(week?.session.night || [])].find(e => e.id === exerciseId);
          effectiveCurrent = ex?.reps || 0;
        }

        const delta = newReps - effectiveCurrent;
        if (delta === 0) return;

        const updatedCustomReps = { ...state.customReps };
        const weekIndex = WEEKS.findIndex(w => w.id === weekId);

        // Apply delta to this week and all subsequent weeks
        WEEKS.slice(weekIndex).forEach(w => {
          const hasEx = [...w.session.morning, ...w.session.night].some(e => e.id === exerciseId);
          if (hasEx) {
            const key = `${w.id}-${exerciseId}`;
            // Get current effective reps for this specific week before applying delta
            const weekCurrent = state.getRepsForExercise(w.id, exerciseId, -1);
            let weekBase = weekCurrent;
            if (weekCurrent === -1) {
              const ex = [...w.session.morning, ...w.session.night].find(e => e.id === exerciseId);
              weekBase = ex?.reps || 0;
            }
            updatedCustomReps[key] = weekBase + delta;
          }
        });

        set({ customReps: updatedCustomReps });
      },

      setCustomExercise: (slotId, libraryId) => {
        set((state) => ({
          customExerciseMap: { ...state.customExerciseMap, [slotId]: libraryId },
        }));
      },

      setNotifTime: (session, time) => {
        if (session === 'morning') set({ morningNotifTime: time });
        else set({ nightNotifTime: time });
      },

      setLanguage: (language) => set({ language }),

      updateProfile: (updates) => set((state) => ({
        userProfile: { ...state.userProfile, ...updates }
      })),

      setThemeMode: (themeMode) => set({ themeMode }),

      resetAll: () => {
        set({
          startDate: null,
          customReps: {},
          logs: [],
          morningNotifTime: null,
          nightNotifTime: null,
          customExerciseMap: {},
          language: 'en',
          userProfile: { equipment: ['none'] },
          themeMode: 'system',
        });
      },
    }),
    {
      name: 'workout-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
