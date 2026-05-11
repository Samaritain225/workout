import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const IS_DEV = process.env.APP_VARIANT === 'development';

  const name = IS_DEV ? 'Workout (Dev)' : 'Workout';
  const bundleId = IS_DEV ? 'com.workouttracker.app.dev' : 'com.workouttracker.app';

  return {
    ...config,
    name,
    slug: 'workout',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'workout-app',
    userInterfaceStyle: 'automatic',
    platforms: ['android'],
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#262930',
      },
      package: bundleId,
      predictiveBackGestureEnabled: false,
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
      environment: IS_DEV ? 'development' : 'production',
    },
    owner: 'doumbia-225',
  };
};
