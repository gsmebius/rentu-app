import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { CarService } from 'services/cars.service';
import LoadingView from 'components/ui/LoadingView';
import ErrorView from 'components/ui/ErrorView';
import { CarSchema } from 'interfaces/cars.chemas';
import EmptyCars from '../EmptyCar';
import CarsList from './CarsList';

const carService = new CarService();

export const GetAllCars = () => {
  const [cars, setCars] = useState<CarSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await carService.getAllCars();
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data: { cars: CarSchema[] } = await response.json();
        setCars(data.cars);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, []);

  if (loading) {
    return <LoadingView />;
  }
  if (error) {
    return <ErrorView />;
  }
  if (cars.length === 0) {
    return <EmptyCars />;
  }

  return (
    <View>
      <CarsList cars={cars} />
    </View>
  );
};
