import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import CitiesContextProvider from '@/context/CitiesContext';

export default function PrivateRootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <CitiesContextProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="cidades/[cidade]" options={{ title: 'Cidade' }} />
        </Stack>
      </CitiesContextProvider>
    </ThemeProvider>
  );
}
