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
import DateTimePicker from '@react-native-community/datetimepicker';
import { CarService } from 'services/cars.service';
import { createCarRules } from 'interfaces/cars.chemas';
import { departmentsElSalvador } from 'constants/global';

interface Props {
  carID: string;
  onSuccess: () => void; // Para avisar al padre que se completó con éxito
}

export default function CarValidationStep2({ carID, onSuccess }: Props) {
  const [form, setForm] = useState<createCarRules>({
    international_use: false,
    price: 0,
    unable: false,
    capacity: 1,
    departments_scope: '',
    unavailableDates: [],
  });

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const updateField = (field: keyof createCarRules, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
    //   const dateStr = selectedDate.toISOString().split('T')[0];
      if (!form.unavailableDates.includes(selectedDate)) {
        updateField('unavailableDates', [...form.unavailableDates, selectedDate]);
      }
    }
  };

  const handleRemoveDate = (date: Date) => {
    updateField(
      'unavailableDates',
      form.unavailableDates.filter((d) => d.getTime() !== date.getTime())
    );
  };

  const handleSubmit = async () => {
    if (!form.departments_scope || !form.price || !form.capacity) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios.');
      return;
    }

    setLoading(true);
    try {
      const carService = new CarService();
      const payload = {
        ...form,
        unavailableDates: form.unavailableDates.map((d) => d.toISOString().split('T')[0]),
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
        <Text className="mb-4 text-center font-head text-2xl text-gray-800">
          Validar carro (Fase 2)
        </Text>

        {/* Uso internacional */}
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="font-body text-gray-800">Permitir uso internacional</Text>
          <Switch
            value={form.international_use}
            onValueChange={(value) => updateField('international_use', value)}
          />
        </View>

        {/* Precio */}
        <Text className="mb-2 font-body text-gray-800">Precio diario</Text>
        <TextInput
          placeholder="Ej: 25"
          keyboardType="numeric"
          value={form.price.toString()}
          onChangeText={(text) => updateField('price', Number(text))}
          className="mb-4 rounded-xl border border-gray-300 px-4 py-3"
        />

        {/* Habilitar */}
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="font-body text-gray-800">Habilita tu carro desde ya</Text>
          <Switch value={form.unable} onValueChange={(value) => updateField('unable', value)} />
        </View>

        {/* Capacidad */}
        <Text className="mb-2 font-body text-gray-800">Número de pasajeros permitidos</Text>
        <TextInput
          placeholder="Ej: 5"
          keyboardType="numeric"
          value={form.capacity.toString()}
          onChangeText={(text) => updateField('capacity', Number(text))}
          className="mb-4 rounded-xl border border-gray-300 px-4 py-3"
        />

        {/* Departamentos */}
        <Text className="mb-2 font-body text-gray-800">Escoge los departamentos</Text>
        <View className="mb-4 rounded-xl border border-gray-300">
          <Picker
            selectedValue={form.departments_scope}
            onValueChange={(value) => updateField('departments_scope', value)}>
            <Picker.Item label="Selecciona un departamento" value="" />
            {departmentsElSalvador.map((dep) => (
              <Picker.Item key={dep} label={dep} value={dep} />
            ))}
          </Picker>
        </View>

        {/* Fechas no disponibles */}
        <Text className="mb-2 font-body text-gray-800">Fechas NO disponibles</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className="mb-4 rounded-xl bg-blue-600 py-3">
          <Text className="text-center text-white">Agregar fecha</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="calendar"
            onChange={handleAddDate}
          />
        )}

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
