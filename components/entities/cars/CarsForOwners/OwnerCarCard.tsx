import { noCarImage } from 'constants/cars';
import { router } from 'expo-router';
import { CarSchema } from 'interfaces/cars.chemas';
import { View, Image, Text, Pressable } from 'react-native';

interface CarCardProps {
  car: CarSchema;
}

export const OneOwnerCarCard = ({ car }: CarCardProps) => {
  const imageSource =
    car.mainImage && car.mainImage.trim() !== '' ? { uri: car.mainImage } : noCarImage;

  return (
    <Pressable
      onPress={() => router.push(`./my-car/${car.id}`)}
      style={({ pressed }) => [
        {
          transform: [{ scale: pressed ? 0.98 : 1 }],
          opacity: pressed ? 0.9 : 1,
        },
      ]}>
      <View className="m-2 w-[205px] overflow-hidden rounded-2xl bg-white shadow-md transition-transform duration-300 hover:scale-[1.02]">
        <View className="relative">
          <Image
            source={imageSource}
            className="h-[160px] w-full"
            resizeMode="cover"
            style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16, height: 180, width: 205 }}
          />
          <View className="absolute left-3 top-3 rounded-full bg-tag px-3 py-1">
            <Text className="font-body text-xs text-bodytxt">{car.type}</Text>
          </View>
        </View>

        <View className="px-4 py-3">
          <Text className="font-head text-lg text-gray-800">
            {car.brand} {car.model}
          </Text>
          <Text className="mt-1 font-body text-sm text-gray-500">{car.year}</Text>

          <View className="mt-3 flex-row items-center justify-between">
            <Text className="font-head text-sm text-primary">{car.transmission_type}</Text>
            <Text className="font-head text-sm text-gray-800">${car.price} /día</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
