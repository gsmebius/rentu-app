import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CarService } from 'services/cars.service';
import { departmentsElSalvador } from 'constants/global';

interface Props {
  carID: string;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditCarStep2Modal({ carID, visible, onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    international_use: false,
    price: 0,
    unable: false,
    capacity: 1,
    departments_scope: '',
    unavailableDates: [] as Date[],
  });

  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const fetchCarData = async () => {
      try {
        const carService = new CarService();
        const response = await carService.getCarByID(carID);
        const carData = await response.json();
        
        setForm({
          international_use: carData.international_use || false,
          price: carData.price || 0,
          unable: carData.unable || false,
          capacity: carData.capacity || 1,
          departments_scope: carData.departments_scope || '',
          unavailableDates: carData.unavailable_dates?.map((d: string) => new Date(d)) || [],
        });

      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar la información del carro');
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, [visible, carID]);

  const updateField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      if (!form.unavailableDates.some(d => d.toISOString() === selectedDate.toISOString())) {
        updateField('unavailableDates', [...form.unavailableDates, selectedDate]);
      }
    }
  };

  const handleRemoveDate = (date: Date) => {
    updateField(
      'unavailableDates',
      form.unavailableDates.filter(d => d.toISOString() !== date.toISOString())
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
        unavailable_dates: form.unavailableDates.map(d => d.toISOString().split('T')[0]),
      };
      await carService.updateCar(carID, payload);
      Alert.alert('Éxito', 'Configuración actualizada correctamente');
      onSuccess();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'No se pudo actualizar la configuración');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-xl w-4/5">
            <ActivityIndicator size="large" />
            <Text className="mt-4 text-center">Cargando configuración del carro...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-xl w-4/5 max-h-[90%]">
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className="p-6">
              <Text className="mb-4 text-center font-head text-2xl text-gray-800">Editar configuración del carro</Text>

              {/* Uso internacional */}
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="font-body text-gray-800">Permitir uso internacional</Text>
                <Switch
                  value={form.international_use}
                  onValueChange={value => updateField('international_use', value)}
                />
              </View>

              {/* Precio */}
              <Text className="mb-2 font-body text-gray-800">Precio diario</Text>
              <TextInput
                placeholder="Ej: 25"
                keyboardType="numeric"
                value={form.price.toString()}
                onChangeText={text => updateField('price', Number(text))}
                className="mb-4 rounded-xl border border-gray-300 px-4 py-3"
              />

              {/* Habilitar */}
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="font-body text-gray-800">Habilita tu carro desde ya</Text>
                <Switch value={!form.unable} onValueChange={value => updateField('unable', !value)} />
              </View>

              {/* Capacidad */}
              <Text className="mb-2 font-body text-gray-800">Número de pasajeros permitidos</Text>
              <TextInput
                placeholder="Ej: 5"
                keyboardType="numeric"
                value={form.capacity.toString()}
                onChangeText={text => updateField('capacity', Number(text))}
                className="mb-4 rounded-xl border border-gray-300 px-4 py-3"
              />

              {/* Departamentos */}
              <Text className="mb-2 font-body text-gray-800">Departamentos permitidos</Text>
              <View className="mb-4 rounded-xl border border-gray-300">
                <Picker
                  selectedValue={form.departments_scope}
                  onValueChange={value => updateField('departments_scope', value)}>
                  <Picker.Item label="Selecciona un departamento" value="" />
                  {departmentsElSalvador.map(dep => (
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

              {/* Botones */}
              <View className="flex-row justify-between mt-4">
                <TouchableOpacity
                  onPress={onClose}
                  className="rounded-xl bg-gray-300 px-6 py-3"
                >
                  <Text className="font-semibold">Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={loading}
                  className={`rounded-xl px-6 py-3 ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white font-semibold">Guardar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}