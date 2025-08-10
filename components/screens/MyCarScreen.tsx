import MyCar from 'components/entities/cars/UpdateCar/MyCar';
import { View } from 'react-native';

export default function MyCarScreen() {

  return (
    <View className="py-20">
      <MyCar carID={'58'}/>
    </View>
  );
}