import { Stack } from 'expo-router';
import { useLoadFonts } from '../hooks/useLoadFonts';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import '../global.css';
import { AuthProvider } from 'auth/AuthContext';
import NavbarSession from 'components/ui/NavbarSession';
import TabNavigation from 'components/ui/TabNavigation';


export default function Layout() {
  const fontsLoaded = useLoadFonts();

  if (!fontsLoaded) return null; // algún loading

  return (
    <AuthProvider>
      <SafeAreaProvider>
        {/* flex 1, ocupa todo, y respeta los edges puestos */}
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right', 'bottom']}>
          <NavbarSession />
          {/* headerShown: false quita los headers por default de Expo */}
          <ScrollView>
            <Stack screenOptions={{ headerShown: false }} />
          </ScrollView>
          <TabNavigation />
        </SafeAreaView>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
