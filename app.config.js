// app.config.js
// Single source of truth for all Expo configuration.
// Defaults to 'development' when APP_VARIANT is not set (i.e. local development).

const variant = process.env.APP_VARIANT || 'development';
const IS_DEV = variant === 'development';

const name = IS_DEV ? 'Workout (Dev)' : 'Workout';
const bundleId = IS_DEV ? 'com.workouttracker.app.dev' : 'com.workouttracker.app';

export default {
  expo: {
    name,
    slug: 'workout',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'workout-app',
    userInterfaceStyle: 'automatic',
    ios: {
      supportsTablet: true,
      bundleIdentifier: bundleId,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#262930',
      },
      package: bundleId,
      predictiveBackGestureEnabled: false,
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/icon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          android: {
            backgroundColor: '#262930',
            image: './assets/images/splash-icon.png',
            imageWidth: 180,
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: 'a643e810-0150-4041-95d2-dbe47ca3494f',
      },
    },
    owner: 'doumbia-225',
  },
};
