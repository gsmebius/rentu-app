import { useAuth } from 'auth/AuthContext';
import { View, Text} from 'react-native';

export default function MyCar() {
  const { user } = useAuth();
  const userId = String(user?.id);


  return (
    <View className="py-20">
      <Text>My Car, and my userID is: {userId}</Text>
    </View>
  );
}