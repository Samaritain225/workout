import { useColorScheme } from 'react-native';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { COLORS } from '../constants/theme';

export function useTheme() {
  const systemColorScheme = useColorScheme();
  const { themeMode } = useWorkoutStore();

  const isDark = themeMode === 'system' 
    ? systemColorScheme === 'dark' 
    : themeMode === 'dark';

  const theme = isDark ? COLORS.dark : COLORS.light;

  return {
    theme,
    isDark,
    themeMode,
  };
}
