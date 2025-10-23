import "react-native-gesture-handler";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./screens/RootNavigator";
import * as Notifications from "expo-notifications";
import { Provider as PaperProvider, MD3LightTheme } from "react-native-paper";

//! Configure how notifications are handled when the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

//! Custom theme with your app's primary color
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#132f56",
    primaryContainer: "#e8f0ff",
    secondary: "#575e71",
    secondaryContainer: "#dbe2f9",
    tertiary: "#715573",
    tertiaryContainer: "#fbd7fc",
    surface: "#fefbff",
    surfaceVariant: "#e1e2ec",
    background: "#fefbff",
    error: "#ba1a1a",
    errorContainer: "#ffdad6",
    onPrimary: "#ffffff",
    onPrimaryContainer: "#001a41",
    onSecondary: "#ffffff",
    onSecondaryContainer: "#131c2b",
    onTertiary: "#ffffff",
    onTertiaryContainer: "#29132d",
    onSurface: "#1a1c1e",
    onSurfaceVariant: "#44474f",
    onError: "#ffffff",
    onErrorContainer: "#410002",
    onBackground: "#1a1c1e",
    outline: "#74777f",
    outlineVariant: "#c4c6d0",
    shadow: "#000000",
    scrim: "#000000",
    inverseSurface: "#2f3033",
    inverseOnSurface: "#f1f0f4",
    inversePrimary: "#adc6ff",
    elevation: {
      level0: "transparent",
      level1: "#f7f9ff",
      level2: "#f1f4ff",
      level3: "#e9efff",
      level4: "#e7edff",
      level5: "#e2e9ff"
    },
    surfaceDisabled: "#1a1c1e1f",
    onSurfaceDisabled: "#1a1c1e61",
    backdrop: "#1a1c1e99"
  },
};

export default function App() {
  return (
    <SafeAreaProvider style={{ backgroundColor: "#fff" }}>
      <PaperProvider theme={theme}>
        <RootNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
