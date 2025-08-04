import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { UserService } from 'services/users.service';

export interface ProfileValidation1Props {
  userId: number;
  onValidationSuccess?: () => void;
  onValidationError?: (error?: any) => void;
}

export interface updateUserStep1DTO {
  country: string;
  phone_number: string;
}

const countries = [
  { code: 'US', name: 'Estados Unidos', callingCode: '1' },
  { code: 'MX', name: 'México', callingCode: '52' },
  { code: 'SV', name: 'El Salvador', callingCode: '503' },
];

export default function ProfileValidation1({
  userId,
  onValidationSuccess,
  onValidationError,
}: ProfileValidation1Props) {
  const [country, setCountry] = useState('US');
  const [, setCallingCode] = useState('1');
  const [phoneNumber, setPhoneNumber] = useState('+1 ');
  const [loading, setLoading] = useState(false);

  const onCountryChange = (code: string) => {
    const selected = countries.find((c) => c.code === code);
    if (!selected) return;
    setCountry(code);
    setCallingCode(selected.callingCode);
    setPhoneNumber(`+${selected.callingCode} `);
  };

  const handleSubmit = async () => {
    const phoneTrimmed = phoneNumber.trim();
    const phoneDigits = phoneTrimmed.replace(/[^\d]/g, '');

    if (!phoneTrimmed || phoneDigits.length < 7) {
      Alert.alert('Error', 'Ingresa un número de teléfono válido.');
      onValidationError?.('Teléfono inválido');
      return;
    }

    setLoading(true);
    try {
      const userService = new UserService();
      const data: updateUserStep1DTO = {
        country,
        phone_number: phoneDigits,
      };

      await userService.updateUserStep1(userId, data);
      Alert.alert('Éxito', 'Validación enviada correctamente.');
      onValidationSuccess?.();
    } catch (error: any) {
      console.error('Error al validar usuario:', error);
      Alert.alert('Error', error.message || 'Ocurrió un error al enviar la validación.');
      onValidationError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="p-6">
      <Text className="mb-4 text-center font-head text-3xl text-gray-800">
        Validación de Usuario
      </Text>

      <Text className="mb-6 font-body text-base text-gray-700">
        Rentu es una app segura y se preocupa por sus usuarios. Necesitamos verificar la veracidad
        de la identidad de todos los que están aquí (tanto clientes como dueños), así garantizar una
        experiencia sin riesgos.
      </Text>

      <View className="mb-4 rounded-xl border border-gray-300 px-4 py-3">
        <Picker
          selectedValue={country}
          onValueChange={onCountryChange}
          mode="dropdown"
          style={{ color: '#1e3a8a', fontSize: 16 }}
          dropdownIconColor="#1e3a8a">
          {countries.map(({ code, name, callingCode }) => (
            <Picker.Item key={code} label={`${name} (+${callingCode})`} value={code} />
          ))}
        </Picker>
      </View>

      <TextInput
        placeholder="Número de teléfono"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        className="mb-6 rounded-xl border border-gray-300 px-4 py-3 font-body text-base text-gray-800"
        placeholderTextColor="#A0A0A0"
      />

      <TouchableOpacity
        className={`rounded-xl py-3 ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
        onPress={handleSubmit}
        disabled={loading}>
        <Text className="text-center font-body text-base font-semibold text-white">
          {loading ? 'Validando...' : 'Enviar validación'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
