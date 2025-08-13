import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';
import { CarService } from 'services/cars.service';
import { createCarRules } from 'interfaces/cars.chemas';
import { carPrices } from 'constants/cars';

interface Props {
  carID: string;
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

export default function CarValidationStep2({ carID, onSuccess }: Props) {
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
  const [showCalendar, setShowCalendar] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [placesList, setPlacesList] = useState<Place[]>([]);

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

  const [markedDates, setMarkedDates] = useState<{ [key: string]: { selected: boolean } }>({});

  const onDayPress = (day: DayPressEvent) => {
    const dateStr = day.dateString;
    const newMarkedDates = { ...markedDates };

    if (markedDates[dateStr]) {
      delete newMarkedDates[dateStr];
      updateField(
        'unavailableDates',
        form.unavailableDates.filter((d) => d.toISOString().split('T')[0] !== dateStr)
      );
    } else {
      newMarkedDates[dateStr] = { selected: true };
      updateField('unavailableDates', [...form.unavailableDates, new Date(dateStr + 'T00:00:00')]);
    }

    setMarkedDates(newMarkedDates);
  };

  const handleRemoveDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const newMarkedDates = { ...markedDates };
    delete newMarkedDates[dateStr];
    setMarkedDates(newMarkedDates);
    updateField(
      'unavailableDates',
      form.unavailableDates.filter((d) => d.getTime() !== date.getTime())
    );
  };

  const fetchPlaces = async () => {
    setPlacesLoading(true);
    try {
      const carService = new CarService();
      const response = await carService.getPlacesForCar();
      const data = await response.json();
      console.log('Data recibida de getPlacesForCar:', data);

      const list: Place[] = data.places ?? data; // soporte ambos formatos
      console.log('Lista de lugares a mostrar:', list);

      setPlacesList(list);
    } catch (err) {
      Alert.alert('Error', 'No se pudieron cargar los lugares disponibles');
    } finally {
      setPlacesLoading(false);
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
      await carService.createCarStep2(carID, payload);
      Alert.alert('Éxito', 'Carro validado correctamente.');
      onSuccess();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'No se pudo validar el carro.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="p-6">
        <Text className="mb-4 text-center font-head text-2xl text-gray-800">
          Reglas de tu carro
        </Text>

        {/* Uso internacional */}
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="font-body text-gray-800">Permitir uso internacional</Text>
          <Switch
            value={form.international_use}
            onValueChange={(value) => updateField('international_use', value)}
          />
        </View>

        {/* Precio diario */}
        <Text className="mb-2 font-body text-gray-800">Precio diario</Text>
        <View
          className={`mb-4 rounded-xl border px-4 py-3 ${
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

        {/* Habilitar */}
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="font-body text-gray-800">Habilita tu carro desde ya</Text>
          <Switch value={form.enable} onValueChange={(value) => updateField('enable', value)} />
        </View>

        {/* Capacidad */}
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

        {/* Lugares disponibles */}
        <Text className="mb-2 font-body text-gray-800">Escoge los lugares disponibles</Text>
        <View
          className={`mb-4 rounded-xl border px-4 py-3 ${
            errors.places ? 'border-red-500' : 'border-gray-300'
          }`}>
          {placesLoading ? (
            <ActivityIndicator />
          ) : (
            placesList.map((place) => (
              <TouchableOpacity
                key={place.id}
                onPress={() => togglePlace(place.id)}
                className="mb-2 flex-row items-center">
                <View
                  className={`mr-3 h-5 w-5 rounded border ${
                    form.places.includes(place.id)
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-400'
                  }`}
                />
                <Text>{place.name}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Fechas no disponibles */}
        <Text className="mb-2 font-body text-gray-800">Fechas NO disponibles</Text>
        <TouchableOpacity
          onPress={() => setShowCalendar((v) => !v)}
          className="mb-4 rounded-xl bg-blue-600 py-3">
          <Text className="text-center text-white">
            {showCalendar ? 'Ocultar calendario' : 'Mostrar calendario'}
          </Text>
        </TouchableOpacity>

        {showCalendar && (
          <Calendar onDayPress={onDayPress} markedDates={markedDates} markingType="period" />
        )}

        {/* Listado de fechas seleccionadas */}
        {form.unavailableDates.length > 0 && (
          <View className="mb-4">
            {form.unavailableDates.map((d, i) => (
              <View key={i} className="mb-2 flex-row items-center justify-between">
                <Text>{d.toISOString().split('T')[0]}</Text>
                <TouchableOpacity onPress={() => handleRemoveDate(d)}>
                  <Text className="text-red-500">Eliminar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Botón guardar */}
        <TouchableOpacity
          className={`rounded-xl py-3 ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-center font-body text-base font-semibold text-white">
              Guardar validación
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
