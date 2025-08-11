import { useLocalSearchParams } from 'expo-router';
import MyCarScreen from 'components/screens/MyCarScreen';
import { View } from 'react-native';

export default function MyCarPage() {
  const { id } = useLocalSearchParams();

  return (
    <View className="py-20">
      <MyCarScreen carID={id as string} />
    </View>
  );
}
