import { useAuth } from 'auth/AuthContext';
import { GetCarsForOwner } from 'components/entities/cars/CarsForOwners/GetCarsForOwner';
import { View } from 'react-native';

export default function MyCarsScreen() {
  const { user } = useAuth();
  const userId = String(user?.id);


  return (
    <View className="py-20">
      <GetCarsForOwner user_id={userId} />
    </View>
  );
}