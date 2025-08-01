// components/Navbar.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function Navbar() {

  return (
    <View>
      <Text>MyApp</Text>

      <View>
        <Link href="/" asChild>
          <TouchableOpacity>
            <Text>Inicio</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/about" asChild>
          <TouchableOpacity>
            <Text>About</Text>
          </TouchableOpacity>
        </Link>

      </View>
    </View>
  );
}
