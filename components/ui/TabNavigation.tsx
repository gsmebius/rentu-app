import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import AuthModal from 'components/entities/users/AuthModal';

export default function TabView() {
  const [modalVisible, setModalVisible] = useState(false);

  const tabs = [
    { label: 'Inicio', icon: 'home' },
    { label: 'Tratos', icon: 'handshake-o' },
    { label: 'Mis carros', icon: 'car' },
    { label: 'Agregar', icon: 'plus-circle' },
    { label: 'Perfil', icon: 'user' },
  ];

  return (
    <>
      <LinearGradient
        colors={['#f5f9ff', '#e3efff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          flexDirection: 'row',
          justifyContent: 'center', // Centramos todo el contenedor
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 12,
          elevation: 4,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 3 },
          shadowRadius: 4,
        }}
      >
        {/* Contenedor con ancho máximo para que no se extienda demasiado */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 40, // espacio entre botones
            maxWidth: 350, // ancho máximo para que no se estiren demasiado en pantallas grandes
            width: '100%',
          }}
        >
          {tabs.map(({ label, icon }) => (
            <TouchableOpacity
              key={label}
              onPress={() => console.log(`Pressed ${label}`)}
              style={{
                alignItems: 'center',
                paddingHorizontal: 8,
              }}
              activeOpacity={0.7}
            >
              <FontAwesome name={icon as any} size={20} color="#1e3a8a" />
              <Text
                style={{
                  fontSize: 10,
                  color: '#1e3a8a',
                  fontWeight: '600',
                  marginTop: 4,
                  textAlign: 'center',
                }}
                numberOfLines={1}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <AuthModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
}

