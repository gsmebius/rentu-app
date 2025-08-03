import { useWindowDimensions } from 'react-native';

export const useResponsiveColumns = () => {
  const { width } = useWindowDimensions();

  if (width < 380) return 1;         // Móvil pequeño
  if (width < 710) return 2;   
  if (width < 950) return 3;        // Móvil grande o tablet chica
  if (width < 1110) return 3;        // Tablet grande o escritorio pequeño
  if (width < 1350) return 4;        // Escritorio medio
  return 5;                          // Escritorio grande
};
