// components/Tab.tsx
import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import AuthModal from 'components/entities/users/AuthModal';

export default function TabView() {
  const [modalVisible, setModalVisible] = useState(false);

  const links = [
    { label: 'Iniciar sesión', action: () => setModalVisible(true) },
  ];

  return (
    <>
      <LinearGradient
        colors={['#f5f9ff', '#e3efff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 40,
          paddingVertical: 23,
          elevation: 4,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 3 },
          shadowRadius: 4,
        }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {links.map(({ label, action }) => (
            <TouchableOpacity
              key={label}
              onPress={action} // Esto activará la función para mostrar el modal
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                borderRadius: 9999,
                borderColor: '#2563eb',
                borderWidth: 1,
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: '#ffffffee',
              }}
              activeOpacity={0.8}>
              <FontAwesome name="user-circle" size={18} color="#1e3a8a" />
              <Text style={{ color: '#1e3a8a', fontWeight: '600', fontSize: 14 }}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>
      <AuthModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
}
