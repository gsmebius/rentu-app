import CarValidations from 'components/entities/cars/CreateCar/CarValidations';
import MyCar from 'components/entities/cars/UpdateCar/MyCar';
import { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text, Pressable } from 'react-native';
import { CarService } from 'services/cars.service';

interface Props {
  carID: string;
}

export default function MyCarsScreen({ carID }: Props) {
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener el estado actual del carro
  useEffect(() => {
    const fetchCarStatus = async () => {
      try {
        setLoading(true);
        const carService = new CarService();
        const response = await carService.getCarStatusByID(Number(carID));

        if (!response.ok) {
          throw new Error('No se pudo obtener el estado del carro');
        }

        const data = await response.json();
        setStatus(data.status);
      } catch (err: any) {
        setError(err.message || 'Error al cargar el estado del carro');
      } finally {
        setLoading(false);
      }
    };

    fetchCarStatus();
  }, [carID]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="mb-4 text-red-500">{error}</Text>
        <Pressable
          className="rounded bg-blue-500 px-4 py-2"
          onPress={() => {
            setError(null);
            setLoading(true);
          }}>
          <Text className="text-white">Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  // Renderizar el componente correspondiente según el estado
  return (
    <View className="flex-1">
      {status !== null && status < 3 ? <CarValidations carID={carID} /> : <MyCar carID={carID} />}
    </View>
  );
}
