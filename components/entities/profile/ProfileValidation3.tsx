import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from 'auth/AuthContext';
import { UserService } from 'services/users.service';

interface ProfileValidation3Props {
  onNext: () => void;
  onValidationSuccess?: () => void;
  onValidationError?: (error?: any) => void;
}

export default function ProfileValidation3({
  onNext,
  onValidationSuccess,
  onValidationError,
}: ProfileValidation3Props) {
  const [photo, setPhoto] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setPhoto(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Error al seleccionar imagen');
      onValidationError?.(error);
    }
  };

  const handleUpload = async () => {
    if (!photo) {
      Alert.alert('Advertencia', 'Por favor selecciona una foto primero.');
      onValidationError?.('No photo selected');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'Usuario no autenticado.');
      onValidationError?.('No user');
      return;
    }

    setLoading(true);

    try {
      const userService = new UserService();
      
      // Convertir la URI de la foto (incluyendo Base64) a un objeto Blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          resolve(xhr.response);
        };
        xhr.onerror = function() {
          reject(new Error('URI a Blob fallido'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', photo.uri, true);
        xhr.send(null);
      });

      // Obtener el nombre del archivo
      const fileName = photo.name || photo.uri.split('/').pop() || `photo_${Date.now()}.jpg`;

      // Log para depuración
      console.log('Datos enviados al servicio:', {
        userId: user.id.toString(),
        fileName: fileName,
        fileBlob: blob, // Se mostrará como un objeto Blob en el log
      });

      // Llamar al servicio con el Blob y el nombre del archivo
      await userService.uploadPrivateValidationPhoto(user.id.toString(), blob, fileName);

      Alert.alert('Éxito', 'Foto subida exitosamente');
      onValidationSuccess?.();
      onNext();
    } catch (error) {
      console.error('Error al subir la foto:', error);
      Alert.alert('Error', 'Ocurrió un error al subir la foto');
      onValidationError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="p-4">
      <Text className="mb-2 text-lg font-semibold">Paso 3: Validación Privada</Text>
      <Text className="mb-4 text-gray-700">
        Toma una foto tuya y súbela, puede ser una selfie o una foto reciente. Esto nos ayudará a
        validar tu identidad. Esta foto <Text className="font-bold">no será pública</Text>. Si la
        revisamos y es inconsistente, te contactaremos.
      </Text>

      {photo && (
        <Image
          source={{ uri: photo.uri }}
          className="mb-4 h-64 w-full rounded-xl"
          resizeMode="cover"
        />
      )}

      <TouchableOpacity
        onPress={pickImage}
        disabled={loading}
        className="mb-3 rounded-xl bg-blue-500 py-3"
      >
        <Text className="text-center font-semibold text-white">
          {loading ? 'Cargando...' : 'Seleccionar Foto'}
        </Text>
      </TouchableOpacity>

      {photo && (
        <TouchableOpacity
          onPress={handleUpload}
          disabled={loading}
          className="rounded-xl bg-green-600 py-3"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-center font-semibold text-white">Subir Foto</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}