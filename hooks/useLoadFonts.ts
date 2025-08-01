import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export function useLoadFonts() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    async function load() {
      await Font.loadAsync({
        'Poppins': require('../assets/fonts/Poppins-Light.ttf'),
        'CalSans': require('../assets/fonts/CalSans-Regular.ttf'),
      });
      setLoaded(true);
    }
    load();
  }, []);
  return loaded;
}
