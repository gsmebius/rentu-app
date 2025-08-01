import { Stack } from 'expo-router';
import { useLoadFonts } from '../hooks/useLoadFonts';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import Navbar from 'components/ui/NavbarView';

export default function Layout() {
  const fontsLoaded = useLoadFonts();

  if (!fontsLoaded) return null; // algún loading

  return (
    <SafeAreaProvider>
        {/* flex 1, ocupa todo, y respeta los edges puestos */}
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right', 'bottom']}>
        <Navbar />
        {/* headerShown: false quita los headers por default de Expo */}
        <ScrollView>
            <Stack screenOptions={{ headerShown: false }} />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
