import { noCarImage } from 'constants/cars';
import { CarSchema } from 'interfaces/cars.chemas';
import { View, Image, Text } from 'react-native';

interface CarCardProps {
  car: CarSchema;
}

export const CarCard = ({ car }: CarCardProps) => {
  const imageSource =
    car.mainImage && car.mainImage.trim() !== '' ? { uri: car.mainImage } : noCarImage;
  return (
    <View className="m-2 h-[280px] w-[200px] rounded-md shadow-sm hover:scale-[1.08] duration-700">
      <View className="relative">
        <Image
          source={imageSource}
          className="h-[210px] w-[200px] rounded-md"
          // forzar imagen remota como local
          style={{ height: 210, width: 200 }}
          resizeMode="cover"
        />
        <View className="bg-tag absolute left-2 top-2 rounded-full px-2 py-1">
          <Text className="font-head text-xs text-bodytxt">{car.type}</Text>
        </View>
      </View>
      <View className="flex-1 justify-center">
        <View className="mt-1 px-2">
          <Text className="text-md font-head">
            {car.brand}, {car.model}, {car.year}
          </Text>
        </View>
        <View className="flex-2 flex flex-row">
          <Text className="text-12 mt-1 px-2 font-head text-primary">
            {car.transmission_type}, ${car.price} diarios
          </Text>
        </View>
      </View>
    </View>
  );
};
