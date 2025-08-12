import CarValidations from 'components/entities/cars/CreateCar/CarValidations';
import MyCar from 'components/entities/cars/UpdateCar/MyCar';
import ErrorView from 'components/ui/ErrorView';
import LoadingView from 'components/ui/LoadingView';
import { useState, useEffect } from 'react';
import { View } from 'react-native';
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

  if (loading) return <LoadingView />;
  if (error) return <ErrorView />;

  return (
    <View className="flex-1">
      {status !== null && status < 3 ? <CarValidations carID={carID} /> : <MyCar carID={carID} />}
    </View>
  );
}
