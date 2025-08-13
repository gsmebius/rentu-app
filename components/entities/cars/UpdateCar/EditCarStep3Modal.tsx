import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CarService } from 'services/cars.service';

interface Props {
  carID: string;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
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

export default function EditCarStep3Modal({ carID, visible, onClose, onSuccess }: Props) {
  // Guarda las nuevas imágenes seleccionadas por el usuario
  const [newFiles, setNewFiles] = useState<Record<FileKey, ImagePicker.ImagePickerAsset | null>>({
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

  // Al abrir el modal, se reinicia el estado de las imágenes seleccionadas
  useEffect(() => {
    if (visible) {
      setNewFiles({
        main: null,
        front: null,
        left: null,
        right: null,
        back: null,
        trunk: null,
        interior_back: null,
        interior_front: null,
      });
    }
  }, [visible]);

  const pickImage = async (key: FileKey) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setNewFiles((prev) => ({ ...prev, [key]: result.assets[0] }));
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'Error al seleccionar imagen');
    }
  };

  const uriToBlob = (uri: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        resolve(xhr.response);
      };
      xhr.onerror = () => {
        reject(new Error('Error al convertir URI a Blob'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  };

  const handleSubmit = async () => {
    // Verificar que todas las fotos obligatorias hayan sido seleccionadas
    const missing = requiredFiles.filter(({ id }) => !newFiles[id]);
    if (missing.length > 0) {
      Alert.alert(
        'Faltan fotos',
        `Por favor, selecciona todas las fotos obligatorias para continuar.`
      );
      return;
    }

    setLoading(true);
    try {
      const carService = new CarService();
      const formData = new FormData();

      for (const { id } of requiredFiles) {
        const file = newFiles[id]!;
        const blob = await uriToBlob(file.uri);
        const fileName = file.fileName || file.uri.split('/').pop() || `${id}.jpg`;
        formData.append('files', blob, fileName);
      }
      await carService.changeCarFiles(carID, formData);

      Alert.alert('Éxito', 'Fotos actualizadas correctamente.');
      onSuccess();
    } catch (error: any) {
      console.error('Error al subir las fotos:', error);
      Alert.alert('Error', error.message || 'No se pudieron subir las fotos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="max-h-[90%] w-4/5 rounded-xl bg-white">
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className="p-6">
              <Text className="mb-4 text-center font-head text-2xl text-gray-800">
                Editar fotos del carro
              </Text>

              <Text className="mb-6 text-center font-body text-gray-800">
                Debes subir todas las fotos nuevas para actualizar la información.
              </Text>

              {requiredFiles.map(({ id, label }) => {
                const imageSource = newFiles[id] ? { uri: newFiles[id]!.uri } : null;

                return (
                  <View key={id} className="mb-6">
                    <Text className="mb-2 font-body text-gray-800">{label}</Text>
                    {imageSource ? (
                      <Image
                        source={imageSource}
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
                      className="rounded-xl bg-blue-600 py-3"
                    >
                      <Text className="text-center font-semibold text-white">
                        {imageSource ? 'Cambiar foto' : 'Seleccionar foto'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}

              <View className="mt-4 flex-row justify-between">
                <TouchableOpacity onPress={onClose} className="rounded-xl bg-gray-300 px-6 py-3">
                  <Text className="font-semibold">Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={loading}
                  className={`rounded-xl px-6 py-3 ${loading ? 'bg-blue-400' : 'bg-green-600'}`}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="font-semibold text-white">Subir fotos</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}