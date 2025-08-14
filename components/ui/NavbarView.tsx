// components/Navbar.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';

export default function Navbar() {
  const links = [
    { label: 'Conoce Rentu', href: '/' },
    { label: 'Crear cuenta', href: '/' },
  ];

  return (
    <LinearGradient
      colors={['#f5f9ff', '#e3efff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 100,
        paddingVertical: 23,
        elevation: 4, // sombra en Android
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 4,
      }}
    >
      {/* Logo */}
      <View
        style={{
          backgroundColor: '#2563eb',
          borderRadius: 9999,
          paddingHorizontal: 12,
          paddingVertical: 4,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>R</Text>
      </View>

      {/* Links */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {links.map(({ label, href }) => (
          <Link key={label} href={href} asChild>
            <TouchableOpacity
              style={{
                borderRadius: 9999,
                borderColor: '#2563eb',
                borderWidth: 1,
                paddingHorizontal: 14,
                paddingVertical: 6,
              }}
              activeOpacity={0.8}
            >
              <Text style={{ color: '#1e3a8a', fontWeight: '500', fontSize: 13 }}>{label}</Text>
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </LinearGradient>
  );
}