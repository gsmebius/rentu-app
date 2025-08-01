import { CarSchema } from 'interfaces/cars.chemas';
import { View, Image, Text } from 'react-native';

interface CarCardProps {
  car: CarSchema;
}

export const CarCard = ({ car }: CarCardProps) => {
  return (
    <View>
      <View>
        <Image source={{ uri: car.mainImage }} />
      </View>
      <View>
        <Text>Categoría, calificación</Text>
      </View>
      <View>
        <Text>Toyota, Corolla</Text>
        <View>{car.price}</View>
      </View>
    </View>
  );
};
