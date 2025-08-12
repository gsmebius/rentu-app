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

interface CarPicture {
  id: number;
  url_file: string;
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

  // Estado para mostrar las imágenes actuales (del backend)
  const [currentPictures, setCurrentPictures] = useState<Record<FileKey, string | null>>({
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
  const [loadingPictures, setLoadingPictures] = useState(false);

  useEffect(() => {
    if (!visible) return;

    // Cargar fotos actuales al abrir modal
    const loadPictures = async () => {
      setLoadingPictures(true);
      try {
        const carService = new CarService();
        const response = await carService.getCarPictures(carID);
        // El service debe parsear JSON, si no, parsea aquí:
        const data = await response.json();

        // Mapear las imágenes actuales a las keys esperadas, asumiendo orden o metadata
        // Aquí asumo que las fotos vienen ordenadas o que el backend sabe cuál es cuál,
        // si no, tendrás que ajustar esta lógica según tus datos reales.
        const picsArray: CarPicture[] = data.carPictures || [];

        // Mapear fotos actuales a keys basados en el orden de requiredFiles (asumiendo mismo orden)
        const picsMap: Record<FileKey, string | null> = { ...currentPictures };
        requiredFiles.forEach(({ id }, index) => {
          picsMap[id] = picsArray[index]?.url_file || null;
        });
        setCurrentPictures(picsMap);

        // También limpiar el state files para obligar a re-subir todo
        setFiles({
          main: null,
          front: null,
          left: null,
          right: null,
          back: null,
          trunk: null,
          interior_back: null,
          interior_front: null,
        });
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar las fotos actuales.');
      } finally {
        setLoadingPictures(false);
      }
    };

    loadPictures();
  }, [carID, visible]);

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
      const formData = new FormData();

      for (const { id } of requiredFiles) {
        const file = files[id]!;
        const blob = await uriToBlob(file.uri);
        const fileName = file.fileName || file.uri.split('/').pop() || `${id}.jpg`;
        formData.append('files', blob, fileName);
      }

      await carService.changeCarFiles(carID, formData);

      Alert.alert('Éxito', 'Fotos actualizadas correctamente.');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error al subir las fotos:', error);
      Alert.alert('Error', error.message || 'No se pudieron subir las fotos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-6">
          <Text className="mb-4 text-center font-head text-2xl text-gray-800">
            Subir fotos del carro (Edición)
          </Text>

          {loadingPictures ? (
            <ActivityIndicator size="large" />
          ) : (
            <>
              <Text className="mb-2 font-body text-gray-800 text-center">
                Fotos actuales (para referencia)
              </Text>
              {requiredFiles.map(({ id, label }) => (
                <View key={`current-${id}`} className="mb-4 items-center">
                  {currentPictures[id] ? (
                    <Image
                      source={{ uri: currentPictures[id]! }}
                      style={{ width: 300, height: 180, borderRadius: 12, marginBottom: 4 }}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={{
                        width: 300,
                        height: 180,
                        borderRadius: 12,
                        backgroundColor: '#e5e7eb',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 4,
                      }}
                    >
                      <Text>No hay foto actual</Text>
                    </View>
                  )}
                  <Text className="text-gray-700">{label}</Text>
                </View>
              ))}

              <Text className="mb-2 mt-6 font-body text-gray-800 text-center">
                Selecciona las nuevas fotos (debes subir todas)
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
                    className="rounded-xl bg-blue-600 py-3"
                  >
                    <Text className="text-center font-semibold text-white">
                      {files[id] ? 'Cambiar foto' : 'Seleccionar foto'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                className={`rounded-xl py-3 ${loading ? 'bg-blue-400' : 'bg-green-600'}`}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-center font-body text-base font-semibold text-white">
                    Subir fotos y finalizar
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                disabled={loading}
                className="mt-4 rounded-xl bg-red-600 py-3"
              >
                <Text className="text-center font-body text-base font-semibold text-white">
                  Cancelar
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </Modal>
  );
}
