
import { GetAllCars } from 'components/entities/cars/CarsForClients/GetAllCars';
import { View } from 'react-native';

export default function Home() {
  return (
    <View className='p-4'>
      <GetAllCars />
    </View>
  );
}
