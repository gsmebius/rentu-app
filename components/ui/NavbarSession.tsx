// components/NavbarSession.tsx
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface NavbarSessionProps {
  name: string;
}

export default function NavbarSession({ name }: NavbarSessionProps) {
  return (
    <LinearGradient
      colors={['#f5f9ff', '#e3efff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        paddingHorizontal: 20,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Logo */}
      <View
        style={{
          backgroundColor: '#2563eb',
          borderRadius: 9999,
          paddingHorizontal: 10,
          paddingVertical: 4,
          marginRight: 8,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>R</Text>
      </View>

      {/* Nombre dinámico */}
      <Text style={{ fontSize: 16, fontWeight: '500', color: '#1e3a8a' }}>
        {name}
      </Text>
    </LinearGradient>
  );
}

