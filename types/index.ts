export type ExerciseTag = 'upper' | 'abs' | 'legs' | 'core';
export type SessionType = 'morning' | 'night';
export type PhaseColor = 'blue' | 'green' | 'orange' | 'purple';
export type EquipmentType = 'none' | 'dumbbells' | 'barbell' | 'bench' | 'bands' | 'kettlebell';

export interface Exercise {
  id: string;
  name: string;
  tag: ExerciseTag;
  reps: number;
  unit: string;
  isNew?: boolean;
  delta?: string;
  sub?: string;
  videoUrl?: string;     // YouTube or video link
  thumbnail?: string;    // Image URL for preview
  instructions?: string; // Text description
  equipment?: EquipmentType[];
}

export interface DaySession {
  morning: Exercise[];
  night: Exercise[];
  note: string;
}

export interface Week {
  id: string;
  label: string;
  phase: string;
  phaseColor: PhaseColor;
  title: string;
  desc: string;
  session: DaySession;
  isDeload?: boolean;
  isLongTerm?: boolean;
}

export interface WorkoutLog {
  id: string;
  date: string;           // YYYY-MM-DD
  weekId: string;
  sessionType: SessionType;
  completedExercises: string[];  // exercise ids
  completedAt: string;    // ISO datetime
  repsMap: Record<string, number>;  // exerciseId → actual reps logged
}

export interface ProgressEntry {
  date: string;           // YYYY-MM-DD
  reps: number;
}

export interface ExerciseProgress {
  exerciseId: string;
  exerciseName: string;
  entries: ProgressEntry[];
}

export type Language = 'en' | 'fr';

export interface UserProfile {
  height?: number; // cm
  weight?: number; // kg
  age?: number;
  gender?: 'male' | 'female' | 'other';
}
