import { useEffect, useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CarService } from 'services/cars.service';
import LoadingView from 'components/ui/LoadingView';
import ErrorView from 'components/ui/ErrorView';
import { CarSchema } from 'interfaces/cars.chemas';
import EmptyCars from './EmptyCar';
import CarsList from './CarsList';

const carService = new CarService();

type Props = {
  user_id: string;
};

export const GetCarsForOwner = ({ user_id }: Props) => {
  const [cars, setCars] = useState<CarSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAddCar = () => {
    router.push('./create-car');
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await carService.getCarsForOwner(user_id);
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

    fetchCars();
  }, [user_id]);

  if (loading) return <LoadingView />;
  if (error) return <ErrorView />;
  if (cars.length === 0) return <EmptyCars />;

  return (
    <View className="flex-1 justify-center space-y-6 px-4">
      <Text className="text-center font-head text-2xl">Mis carros</Text>
      <View className="items-center">
        <Pressable
          onPress={handleAddCar}
          className="flex-row items-center rounded-xl bg-blue-600 px-4 py-2 shadow-md active:opacity-80">
          <AntDesign name="plus" size={18} color="white" />
          <Text className="ml-2 text-base font-semibold text-white">Agregar carro</Text>
        </Pressable>
      </View>
      <View>
        <CarsList cars={cars} />
      </View>
    </View>
  );
};
