import { useState } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import Register from './Register';
import LogIn from './Login';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'register';

export default function AuthModal({ visible, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login'); // Estado para la pestaña activa

  const handleLoginSuccess = () => {
    onClose(); // Cierra el modal después de un login exitoso
  };

  const handleRegisterSuccess = () => {
    setMode('login'); // Cambia a la pestaña de login después de un registro exitoso
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 items-center justify-center bg-black bg-opacity-50 px-4">
        <View className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          {/* Contenedor de pestañas */}
          <View className="mb-6 flex-row border-b border-gray-200">
            <TouchableOpacity
              className={`flex-1 border-b-2 py-3 ${
                mode === 'login' ? 'border-blue-600' : 'border-transparent'
              }`}
              onPress={() => setMode('login')}>
              <Text
                className={`text-center font-body text-lg ${
                  mode === 'login' ? 'font-semibold text-blue-600' : 'text-gray-500'
                }`}>
                Iniciar Sesión
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 border-b-2 py-3 ${
                mode === 'register' ? 'border-blue-600' : 'border-transparent'
              }`}
              onPress={() => setMode('register')}>
              <Text
                className={`text-center font-body text-lg ${
                  mode === 'register' ? 'font-semibold text-blue-600' : 'text-gray-500'
                }`}>
                Registrarse
              </Text>
            </TouchableOpacity>
          </View>

          {/* Renderizado condicional del componente según la pestaña */}
          {mode === 'login' ? (
            <LogIn onLoginSuccess={handleLoginSuccess} />
          ) : (
            <Register onRegisterSuccess={handleRegisterSuccess} />
          )}

          <TouchableOpacity onPress={onClose} className="mt-4">
            <Text className="text-center font-body text-sm text-edges">Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
