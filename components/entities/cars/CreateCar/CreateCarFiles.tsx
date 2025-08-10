import { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CarService } from 'services/cars.service';

interface Props {
  carID: string;
  onSuccess: () => void; // Avisar al padre cuando todo sale bien
}

const requiredFiles = [
  { id: 'main', label: 'Foto principal del carro' },
  { id: 'front', label: 'Foto frontal' },
  { id: 'left', label: 'Foto lado izquierdo' },
  { id: 'right', label: 'Foto lado derecho' },
  { id: 'back', label: 'Foto atrás' },
  { id: 'trunk', label: 'Foto del baúl abierto' },
  { id: 'interior_back', label: 'Foto de adentro en parte de atrás' },
  { id: 'interior_front', label: 'Foto de adentro en parte de adelante' },
] as const;

type FileKey = (typeof requiredFiles)[number]['id'];

export default function CarValidationStep3({ carID, onSuccess }: Props) {
  const [files, setFiles] = useState<Record<FileKey, ImagePicker.ImagePickerAsset | null>>({
    main: null,
    front: null,
    left: null,
    right: null,
    back: null,
    trunk: null,
    interior_back: null,
    interior_front: null,
  });

  const [loading, setLoading] = useState(false);

  const pickImage = async (key: FileKey) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setFiles((prev) => ({ ...prev, [key]: result.assets[0] }));
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'Error al seleccionar imagen');
    }
  };

  const handleSubmit = async () => {
    const missing = requiredFiles.filter(({ id }) => !files[id]);
    if (missing.length > 0) {
      Alert.alert(
        'Faltan fotos',
        `Por favor selecciona todas las fotos obligatorias:\n${missing
          .map((m) => m.label)
          .join('\n')}`
      );
      return;
    }

    setLoading(true);
    try {
      const carService = new CarService();

      // Prepara array con objetos con uri, name y type para el service
      const filesArray = requiredFiles.map(({ id }, index) => {
        const file = files[id]!;
        return {
          uri: file.uri,
          name: file.fileName || file.uri.split('/').pop() || `file${index}.jpg`,
          type: file.type || 'image/jpeg',
        };
      });

      await carService.createCarFilesStep3(carID, filesArray);

      Alert.alert('Éxito', 'Fotos subidas correctamente.');
      onSuccess();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo subir las fotos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="p-6">
        <Text className="mb-4 text-center font-head text-2xl text-gray-800">
          Subir fotos del carro (Fase 3)
        </Text>

        {requiredFiles.map(({ id, label }) => (
          <View key={id} className="mb-6">
            <Text className="mb-2 font-body text-gray-800">{label}</Text>
            {files[id] ? (
              <Image
                source={{ uri: files[id]!.uri }}
                className="mb-2 h-48 w-full rounded-xl"
                resizeMode="cover"
              />
            ) : (
              <View className="mb-2 h-48 w-full items-center justify-center rounded-xl bg-gray-200">
                <Text className="text-gray-500">No hay foto seleccionada</Text>
              </View>
            )}
            <TouchableOpacity
              onPress={() => pickImage(id)}
              disabled={loading}
              className="rounded-xl bg-blue-600 py-3">
              <Text className="text-center font-semibold text-white">
                {files[id] ? 'Cambiar foto' : 'Seleccionar foto'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          className={`rounded-xl py-3 ${loading ? 'bg-blue-400' : 'bg-green-600'}`}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-center font-body text-base font-semibold text-white">
              Subir fotos y finalizar
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
