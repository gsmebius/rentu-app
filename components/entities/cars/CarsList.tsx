import { useResponsiveColumns } from 'hooks/useCarListResponsive';
import { FlatList, View } from 'react-native';
import { CarSchema } from 'interfaces/cars.chemas';
import { OneCarCard } from './CarCard';

interface CarCardProps {
  cars: CarSchema[];
}

export default function CarsList({ cars }: CarCardProps) {
  const numColumns = useResponsiveColumns();

  return (
    <View className="grid items-center justify-center ">
      <FlatList
        data={cars}
        key={numColumns}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <View className="p-1">
            <OneCarCard car={item} />
          </View>
        )}
        columnWrapperStyle={{
          justifyContent: 'flex-start',
        }}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}
