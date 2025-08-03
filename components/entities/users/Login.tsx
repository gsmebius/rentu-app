import { useAuth } from 'auth/AuthContext';
import { LoginUserDTO } from 'interfaces/users.schemas';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { UserService } from 'services/users.service';

interface LogInProps {
  onLoginSuccess: () => void;
}

export default function LogIn({ onLoginSuccess }: LogInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);
    try {
      const userService = new UserService();
      const userData: LoginUserDTO = { email, password };
      const response = await userService.loginUser(userData);

      login(response.SecureUser, response.accessToken, response.refreshToken, response.sessionId);

      Alert.alert('Éxito', '¡Inicio de sesión exitoso!');
      onLoginSuccess(); // Cerrar modal o navegar
    } catch (error: any) {
      console.error('Error durante el login:', error);
      Alert.alert('Error', error.message || 'Hubo un error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="p-6">
      <Text className="mb-6 text-center font-head text-3xl text-gray-800">Iniciar Sesión</Text>

      <TextInput
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        className="mb-4 rounded-xl border border-gray-300 px-4 py-3 font-body text-base text-gray-800"
        placeholderTextColor="#A0A0A0"
      />

      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="mb-6 rounded-xl border border-gray-300 px-4 py-3 font-body text-base text-gray-800"
        placeholderTextColor="#A0A0A0"
      />

      <TouchableOpacity
        className={`rounded-xl py-3 ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
        onPress={handleLogin}
        disabled={loading}>
        <Text className="text-center font-body text-base font-semibold text-white">
          {loading ? 'Iniciando...' : 'Iniciar Sesión'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
