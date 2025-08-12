import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { CarService } from 'services/cars.service';
import EditCarStep1Modal from './EditCarStep1Modal';
import EditCarStep2Modal from './EditCarStep2Modal';
import EditCarStep3Modal from './EditCarStep3Modal';

interface Props {
  carID: string;
  onCarDeleted?: () => void;
}

type FileKey =
  | 'main'
  | 'front'
  | 'left'
  | 'right'
  | 'back'
  | 'trunk'
  | 'interior_back'
  | 'interior_front';

interface CarPicturesResponse {
  carPictures: {
    id: number;
    url_file: string;
  }[];
}

const requiredFiles = [
  { id: 'main' as FileKey, label: 'Foto principal del carro' },
  { id: 'front' as FileKey, label: 'Foto frontal' },
  { id: 'left' as FileKey, label: 'Foto lado izquierdo' },
  { id: 'right' as FileKey, label: 'Foto lado derecho' },
  { id: 'back' as FileKey, label: 'Foto atrás' },
  { id: 'trunk' as FileKey, label: 'Foto del baúl abierto' },
  { id: 'interior_back' as FileKey, label: 'Foto de adentro en parte de atrás' },
  { id: 'interior_front' as FileKey, label: 'Foto de adentro en parte de adelante' },
];

export default function MyCar({ carID, onCarDeleted }: Props) {
  const [carData, setCarData] = useState<any>(null);
  const [carPictures, setCarPictures] = useState<Record<FileKey, string | null>>({
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
  const [error, setError] = useState<string | null>(null);

  // Modales
  const [editInfoModal, setEditInfoModal] = useState(false);
  const [editRulesModal, setEditRulesModal] = useState(false);
  const [editPhotosModal, setEditPhotosModal] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

const carService = useMemo(() => new CarService(), []);

  const loadCarData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Info básica
      const carJson = await carService.getCarByID(carID);
      setCarData(carJson.car);

      // Fotos
      const picsResponse = await carService.getCarPictures(carID);
      if (!picsResponse.ok) throw new Error('Error al obtener fotos del carro');
      const picsJson: CarPicturesResponse = await picsResponse.json();

      // Convertir array de fotos en objeto con keys known
      // Asumo que el backend devuelve las fotos en el mismo orden de requiredFiles
      const picsObj: Record<FileKey, string | null> = {
        main: null,
        front: null,
        left: null,
        right: null,
        back: null,
        trunk: null,
        interior_back: null,
        interior_front: null,
      };

      requiredFiles.forEach(({ id }, index) => {
        picsObj[id] = picsJson.carPictures[index]?.url_file || null;
      });

      setCarPictures(picsObj);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al cargar datos del carro');
    } finally {
      setLoading(false);
    }
  }, [carID, carService]);

  useEffect(() => {
    loadCarData();
  }, []);

  const handleDeleteCar = async () => {
    setDeleting(true);
    try {
      await carService.deleteCar(carID);
      Alert.alert('Éxito', 'Carro eliminado correctamente');
      onCarDeleted?.();
      setConfirmDeleteModal(false);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'No se pudo eliminar el carro');
    } finally {
      setDeleting(false);
    }
  };

  const handleEditSuccess = () => {
    loadCarData();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="mt-4">Cargando información del carro...</Text>
      </View>
    );
  }

  if (error || !carData) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-center text-red-500">
          {error || 'No se encontró información del carro'}
        </Text>
        <TouchableOpacity
          className="mt-4 rounded bg-blue-500 px-4 py-2"
          onPress={() => loadCarData()}>
          <Text className="text-white">Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6">
        {/* Información básica */}
        <View className="mb-8">
          <Text className="mb-2 text-center font-head text-3xl">
            {carData.brand || 'Marca no especificada'},{' '}
            {carData.model|| 'Modelo no especificado'}
          </Text>
          <Text className="text-center font-head text-xl text-gray-600">
            {carData.year || 'Año no especificado'}
          </Text>
        </View>

        {/* Fotos del carro */}
        <View className="mb-8">
          <Text className="mb-4 text-xl font-semibold">Fotos del carro</Text>

          {/* Foto principal */}
          {carPictures.main ? (
            <Image
              source={{ uri: carPictures.main }}
              className="mb-4 h-64 w-full rounded-lg"
              resizeMode="cover"
            />
          ) : (
            <View className="mb-4 h-64 w-full items-center justify-center rounded-lg bg-gray-200">
              <Text>No hay foto principal</Text>
            </View>
          )}

          {/* Miniaturas otras fotos */}
          <ScrollView horizontal className="mb-4">
            {requiredFiles
              .filter(({ id }) => id !== 'main' && carPictures[id])
              .map(({ id }) => (
                <Image
                  key={id}
                  source={{ uri: carPictures[id]! }}
                  className="mr-2 h-24 w-24 rounded-lg"
                  resizeMode="cover"
                />
              ))}
          </ScrollView>
        </View>

        {/* Botones */}
        <View className="mb-6">
          <TouchableOpacity
            onPress={() => setEditInfoModal(true)}
            className="mb-4 rounded-lg bg-blue-500 py-4">
            <Text className="text-center text-lg font-semibold text-white">
              Editar información básica
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setEditRulesModal(true)}
            className="mb-4 rounded-lg bg-blue-500 py-4">
            <Text className="text-center text-lg font-semibold text-white">
              Editar reglas y disponibilidad
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setEditPhotosModal(true)}
            className="mb-4 rounded-lg bg-blue-500 py-4">
            <Text className="text-center text-lg font-semibold text-white">
              Cambiar fotos del carro
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botón eliminar */}
        <TouchableOpacity
          onPress={() => setConfirmDeleteModal(true)}
          className="rounded-lg bg-red-500 py-3">
          <Text className="text-center font-semibold text-white">Eliminar carro</Text>
        </TouchableOpacity>
      </View>

      {/* Modales */}
      <EditCarStep1Modal
        carID={carID}
        visible={editInfoModal}
        onClose={() => setEditInfoModal(false)}
        onSuccess={() => {
          setEditInfoModal(false);
          handleEditSuccess();
        }}
      />

      <EditCarStep2Modal
        carID={carID}
        visible={editRulesModal}
        onClose={() => setEditRulesModal(false)}
        onSuccess={() => {
          setEditRulesModal(false);
          handleEditSuccess();
        }}
      />

      <EditCarStep3Modal
        carID={carID}
        visible={editPhotosModal}
        onClose={() => setEditPhotosModal(false)}
        onSuccess={() => {
          setEditPhotosModal(false);
          handleEditSuccess();
        }}
      />

      {/* Confirm delete modal */}
      <Modal visible={confirmDeleteModal} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/50 p-6">
          <View className="w-full rounded-lg bg-white p-6">
            <Text className="mb-4 text-lg font-semibold">
              ¿Estás seguro de eliminar este carro?
            </Text>
            <Text className="mb-6">
              Esta acción no se puede deshacer. Se eliminarán todos los datos asociados al carro.
            </Text>

            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setConfirmDeleteModal(false)}
                className="rounded bg-gray-300 px-6 py-2"
                disabled={deleting}>
                <Text>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDeleteCar}
                className="rounded bg-red-500 px-6 py-2"
                disabled={deleting}>
                {deleting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white">Eliminar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
