// import { useEffect, useState } from 'react';
// import { View } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useAuth, getUserStatusFromService } from 'auth/AuthContext';
// import LoadingView from 'components/ui/LoadingView';
// import ProfileValidation1 from './ProfileValidation1';
// import ProfileValidation2 from './ProfileValidation2';
// import ProfileValidation3 from './ProfileValidation3';

// export default function ProfileValidationView() {
//   const { user } = useAuth();
//   const router = useRouter();
//   const [step, setStep] = useState<number | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const initializeStep = async () => {
//       if (!user?.id) return;

//       try {
//         const status = await getUserStatusFromService(user.id);

//         if (status === 3) {
//           router.replace('/profile');
//         } else if (status !== null && [0, 1, 2].includes(status)) {
//           setStep(status + 1); // status 0 → step 1, status 1 → step 2, etc.
//         } else {
//           // fallback a paso inicial si status no es válido
//           setStep(1);
//         }
//       } catch (error) {
//         console.error('Error al obtener el estado del usuario:', error);
//         setStep(1);
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeStep();
//   }, [router, user]);

//   const handleNext = () => {
//     if (step === 3) {
//       router.replace('/profile');
//     } else {
//       setStep((prev) => (prev ?? 1) + 1);
//     }
//   };

//   if (loading || !user || step === null) {
//     return <LoadingView />;
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       {step === 1 && (
//         <ProfileValidation1 userId={user.id} onNext={handleNext} onValidationSuccess={handleNext} />
//       )}
//       {step === 2 && (
//         <ProfileValidation2 userId={user.id} onNext={handleNext} onValidationSuccess={handleNext} />
//       )}
//       {step === 3 && <ProfileValidation3 onNext={handleNext} />}
//     </View>
//   );
// }

import { useEffect, useState } from 'react';
import { View, Alert, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth, getUserStatusFromService } from 'auth/AuthContext';
import LoadingView from 'components/ui/LoadingView';
import ProfileValidation1 from './ProfileValidation1';
import ProfileValidation3 from './ProfileValidation3';
import ProfileValidation2 from './ProfileValidation2';

export default function ProfileValidationView() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Estado para mensaje de error visible en pantalla
  const [validationErrorMessage, setValidationErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const initializeStep = async () => {
      if (!user?.id) return;

      try {
        const status = await getUserStatusFromService(user.id);

        if (status === 3) {
          router.replace('/profile');
        } else if (status !== null && [0, 1, 2].includes(status)) {
          setStep(status + 1);
        } else {
          setStep(1); // fallback si status no es válido
        }
      } catch (error) {
        console.error('Error al obtener el estado del usuario:', error);
        setStep(1);
      } finally {
        setLoading(false);
      }
    };

    initializeStep();
  }, [router, user]);

  const handleValidationSuccess = () => {
    setValidationErrorMessage(null); // Limpiar error al avanzar
    if (step === 3) {
      router.replace('/profile');
    } else {
      setStep((prev) => (prev ?? 1) + 1);
    }
  };

  const handleValidationError = (error?: any) => {
    // Guardar mensaje en estado para mostrarlo en pantalla
    const message =
      typeof error === 'string' ? error : 'Ocurrió un error, verifica tus datos e intentalo de nuevo.';
    setValidationErrorMessage(message);

    // Además mostrar alerta tradicional (opcional)
    Alert.alert('Error en validación', message);
  };

  if (loading || !user || step === null) {
    return <LoadingView />;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Mostrar mensaje de error en pantalla */}
      {validationErrorMessage && (
        <View
          style={{
            backgroundColor: '#f8d7da',
            padding: 10,
            marginBottom: 12,
            borderRadius: 8,
            borderColor: '#f5c2c7',
            borderWidth: 1,
          }}
        >
          <Text style={{ color: '#842029', fontWeight: 'bold' }}>
            {validationErrorMessage}
          </Text>
        </View>
      )}

      {step === 1 && (
        <ProfileValidation1
          userId={user.id}
          onValidationSuccess={handleValidationSuccess}
          onValidationError={handleValidationError}
        />
      )}
      {step === 2 && (
        <ProfileValidation2
          userId={user.id}
          onValidationSuccess={handleValidationSuccess}
          onValidationError={handleValidationError}
        />
      )}
      {step === 3 && (
        <ProfileValidation3
          onValidationSuccess={handleValidationSuccess}
          onValidationError={handleValidationError}
          onNext={() => {}} // opcional, si quieres mantener onNext
        />
      )}
    </View>
  );
}
