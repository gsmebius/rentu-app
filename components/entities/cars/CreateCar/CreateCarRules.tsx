import { useState } from 'react';
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
import { departmentsElSalvador } from 'constants/global';
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

export default function CarValidationStep2({ carID, onSuccess }: Props) {
  const [form, setForm] = useState<createCarRules>({
    international_use: false,
    price: 0,
    enable: false,
    capacity: 1,
    departments_scope: '',
    unavailableDates: [],
  });

  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  const updateField = (field: keyof createCarRules, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const updateDepartmentsScope = (departments: string[]) => {
    setSelectedDepartments(departments);
    updateField('departments_scope', departments.join(', '));
    setErrors((prev) => ({ ...prev, departments_scope: false }));
  };

  const toggleDepartment = (dep: string) => {
    if (selectedDepartments.includes(dep)) {
      updateDepartmentsScope(selectedDepartments.filter((d) => d !== dep));
    } else {
      updateDepartmentsScope([...selectedDepartments, dep]);
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

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="p-6">
        <Text className="mb-4 text-center font-head text-2xl text-gray-800">Reglas de tu carro</Text>

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
        <View className={`mb-4 rounded-xl border px-4 py-3 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}>
          <Picker
            selectedValue={form.price.toString()}
            onValueChange={(value) => updateField('price', Number(value))}
          >
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
          value={form.capacity.toString()}
          onChangeText={(text) => {
            const num = Number(text);
            if (!isNaN(num) && num > 0) updateField('capacity', num);
            else updateField('capacity', 0);
          }}
          className={`mb-4 rounded-xl border px-4 py-3 ${errors.capacity ? 'border-red-500' : 'border-gray-300'}`}
        />

        {/* Departamentos (multi-selección) */}
        <Text className="mb-2 font-body text-gray-800">Escoge los departamentos</Text>
        <View className={`mb-4 rounded-xl border px-4 py-3 ${errors.departments_scope ? 'border-red-500' : 'border-gray-300'}`}>
          {departmentsElSalvador.map((dep) => (
            <TouchableOpacity
              key={dep}
              onPress={() => toggleDepartment(dep)}
              className="flex-row items-center mb-2"
            >
              <View
                className={`h-5 w-5 mr-3 rounded border ${
                  selectedDepartments.includes(dep) ? 'bg-blue-600 border-blue-600' : 'border-gray-400'
                }`}
              />
              <Text>{dep}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Fechas no disponibles */}
        <Text className="mb-2 font-body text-gray-800">Fechas NO disponibles</Text>
        <TouchableOpacity
          onPress={() => setShowCalendar((v) => !v)}
          className="mb-4 rounded-xl bg-blue-600 py-3"
        >
          <Text className="text-center text-white">{showCalendar ? 'Ocultar calendario' : 'Mostrar calendario'}</Text>
        </TouchableOpacity>

        {showCalendar && (
          <Calendar
            onDayPress={onDayPress}
            markedDates={markedDates}
            markingType="period"
          />
        )}

        {/* Listado de fechas seleccionadas con botón eliminar */}
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

        {/* Botón */}
        <TouchableOpacity
          className={`rounded-xl py-3 ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
          onPress={handleSubmit}
          disabled={loading}
        >
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
