import { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { CarService } from 'services/cars.service';
import CarValidationStep2 from './CreateCarRules';
import CarValidationStep3 from './CreateCarFiles';

interface Props {
  carID: string;
}

type CarStatus = 1 | 2 | 3;

export default function CarValidations({ carID }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<CarStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener el estado actual del carro
  useEffect(() => {
    const fetchCarStatus = async () => {
      try {
        setLoading(true);
        const carService = new CarService();
        const response = await carService.getCarStatusByID(Number(carID));

        if (!response.ok) {
          throw new Error('No se pudo obtener el estado del carro');
        }

        const data = await response.json();
        const carStatus = data.status as CarStatus;

        if (carStatus >= 3) {
          router.replace(`./my-car/${carID}`);
          return;
        }

        setStatus(carStatus);
      } catch (err: any) {
        setError(err.message || 'Error al cargar el estado del carro');
      } finally {
        setLoading(false);
      }
    };

    fetchCarStatus();
  }, [carID]);

  const handleStepSuccess = () => {
    const nextStatus = ((status || 1) + 1) as CarStatus;
    setStatus(nextStatus);

    if (nextStatus >= 3) {
      router.replace(`/my-car/${carID}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setLoading(true);
          }}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.flex1}>
      {status === 1 && <CarValidationStep2 carID={carID} onSuccess={handleStepSuccess} />}
      {status === 2 && <CarValidationStep3 carID={carID} onSuccess={handleStepSuccess} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
  errorText: {
    color: '#ef4444',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonText: {
    color: 'white',
  },
});
