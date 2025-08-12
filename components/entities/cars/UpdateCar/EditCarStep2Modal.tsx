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
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';
import { CarService } from 'services/cars.service';
import { departmentsElSalvador } from 'constants/global';
import { carPrices } from 'constants/cars';

interface Props {
  carID: string;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface MarkedDate {
  selected: boolean;
}

export default function EditCarStep2Modal({ carID, visible, onClose, onSuccess }: Props) {
  const carService = new CarService();

  const [form, setForm] = useState({
    international_use: false,
    price: 0,
    enable: false,
    capacity: 1,
    departments_scope: '',
    unavailableDates: [] as Date[],
  });

  const [markedDates, setMarkedDates] = useState<{ [key: string]: MarkedDate }>({});
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // Cargar datos del carro
  useEffect(() => {
    if (visible) {
      loadCarData();
    }
  }, [visible]);

  const loadCarData = async () => {
    setLoading(true);
    try {
      const data = await carService.getCarByID(carID);
      const car = data;

      // Parsear departamentos
      const deps = car.departments_scope
        ? car.departments_scope.split(', ').map((d: string) => d.trim())
        : [];

      // Parsear fechas no disponibles
      const initialMarked: { [key: string]: MarkedDate } = {};
      const unavailableDatesParsed = (car.car_unavailability_days || []).map((d: any) => {
        const dateStr = d.date.split('T')[0];
        initialMarked[dateStr] = { selected: true };
        return { date: new Date(d.date), id: d.id };
      });

      setForm({
        international_use: car.international_use ?? false,
        price: typeof car.price === 'number' ? car.price : 0,
        enable: car.enable ?? false,
        capacity: typeof car.capacity === 'number' ? car.capacity : 1,
        departments_scope: car.departments_scope || '',
        unavailableDates: unavailableDatesParsed.map((d: { date: any }) => d.date),
      });
      setSelectedDepartments(deps);
      setMarkedDates(initialMarked);
      setExistingUnavailableDates(unavailableDatesParsed);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'No se pudo cargar la información del carro.');
    } finally {
      setLoading(false);
    }
  };

  const [existingUnavailableDates, setExistingUnavailableDates] = useState<
    { date: Date; id: number }[]
  >([]);

  const updateField = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const toggleDepartment = (dep: string) => {
    let updated = [...selectedDepartments];
    if (updated.includes(dep)) {
      updated = updated.filter((d) => d !== dep);
    } else {
      updated.push(dep);
    }
    setSelectedDepartments(updated);
    updateField('departments_scope', updated.join(', '));
  };

  const onDayPress = (day: any) => {
    const dateStr = day.dateString;
    const newMarked = { ...markedDates };

    if (markedDates[dateStr]) {
      delete newMarked[dateStr];
      updateField(
        'unavailableDates',
        form.unavailableDates.filter((d) => d.toISOString().split('T')[0] !== dateStr)
      );
    } else {
      newMarked[dateStr] = { selected: true };
      updateField('unavailableDates', [...form.unavailableDates, new Date(dateStr + 'T00:00:00')]);
    }

    setMarkedDates(newMarked);
  };

  const handleRemoveDate = async (date: Date, id?: number) => {
    if (id) {
      try {
        await carService.deleteUnavailableDays(id);
        setExistingUnavailableDates((prev) => prev.filter((d) => d.id !== id));
      } catch (error: any) {
        Alert.alert('Error', error?.message || 'No se pudo eliminar la fecha.');
      }
    }
    const dateStr = date.toISOString().split('T')[0];
    const newMarkedDates = { ...markedDates };
    delete newMarkedDates[dateStr];
    setMarkedDates(newMarkedDates);
    updateField(
      'unavailableDates',
      form.unavailableDates.filter((d) => d.getTime() !== date.getTime())
    );
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, boolean> = {};
    if (!form.departments_scope) newErrors.departments_scope = true;
    if (!form.price || form.price <= 0) newErrors.price = true;
    if (!form.capacity || form.capacity <= 0) newErrors.capacity = true;

    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios correctamente.');
      return;
    }

    setLoading(true);
    try {
      await carService.createCarStep2(carID, {
        ...form,
        unavailableDates: form.unavailableDates.map((d) => d.toISOString()),
      });
      Alert.alert('Éxito', 'Datos de validación actualizados correctamente.');
      onSuccess();
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'No se pudo actualizar la validación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-6">
          <Text className="mb-4 text-center font-head text-2xl text-gray-800">
            Editar Reglas del Carro
          </Text>

          {/* Uso internacional */}
          <View className="mb-4 flex-row items-center justify-between">
            <Text>Permitir uso internacional</Text>
            <Switch
              value={form.international_use}
              onValueChange={(v) => updateField('international_use', v)}
            />
          </View>

          {/* Precio */}
          <Text className="mb-2">Precio diario</Text>
          <View
            className={`mb-4 rounded-xl border px-4 py-3 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}>
            <Picker
              selectedValue={form.price.toString()}
              onValueChange={(v) => updateField('price', Number(v))}>
              <Picker.Item label="Selecciona un precio" value="0" />
              {carPrices.map((price) => (
                <Picker.Item key={price} label={`$${price}`} value={price.toString()} />
              ))}
            </Picker>
          </View>

          {/* Habilitar */}
          <View className="mb-4 flex-row items-center justify-between">
            <Text>Habilita tu carro desde ya</Text>
            <Switch value={form.enable} onValueChange={(v) => updateField('enable', v)} />
          </View>

          {/* Capacidad */}
          <Text className="mb-2">Número de pasajeros permitidos</Text>
          <TextInput
            keyboardType="numeric"
            value={form.capacity.toString()}
            onChangeText={(t) => updateField('capacity', Number(t) || 0)}
            className={`mb-4 rounded-xl border px-4 py-3 ${errors.capacity ? 'border-red-500' : 'border-gray-300'}`}
          />

          {/* Departamentos */}
          <Text className="mb-2">Departamentos</Text>
          <View
            className={`mb-4 rounded-xl border px-4 py-3 ${errors.departments_scope ? 'border-red-500' : 'border-gray-300'}`}>
            {departmentsElSalvador.map((dep) => (
              <TouchableOpacity
                key={dep}
                onPress={() => toggleDepartment(dep)}
                className="mb-2 flex-row items-center">
                <View
                  className={`mr-3 h-5 w-5 rounded border ${
                    selectedDepartments.includes(dep)
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-400'
                  }`}
                />
                <Text>{dep}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Fechas no disponibles */}
          <Text className="mb-2">Fechas NO disponibles</Text>
          <TouchableOpacity
            onPress={() => setShowCalendar((v) => !v)}
            className="mb-4 rounded-xl bg-blue-600 py-3">
            <Text className="text-center text-white">
              {showCalendar ? 'Ocultar calendario' : 'Mostrar calendario'}
            </Text>
          </TouchableOpacity>

          {showCalendar && <Calendar onDayPress={onDayPress} markedDates={markedDates} />}

          {/* Lista de fechas */}
          {existingUnavailableDates.map((d, i) => (
            <View key={i} className="mb-2 flex-row items-center justify-between">
              <Text>{d.date.toISOString().split('T')[0]}</Text>
              <TouchableOpacity onPress={() => handleRemoveDate(d.date, d.id)}>
                <Text className="text-red-500">Eliminar</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Botón Guardar */}
          <TouchableOpacity
            className={`rounded-xl py-3 ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
            onPress={handleSubmit}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-center font-semibold text-white">Guardar Cambios</Text>
            )}
          </TouchableOpacity>

          {/* Botón Cancelar */}
          <TouchableOpacity className="mt-4 rounded-xl bg-gray-400 py-3" onPress={onClose}>
            <Text className="text-center text-white">Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
}
