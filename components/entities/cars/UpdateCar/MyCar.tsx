import { useState, useEffect } from 'react';
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
  onCarDeleted?: () => void; // Callback cuando se elimina el carro
}

export default function MyCar({ carID, onCarDeleted }: Props) {
  const [carData, setCarData] = useState<any>(null);
  const [carPictures, setCarPictures] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para los modales
  const [editInfoModal, setEditInfoModal] = useState(false);
  const [editRulesModal, setEditRulesModal] = useState(false);
  const [editPhotosModal, setEditPhotosModal] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Cargar datos del carro
  useEffect(() => {
    const fetchCarData = async () => {
      try {
        setLoading(true);
        const carService = new CarService();

        // Obtener información básica del carro
        const carResponse = await carService.getCarByID(carID);
        const carJson = await carResponse.json();
        setCarData(carJson);

        // Obtener fotos del carro
        const picturesResponse = await carService.getCarPictures(carID);
        const picturesJson = await picturesResponse.json();
        setCarPictures(picturesJson);
      } catch (err) {
        setError('No se pudo cargar la información del carro');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, [carID]);

  // Función para eliminar el carro
  const handleDeleteCar = async () => {
    setDeleting(true);
    try {
      const carService = new CarService();
      await carService.deleteCar(carID);
      Alert.alert('Éxito', 'Carro eliminado correctamente');
      onCarDeleted?.(); // Notificar al padre que se eliminó el carro
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'No se pudo eliminar el carro');
    } finally {
      setDeleting(false);
      setConfirmDeleteModal(false);
    }
  };

  // Recargar datos cuando se edita algo
  const handleEditSuccess = () => {
    // Volver a cargar los datos
    setCarData(null);
    setCarPictures({});
    setLoading(true);
    const carService = new CarService();

    carService
      .getCarByID(carID)
      .then((res) => res.json())
      .then((data) => {
        setCarData(data);
        return carService.getCarPictures(carID);
      })
      .then((res) => res.json())
      .then((pics) => setCarPictures(pics))
      .catch((err) => setError('Error al recargar datos'))
      .finally(() => setLoading(false));
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
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">{error || 'No se encontró información del carro'}</Text>
        <TouchableOpacity
          className="mt-4 rounded bg-blue-500 px-4 py-2"
          onPress={() => {
            setError(null);
            setLoading(true);
            // Intentar cargar de nuevo
          }}>
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
            {carData.brand?.name || 'Marca no especificada'},{' '}
            {carData.model?.name || 'Modelo no especificado'}
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

          {/* Miniaturas de otras fotos */}
          <ScrollView horizontal className="mb-4">
            {requiredFiles
              .filter(({ id }) => id !== 'main' && carPictures[id])
              .map(({ id }) => (
                <Image
                  key={id}
                  source={{ uri: carPictures[id] }}
                  className="mr-2 h-24 w-24 rounded-lg"
                  resizeMode="cover"
                />
              ))}
          </ScrollView>
        </View>

        {/* Botones de acción */}
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

      {/* Modal de confirmación para eliminar */}
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

// Lista de archivos requeridos (igual que en EditCarStep3Modal)
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
