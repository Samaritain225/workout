// tw/index.tsx
// With NativeWind v4, className is automatically supported on all RN components
// via the Babel transform. These wrappers provide a stable import path and
// add any extras (e.g. contentContainerClassName for ScrollView).

import { Link as RouterLink } from 'expo-router';
import Animated from 'react-native-reanimated';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableHighlight,
  TextInput,
} from 'react-native';

export { View, Text, Pressable, TouchableHighlight, TextInput };
export { ScrollView };
export { RouterLink as Link };

// CSS Variable hook — no-op in v4, kept for API compatibility
export const useCSSVariable = (_variable: string) => undefined;

// Animated.View with className support
export const AnimatedView = Animated.View;
export const AnimatedScrollView = Animated.ScrollView;
