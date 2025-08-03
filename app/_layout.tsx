import { Stack } from 'expo-router';
import { useLoadFonts } from '../hooks/useLoadFonts';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import '../global.css';

import { AuthProvider, useAuth } from 'auth/AuthContext'; // <-- importas el hook
import NavbarSession from 'components/ui/NavbarSession';
import TabNavigation from 'components/ui/TabNavigation';
import NavbarView from 'components/ui/NavbarView';
import TabView from 'components/ui/TabView';

function LayoutContent() {
  const { user, loading } = useAuth();

  if (loading) {
    // Puedes poner algún loading o splash aquí mientras carga la sesión
    return null;
  }

  return (
    <>
      {/* Navbar */}
      {user ? <NavbarSession name={user.names} /> : <NavbarView />}

      {/* Contenido principal */}
      <ScrollView>
        <Stack screenOptions={{ headerShown: false }} />
      </ScrollView>

      {/* Tab navigation */}
      {user ? <TabNavigation /> : <TabView />}
    </>
  );
}

export default function Layout() {
  const fontsLoaded = useLoadFonts();

  if (!fontsLoaded) return null; // loading de fuentes

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right', 'bottom']}>
          <LayoutContent />
        </SafeAreaView>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
