// components/Tab.tsx
import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import AuthModal from 'components/entities/users/AuthModal';

export default function TabView() {
  const [modalVisible, setModalVisible] = useState(false);

  const links = [
    // El objeto para 'Iniciar sesión' ya está configurado para abrir el modal
    { label: 'Iniciar sesión', action: () => setModalVisible(true) },
    // Puedes añadir más enlaces aquí si los necesitas en el futuro
    // { label: 'Otra acción', action: () => console.log('Otra acción') },
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

      {/* Aquí es donde incluyes tu AuthModal */}
      {/* El prop 'visible' controla si el modal se muestra. */}
      {/* El prop 'onClose' se llama cuando el modal necesita cerrarse (ej: después de login exitoso, o si el usuario presiona 'Cancelar'). */}
      <AuthModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
}
