import { CreateUserDTO } from 'interfaces/users.schemas';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { UserService } from 'services/users.service';

interface RegisterProps {
  onRegisterSuccess: () => void; // Para cambiar a la pestaña de login o cerrar el modal
}

export default function Register({ onRegisterSuccess }: RegisterProps) {
  const [names, setNames] = useState('');
  const [last_names, setLastNames] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Estado para manejar la carga

  const handleRegister = async () => {
    if (!names || !last_names || !email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    try {
      const userService = new UserService();
      const userData: CreateUserDTO = { names, last_names, email, password };
      await userService.registerUser(userData);

      Alert.alert('Éxito', '¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
      onRegisterSuccess(); // Llama a la función para cambiar a la pestaña de login
    } catch (error: any) {
      console.error('Error durante el registro:', error);
      Alert.alert('Error', error.message || 'Hubo un error al registrar la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="p-6">
      <Text className="text-3xl font-head mb-6 text-center text-gray-800">
        Crear Cuenta
      </Text>

      <TextInput
        placeholder="Nombre(s)"
        value={names}
        onChangeText={setNames}
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-base text-gray-800 font-body"
        placeholderTextColor="#A0A0A0"
      />

      <TextInput
        placeholder="Apellido(s)"
        value={last_names}
        onChangeText={setLastNames}
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-base text-gray-800 font-body"
        placeholderTextColor="#A0A0A0"
      />

      <TextInput
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-base text-gray-800 font-body"
        placeholderTextColor="#A0A0A0"
      />

      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="border border-gray-300 rounded-xl px-4 py-3 mb-6 text-base text-gray-800 font-body"
        placeholderTextColor="#A0A0A0"
      />

      <TouchableOpacity
        className={`rounded-xl py-3 ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text className="text-white text-center font-semibold text-base font-body">
          {loading ? 'Registrando...' : 'Crear Cuenta'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}