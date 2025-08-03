// import { noCarImage } from 'constants/cars';
// import { CarSchema } from 'interfaces/cars.chemas';
// import { View, Image, Text } from 'react-native';

// interface CarCardProps {
//   car: CarSchema;
// }

// export const CarCard = ({ car }: CarCardProps) => {
//   const imageSource =
//     car.mainImage && car.mainImage.trim() !== '' ? { uri: car.mainImage } : noCarImage;
//   return (
//     <View className="m-2 h-[280px] w-[200px] rounded-md shadow-sm hover:scale-[1.08] duration-700">
//       <View className="relative">
//         <Image
//           source={imageSource}
//           className="h-[210px] w-[200px] rounded-md"
//           // forzar imagen remota como local
//           style={{ height: 210, width: 200 }}
//           resizeMode="cover"
//         />
//         <View className="bg-tag absolute left-2 top-2 rounded-full px-2 py-1">
//           <Text className="font-head text-xs text-bodytxt">{car.type}</Text>
//         </View>
//       </View>
//       <View className="flex-1 justify-center">
//         <View className="mt-1 px-2">
//           <Text className="text-md font-head">
//             {car.brand}, {car.model}, {car.year}
//           </Text>
//         </View>
//         <View className="flex-2 flex flex-row">
//           <Text className="text-12 mt-1 px-2 font-head text-primary">
//             {car.transmission_type}, ${car.price} diarios
//           </Text>
//         </View>
//       </View>
//     </View>
//   );
// };

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
    <View className="m-2 w-[205px] overflow-hidden rounded-2xl bg-white shadow-md transition-transform duration-300 hover:scale-[1.02]">
      <View className="relative">
        <Image
          source={imageSource}
          className="h-[160px] w-full"
          resizeMode="cover"
          style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16, height: 180, width: 205 }}
        />
        <View className="bg-tag absolute left-3 top-3 rounded-full px-3 py-1">
          <Text className="text-xs font-medium text-bodytxt">{car.type}</Text>
        </View>
      </View>

      <View className="px-4 py-3">
        <Text className="text-lg font-semibold text-gray-800">
          {car.brand} {car.model}
        </Text>
        <Text className="mt-1 text-sm text-gray-500">{car.year}</Text>

        <View className="mt-3 flex-row items-center justify-between">
          <Text className="text-sm font-medium text-primary">{car.transmission_type}</Text>
          <Text className="text-sm font-semibold text-gray-800">${car.price} /día</Text>
        </View>
      </View>
    </View>
  );
};
