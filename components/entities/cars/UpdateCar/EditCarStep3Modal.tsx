import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CarService } from 'services/cars.service';

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

interface Props {
  carID: string;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditCarStep3Modal({ carID, visible, onClose, onSuccess }: Props) {
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

  const [currentImages, setCurrentImages] = useState<Record<FileKey, string | null>>({
    main: null,
    front: null,
    left: null,
    right: null,
    back: null,
    trunk: null,
    interior_back: null,
    interior_front: null,
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const fetchCarPictures = async () => {
      try {
        const carService = new CarService();
        const response = await carService.getCarPictures(carID);
        const picturesData = await response.json();

        const newCurrentImages = { ...currentImages };
        requiredFiles.forEach(({ id }) => {
          newCurrentImages[id] = picturesData[id] || null;
        });
        setCurrentImages(newCurrentImages);
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar las fotos del carro');
        throw error;
      } finally {
        setLoading(false);
      }
    };

    fetchCarPictures();
  }, [visible, carID, currentImages]);

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
    const missing = requiredFiles.filter(({ id }) => !files[id] && !currentImages[id]);
    if (missing.length > 0) {
      Alert.alert(
        'Faltan fotos',
        `Por favor selecciona todas las fotos obligatorias:\n${missing
          .map((m) => m.label)
          .join('\n')}`
      );
      return;
    }

    setUploading(true);
    try {
      const carService = new CarService();
      const filesToUpload = requiredFiles
        .filter(({ id }) => files[id]) // Solo las que se cambiaron
        .map(({ id }) => ({
          uri: files[id]!.uri,
          name: files[id]!.fileName || files[id]!.uri.split('/').pop() || `${id}.jpg`,
          type: files[id]!.type || 'image/jpeg',
        }));

      await carService.changeCarFiles(carID, filesToUpload);
      Alert.alert('Éxito', 'Fotos actualizadas correctamente');
      onSuccess();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudieron actualizar las fotos');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="w-4/5 rounded-xl bg-white p-6">
            <ActivityIndicator size="large" />
            <Text className="mt-4 text-center">Cargando fotos del carro...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="max-h-[90%] w-4/5 rounded-xl bg-white">
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className="p-6">
              <Text className="mb-4 text-center font-head text-2xl text-gray-800">
                Editar fotos del carro
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
                  ) : currentImages[id] ? (
                    <Image
                      source={{ uri: currentImages[id]! }}
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
                    disabled={uploading}
                    className="rounded-xl bg-blue-600 py-3">
                    <Text className="text-center font-semibold text-white">
                      {files[id] || currentImages[id] ? 'Cambiar foto' : 'Seleccionar foto'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}

              {/* Botones */}
              <View className="mt-4 flex-row justify-between">
                <TouchableOpacity onPress={onClose} className="rounded-xl bg-gray-300 px-6 py-3">
                  <Text className="font-semibold">Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={uploading}
                  className={`rounded-xl px-6 py-3 ${uploading ? 'bg-blue-400' : 'bg-green-600'}`}>
                  {uploading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="font-semibold text-white">Guardar fotos</Text>
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
