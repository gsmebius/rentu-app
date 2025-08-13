// import { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Pressable, // ¡Ahora solo importamos Pressable!
//   Switch,
//   Alert,
//   ActivityIndicator,
//   ScrollView,
//   Modal,
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import { Calendar } from 'react-native-calendars';
// import { CarService } from 'services/cars.service';
// import { createCarRules } from 'interfaces/cars.chemas';
// import { carPrices } from 'constants/cars';

// interface Props {
//   carID: string;
//   visible: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// interface DayPressEvent {
//   dateString: string;
//   day: number;
//   month: number;
//   year: number;
//   timestamp?: number;
// }

// interface Place {
//   id: number;
//   name: string;
// }

// interface UnavailableDay {
//   id: number;
//   date: string;
// }

// interface CarPlace {
//   id: number; // car_place id (para delete)
//   place_id: number;
// }

// export default function EditCarStep2Modal({ carID, visible, onClose, onSuccess }: Props) {
//   const [form, setForm] = useState<createCarRules>({
//     international_use: false,
//     price: 0,
//     enable: false,
//     capacity: 1,
//     unavailableDates: [],
//     places: [],
//   });

//   const [loading, setLoading] = useState(false);
//   const [placesLoading, setPlacesLoading] = useState(false);
//   const [carLoading, setCarLoading] = useState(false);
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [errors, setErrors] = useState<Record<string, boolean>>({});
//   const [placesList, setPlacesList] = useState<Place[]>([]);
//   const [unavailableDaysList, setUnavailableDaysList] = useState<UnavailableDay[]>([]);
//   const [carPlacesList, setCarPlacesList] = useState<CarPlace[]>([]);

//   const updateField = (field: keyof createCarRules, value: any) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//     setErrors((prev) => ({ ...prev, [field]: false }));
//   };

//   const togglePlace = (placeID: number) => {
//     if (form.places.includes(placeID)) {
//       updateField(
//         'places',
//         form.places.filter((id) => id !== placeID)
//       );
//     } else {
//       updateField('places', [...form.places, placeID]);
//     }
//   };

//   const fetchPlaces = async () => {
//     setPlacesLoading(true);
//     try {
//       const carService = new CarService();
//       const response = await carService.getPlacesForCar();

//       if (!response.ok) {
//           throw new Error('Error al obtener los lugares');
//       }

//       const data = await response.json();
//       const list: Place[] = data.places ?? data;
//       setPlacesList(list);
//     } catch {
//       Alert.alert('Error', 'No se pudieron cargar los lugares disponibles');
//     } finally {
//       setPlacesLoading(false);
//     }
//   };

//   const fetchCar = async () => {
//     setCarLoading(true);
//     try {
//       const carService = new CarService();
//       const data = await carService.getCarByID(carID);

//       if (!data.car) {
//         throw new Error('Carro no encontrado');
//       }

//       const car = data.car;

//       updateField('international_use', car.international_use ?? false);
//       updateField('price', car.price ?? 0);
//       updateField('enable', car.enable ?? false);
//       updateField('capacity', car.capacity ?? 1);

//       const unavailableDatesParsed = (car.car_unavailability_days ?? []).map(
//         (d: UnavailableDay) => new Date(d.date)
//       );
//       updateField('unavailableDates', unavailableDatesParsed);
//       setUnavailableDaysList(car.car_unavailability_days ?? []);

//       const selectedPlaceIDs = (car.car_places ?? []).map((cp: CarPlace) => cp.place_id);
//       updateField('places', selectedPlaceIDs);
//       setCarPlacesList(car.car_places ?? []);
//     } catch (error: any) {
//       Alert.alert('Error', error?.message || 'No se pudo cargar la info del carro');
//     } finally {
//       setCarLoading(false);
//     }
//   };

//   const [markedDates, setMarkedDates] = useState<{ [key: string]: { selected: boolean } }>({});

//   useEffect(() => {
//     const marked: { [key: string]: { selected: boolean } } = {};
//     form.unavailableDates.forEach((d) => {
//       const dateStr = d.toISOString().split('T')[0];
//       marked[dateStr] = { selected: true };
//     });
//     setMarkedDates(marked);
//   }, [form.unavailableDates]);

//   const onDayPress = (day: DayPressEvent) => {
//     const dateStr = day.dateString;
//     const date = new Date(dateStr);
//     const newMarkedDates = { ...markedDates };

//     if (markedDates[dateStr]) {
//       delete newMarkedDates[dateStr];
//       updateField(
//         'unavailableDates',
//         form.unavailableDates.filter((d) => d.toISOString().split('T')[0] !== dateStr)
//       );
//     } else {
//       newMarkedDates[dateStr] = { selected: true };
//       updateField('unavailableDates', [...form.unavailableDates, date]);
//     }
//     setMarkedDates(newMarkedDates);
//   };

//   const handleRemoveDate = async (date: Date) => {
//     const dateStr = date.toISOString().split('T')[0];
//     const dayToDelete = unavailableDaysList.find((d) => d.date.startsWith(dateStr));

//     if (!dayToDelete) {
//       Alert.alert('Error', 'No se encontró la fecha para eliminar');
//       return;
//     }

//     setLoading(true);
//     try {
//       const carService = new CarService();
//       await carService.deleteUnavailableDays(dayToDelete.id);

//       setUnavailableDaysList((prev) => prev.filter((d) => d.id !== dayToDelete.id));
//       updateField(
//         'unavailableDates',
//         form.unavailableDates.filter((d) => d.toISOString().split('T')[0] !== dateStr)
//       );
//       setMarkedDates((prev) => {
//         const copy = { ...prev };
//         delete copy[dateStr];
//         return copy;
//       });
//       Alert.alert('Éxito', 'Fecha eliminada correctamente');
//     } catch {
//       Alert.alert('Error', 'No se pudo eliminar la fecha');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRemovePlace = async (placeID: number) => {
//     const carPlace = carPlacesList.find((cp) => cp.place_id === placeID);
//     if (!carPlace) {
//       togglePlace(placeID);
//       return;
//     }

//     setLoading(true);
//     try {
//       const carService = new CarService();
//       await carService.deleteCarPlace(carPlace.id);

//       setCarPlacesList((prev) => prev.filter((cp) => cp.id !== carPlace.id));
//       updateField(
//         'places',
//         form.places.filter((id) => id !== placeID)
//       );
//       Alert.alert('Éxito', 'Lugar eliminado correctamente');
//     } catch {
//       Alert.alert('Error', 'No se pudo eliminar el lugar');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     const newErrors: Record<string, boolean> = {};
//     if (!form.places.length) newErrors.places = true;
//     if (!form.price || form.price <= 0) newErrors.price = true;
//     if (!form.capacity || form.capacity <= 0) newErrors.capacity = true;

//     setErrors(newErrors);
//     if (Object.values(newErrors).some(Boolean)) {
//       Alert.alert('Error', 'Por favor completa todos los campos obligatorios correctamente.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const carService = new CarService();
//       const payload = {
//         ...form,
//         unavailableDates: form.unavailableDates.map((d) => d.toISOString()),
//       };
//       await carService.createCarStep2(carID, payload);
//       Alert.alert('Éxito', 'Carro actualizado correctamente.');
//       onSuccess();
//     } catch (error: any) {
//       Alert.alert('Error', error?.message || 'No se pudo actualizar el carro.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (visible) {
//       fetchPlaces();
//       fetchCar();
//     }
//   }, [visible]);

//   if (carLoading) {
//     return (
//       <Modal visible={visible} transparent animationType="slide">
//         <View className="flex-1 items-center justify-center bg-black/50">
//           <View className="w-4/5 rounded-xl bg-white p-6">
//             <ActivityIndicator size="large" />
//             <Text className="mt-4 text-center">Cargando información...</Text>
//           </View>
//         </View>
//       </Modal>
//     );
//   }

//   return (
//     <Modal visible={visible} transparent animationType="slide">
//       <View className="flex-1 items-center justify-center bg-black/50">
//         <View className="max-h-[90%] w-4/5 rounded-xl bg-white">
//           <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//             <View className="p-6">
//               <Text className="mb-4 text-center font-head text-2xl text-gray-800">
//                 Editar reglas del carro
//               </Text>

//               <View className="mb-4 flex-row items-center justify-between">
//                 <Text className="font-body text-gray-800">Permitir uso internacional</Text>
//                 <Switch
//                   value={form.international_use}
//                   onValueChange={(value) => updateField('international_use', value)}
//                 />
//               </View>

//               <Text className="mb-2 font-body text-gray-800">Precio diario</Text>
//               <View
//                 className={`mb-4 rounded-xl border ${
//                   errors.price ? 'border-red-500' : 'border-gray-300'
//                 }`}>
//                 <Picker
//                   selectedValue={(form.price ?? 0).toString()}
//                   onValueChange={(value) => updateField('price', Number(value))}>
//                   <Picker.Item label="Selecciona un precio" value="0" />
//                   {carPrices.map((price) => (
//                     <Picker.Item key={price} label={`$${price}`} value={price.toString()} />
//                   ))}
//                 </Picker>
//               </View>

//               <View className="mb-4 flex-row items-center justify-between">
//                 <Text className="font-body text-gray-800">Habilita tu carro desde ya</Text>
//                 <Switch value={form.enable} onValueChange={(value) => updateField('enable', value)} />
//               </View>

//               <Text className="mb-2 font-body text-gray-800">Número de pasajeros permitidos</Text>
//               <TextInput
//                 placeholder="Ej: 5"
//                 keyboardType="numeric"
//                 value={(form.capacity ?? 0).toString()}
//                 onChangeText={(text) => {
//                   const num = Number(text);
//                   if (!isNaN(num) && num > 0) updateField('capacity', num);
//                   else updateField('capacity', 0);
//                 }}
//                 className={`mb-4 rounded-xl border px-4 py-3 ${
//                   errors.capacity ? 'border-red-500' : 'border-gray-300'
//                 }`}
//               />

//               <Text className="mb-2 font-body text-gray-800">Escoge los lugares disponibles</Text>
//               <View
//                 className={`mb-4 rounded-xl border px-4 py-3 ${
//                   errors.places ? 'border-red-500' : 'border-gray-300'
//                 }`}>
//                 {placesLoading ? (
//                   <ActivityIndicator />
//                 ) : (
//                   placesList.map((place) => {
//                     const isSelected = form.places.includes(place.id);
//                     return (
//                       <View key={place.id} className="mb-2 flex-row items-center justify-between">
//                         <Pressable
//                           onPress={() => {
//                             if (isSelected) {
//                               handleRemovePlace(place.id);
//                             } else {
//                               togglePlace(place.id);
//                             }
//                           }}
//                           className="flex-row items-center"
//                         >
//                           <View
//                             className={`mr-3 h-5 w-5 rounded border ${
//                               isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-400'
//                             }`}
//                           />
//                           <Text>{place.name}</Text>
//                         </Pressable>
//                       </View>
//                     );
//                   })
//                 )}
//               </View>

//               <Text className="mb-2 font-body text-gray-800">Fechas NO disponibles</Text>
//               <Pressable
//                 onPress={() => setShowCalendar((v) => !v)}
//                 className="mb-4 rounded-xl bg-blue-600 py-3">
//                 <Text className="text-center text-white">
//                   {showCalendar ? 'Ocultar calendario' : 'Mostrar calendario'}
//                 </Text>
//               </Pressable>

//               {showCalendar && (
//                 <Calendar onDayPress={onDayPress} markedDates={markedDates} markingType="period" />
//               )}

//               {form.unavailableDates.length > 0 && (
//                 <View className="mb-4">
//                   {form.unavailableDates.map((d, i) => (
//                     <View key={i} className="mb-2 flex-row items-center justify-between">
//                       <Text>{d.toISOString().split('T')[0]}</Text>
//                       <Pressable onPress={() => handleRemoveDate(d)}>
//                         <Text className="text-red-500">Eliminar</Text>
//                       </Pressable>
//                     </View>
//                   ))}
//                 </View>
//               )}

//               <View className="mt-4 flex-row justify-between">
//                 <Pressable onPress={onClose} className="rounded-xl bg-gray-300 px-6 py-3">
//                   <Text className="font-semibold">Cancelar</Text>
//                 </Pressable>

//                 <Pressable
//                   onPress={handleSubmit}
//                   disabled={loading}
//                   className={`rounded-xl px-6 py-3 ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}>
//                   {loading ? (
//                     <ActivityIndicator color="#fff" />
//                   ) : (
//                     <Text className="font-semibold text-white">Guardar</Text>
//                   )}
//                 </Pressable>
//               </View>
//             </View>
//           </ScrollView>
//         </View>
//       </View>
//     </Modal>
//   );
// }

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Switch,
  Alert,
  ActivityIndicator,
  ScrollView,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';
import { CarService } from 'services/cars.service';
import { createCarRules } from 'interfaces/cars.chemas';
import { carPrices } from 'constants/cars';

interface Props {
  carID: string;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface DayPressEvent {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp?: number;
}

interface Place {
  id: number;
  name: string;
}

interface UnavailableDay {
  id: number;
  date: string;
}

interface CarPlace {
  id: number; // car_place id (para delete)
  place_id: number;
}

export default function EditCarStep2Modal({ carID, visible, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<createCarRules>({
    international_use: false,
    price: 0,
    enable: false,
    capacity: 1,
    unavailableDates: [],
    places: [],
  });

  const [loading, setLoading] = useState(false);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [carLoading, setCarLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [placesList, setPlacesList] = useState<Place[]>([]);
  const [unavailableDaysList, setUnavailableDaysList] = useState<UnavailableDay[]>([]);
  const [carPlacesList, setCarPlacesList] = useState<CarPlace[]>([]);

  const updateField = (field: keyof createCarRules, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const togglePlace = (placeID: number) => {
    if (form.places.includes(placeID)) {
      updateField(
        'places',
        form.places.filter((id) => id !== placeID)
      );
    } else {
      updateField('places', [...form.places, placeID]);
    }
  };

  const fetchPlaces = async () => {
    setPlacesLoading(true);
    try {
      const carService = new CarService();
      const response = await carService.getPlacesForCar();

      if (!response.ok) {
        throw new Error('Error al obtener los lugares');
      }

      const data = await response.json();
      const list: Place[] = data.places ?? data;
      setPlacesList(list);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar los lugares disponibles');
    } finally {
      setPlacesLoading(false);
    }
  };

  const fetchCar = async () => {
    setCarLoading(true);
    try {
      const carService = new CarService();
      const data = await carService.getCarByID(carID);

      if (!data.car) {
        throw new Error('Carro no encontrado');
      }

      const car = data.car;

      updateField('international_use', car.international_use ?? false);
      updateField('price', car.price ?? 0);
      updateField('enable', car.enable ?? false);
      updateField('capacity', car.capacity ?? 1);

      const unavailableDatesParsed = (car.car_unavailability_days ?? []).map(
        (d: UnavailableDay) => new Date(d.date)
      );
      updateField('unavailableDates', unavailableDatesParsed);
      setUnavailableDaysList(car.car_unavailability_days ?? []);

      const selectedPlaceIDs = (car.car_places ?? []).map((cp: CarPlace) => cp.place_id);
      updateField('places', selectedPlaceIDs);
      setCarPlacesList(car.car_places ?? []);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'No se pudo cargar la info del carro');
    } finally {
      setCarLoading(false);
    }
  };

  const [markedDates, setMarkedDates] = useState<{ [key: string]: { selected: boolean } }>({});

  useEffect(() => {
    const marked: { [key: string]: { selected: boolean } } = {};
    form.unavailableDates.forEach((d) => {
      const dateStr = d.toISOString().split('T')[0];
      marked[dateStr] = { selected: true };
    });
    setMarkedDates(marked);
  }, [form.unavailableDates]);

  const onDayPress = (day: DayPressEvent) => {
    const dateStr = day.dateString;
    const date = new Date(dateStr);
    const newMarkedDates = { ...markedDates };

    if (markedDates[dateStr]) {
      delete newMarkedDates[dateStr];
      updateField(
        'unavailableDates',
        form.unavailableDates.filter((d) => d.toISOString().split('T')[0] !== dateStr)
      );
    } else {
      newMarkedDates[dateStr] = { selected: true };
      updateField('unavailableDates', [...form.unavailableDates, date]);
    }
    setMarkedDates(newMarkedDates);
  };

  const handleRemoveDate = async (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayToDelete = unavailableDaysList.find((d) => d.date.startsWith(dateStr));

    if (!dayToDelete) {
      Alert.alert('Error', 'No se encontró la fecha para eliminar');
      return;
    }

    setLoading(true);
    try {
      const carService = new CarService();
      // Usando el servicio de eliminación de fechas no disponibles
      await carService.deleteUnavailableDays(dayToDelete.id);

      setUnavailableDaysList((prev) => prev.filter((d) => d.id !== dayToDelete.id));
      updateField(
        'unavailableDates',
        form.unavailableDates.filter((d) => d.toISOString().split('T')[0] !== dateStr)
      );
      setMarkedDates((prev) => {
        const copy = { ...prev };
        delete copy[dateStr];
        return copy;
      });
      Alert.alert('Éxito', 'Fecha eliminada correctamente');
    } catch {
      Alert.alert('Error', 'No se pudo eliminar la fecha');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePlace = async (placeID: number) => {
    const carPlace = carPlacesList.find((cp) => cp.place_id === placeID);

    if (!carPlace) {
      // Si no se encuentra en la lista actual, solo se remueve del estado local
      togglePlace(placeID);
      return;
    }

    setLoading(true);
    try {
      const carService = new CarService();
      // Usando el servicio de eliminación de lugares
      await carService.deleteCarPlace(carPlace.id);

      setCarPlacesList((prev) => prev.filter((cp) => cp.id !== carPlace.id));
      updateField(
        'places',
        form.places.filter((id) => id !== placeID)
      );
      Alert.alert('Éxito', 'Lugar eliminado correctamente');
    } catch {
      Alert.alert('Error', 'No se pudo eliminar el lugar');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, boolean> = {};
    if (!form.places.length) newErrors.places = true;
    if (!form.price || form.price <= 0) newErrors.price = true;
    if (!form.capacity || form.capacity <= 0) newErrors.capacity = true;

    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios correctamente.');
      return;
    }

    setLoading(true);
    try {
      const carService = new CarService();
      const payload = {
        ...form,
        unavailableDates: form.unavailableDates.map((d) => d.toISOString()),
      };
      await carService.updateCarRules(carID, payload);
      Alert.alert('Éxito', 'Carro actualizado correctamente.');
      onSuccess();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'No se pudo actualizar el carro.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchPlaces();
      fetchCar();
    }
  }, [visible]);

  if (carLoading) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="w-4/5 rounded-xl bg-white p-6">
            <ActivityIndicator size="large" />
            <Text className="mt-4 text-center">Cargando información...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="max-h-[90%] w-4/5 rounded-xl bg-white">
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className="p-6">
              <Text className="mb-4 text-center font-head text-2xl text-gray-800">
                Editar reglas del carro
              </Text>

              <View className="mb-4 flex-row items-center justify-between">
                <Text className="font-body text-gray-800">Permitir uso internacional</Text>
                <Switch
                  value={form.international_use}
                  onValueChange={(value) => updateField('international_use', value)}
                />
              </View>

              <Text className="mb-2 font-body text-gray-800">Precio diario</Text>
              <View
                className={`mb-4 rounded-xl border ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}>
                <Picker
                  selectedValue={(form.price ?? 0).toString()}
                  onValueChange={(value) => updateField('price', Number(value))}>
                  <Picker.Item label="Selecciona un precio" value="0" />
                  {carPrices.map((price) => (
                    <Picker.Item key={price} label={`$${price}`} value={price.toString()} />
                  ))}
                </Picker>
              </View>

              <View className="mb-4 flex-row items-center justify-between">
                <Text className="font-body text-gray-800">Habilita tu carro desde ya</Text>
                <Switch
                  value={form.enable}
                  onValueChange={(value) => updateField('enable', value)}
                />
              </View>

              <Text className="mb-2 font-body text-gray-800">Número de pasajeros permitidos</Text>
              <TextInput
                placeholder="Ej: 5"
                keyboardType="numeric"
                value={(form.capacity ?? 0).toString()}
                onChangeText={(text) => {
                  const num = Number(text);
                  if (!isNaN(num) && num > 0) updateField('capacity', num);
                  else updateField('capacity', 0);
                }}
                className={`mb-4 rounded-xl border px-4 py-3 ${
                  errors.capacity ? 'border-red-500' : 'border-gray-300'
                }`}
              />

              <Text className="mb-2 font-body text-gray-800">Escoge los lugares disponibles</Text>
              <View
                className={`mb-4 rounded-xl border px-4 py-3 ${
                  errors.places ? 'border-red-500' : 'border-gray-300'
                }`}>
                {placesLoading ? (
                  <ActivityIndicator />
                ) : (
                  placesList.map((place) => {
                    const isSelected = form.places.includes(place.id);
                    return (
                      <View key={place.id} className="mb-2 flex-row items-center justify-between">
                        <Pressable
                          onPress={() => {
                            if (isSelected) {
                              handleRemovePlace(place.id);
                            } else {
                              togglePlace(place.id);
                            }
                          }}
                          className="flex-row items-center">
                          <View
                            className={`mr-3 h-5 w-5 rounded border ${
                              isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-400'
                            }`}
                          />
                          <Text>{place.name}</Text>
                        </Pressable>
                      </View>
                    );
                  })
                )}
              </View>

              <Text className="mb-2 font-body text-gray-800">Fechas NO disponibles</Text>
              <Pressable
                onPress={() => setShowCalendar((v) => !v)}
                className="mb-4 rounded-xl bg-blue-600 py-3">
                <Text className="text-center text-white">
                  {showCalendar ? 'Ocultar calendario' : 'Mostrar calendario'}
                </Text>
              </Pressable>

              {showCalendar && (
                <Calendar onDayPress={onDayPress} markedDates={markedDates} markingType="period" />
              )}

              {form.unavailableDates.length > 0 && (
                <View className="mb-4">
                  {form.unavailableDates.map((d, i) => (
                    <View key={i} className="mb-2 flex-row items-center justify-between">
                      <Text>{d.toISOString().split('T')[0]}</Text>
                      <Pressable onPress={() => handleRemoveDate(d)}>
                        <Text className="text-red-500">Eliminar</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}

              <View className="mt-4 flex-row justify-between">
                <Pressable onPress={onClose} className="rounded-xl bg-gray-300 px-6 py-3">
                  <Text className="font-semibold">Cancelar</Text>
                </Pressable>

                <Pressable
                  onPress={handleSubmit}
                  disabled={loading}
                  className={`rounded-xl px-6 py-3 ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="font-semibold text-white">Guardar</Text>
                  )}
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
