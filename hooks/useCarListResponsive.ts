import { useWindowDimensions } from 'react-native';

export const useResponsiveColumns = () => {
  const { width } = useWindowDimensions();

  if (width < 380) return 1;         // Móvil pequeño
  if (width < 690) return 2;   
  if (width < 920) return 3;        // Móvil grande o tablet chica
  if (width < 1110) return 4;        // Tablet grande o escritorio pequeño
  if (width < 1350) return 5;        // Escritorio medio
  return 6;                          // Escritorio grande
};
