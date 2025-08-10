import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CarService } from 'services/cars.service';

interface Props {
  carID: string;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditCarStep1Modal({ carID, visible, onClose, onSuccess }: Props) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2010 + 1 }, (_, i) => (2010 + i).toString());

  const [form, setForm] = useState({
    circulation_car_number: '',
    brand: '',
    model: '',
    year: '',
    color: '',
    is_insured: false,
    engine_number: '',
    chacian_bin_number: '',
    licence_plate: '',
    owner_name: '',
    type: '',
    transmission_type: '',
    description: '',
  });

  const [brandsList, setBrandsList] = useState<{ id: number; name: string }[]>([]);
  const [modelsList, setModelsList] = useState<{ id: number; name: string }[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!visible) return;

    const fetchData = async () => {
      try {
        // Fetch brands and car data
        const carService = new CarService();

        // Get brands
        setLoadingBrands(true);
        const brandsResponse = await carService.getBrands();
        const brandsData = await brandsResponse.json();
        setBrandsList(brandsData?.brands?.filter((b: any) => b.available) || []);
        setLoadingBrands(false);

        // Get car data
        const carResponse = await carService.getCarByID(carID);
        const carData = await carResponse.json();

        setForm({
          circulation_car_number: carData.circulation_car_number || '',
          brand: carData.brand?.id?.toString() || '',
          model: carData.model?.id?.toString() || '',
          year: carData.year || '',
          color: carData.color || '',
          is_insured: carData.is_insured || false,
          engine_number: carData.engine_number || '',
          chacian_bin_number: carData.chacian_bin_number || '',
          licence_plate: carData.licence_plate || '',
          owner_name: carData.owner_name || '',
          type: carData.type || '',
          transmission_type: carData.transmission_type || '',
          description: carData.description || '',
        });

        // Get models if brand exists
        if (carData.brand?.id) {
          setLoadingModels(true);
          const modelsResponse = await carService.getBrandModels(carData.brand.id.toString());
          const modelsData = await modelsResponse.json();
          setModelsList(modelsData?.models?.filter((m: any) => m.available) || []);
          setLoadingModels(false);
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar la información del carro');
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [visible, carID]);

  const updateField = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleSubmit = async () => {
    const requiredFields = [
      'circulation_car_number',
      'brand',
      'model',
      'year',
      'color',
      'engine_number',
      'chacian_bin_number',
      'licence_plate',
      'owner_name',
      'type',
      'transmission_type',
    ];

    const newErrors: Record<string, boolean> = {};
    requiredFields.forEach((field) => {
      newErrors[field] = !form[field as keyof typeof form];
    });

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      Alert.alert('Error', 'Completa todos los campos obligatorios.');
      return;
    }

    setLoading(true);
    try {
      const carService = new CarService();
      await carService.updateCar(carID, form);
      Alert.alert('Éxito', 'Información del carro actualizada correctamente');
      onSuccess();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'No se pudo actualizar el carro');
    } finally {
      setLoading(false);
    }
  };

  // Fetch modelos al cambiar brand
  useEffect(() => {
    if (!form.brand) {
      setModelsList([]);
      setForm((prev) => ({ ...prev, model: '' }));
      return;
    }

    const fetchModels = async () => {
      setLoadingModels(true);
      try {
        const carService = new CarService();
        const response = await carService.getBrandModels(form.brand);
        const data = await response.json();
        setModelsList(data?.models?.filter((m: any) => m.available) || []);
      } catch {
        Alert.alert('Error', 'No se pudieron cargar los modelos.');
      } finally {
        setLoadingModels(false);
      }
    };

    fetchModels();
  }, [form.brand]);

  if (loading) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="w-4/5 rounded-xl bg-white p-6">
            <ActivityIndicator size="large" />
            <Text className="mt-4 text-center">Cargando información del carro...</Text>
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
                Editar información del carro
              </Text>

              {/* Campos del formulario (igual que en CreateCar pero con valores cargados) */}
              {/* Número de circulación */}
              <Text className="mb-2 font-body text-gray-800">Número de circulación</Text>
              <TextInput
                placeholder="Número de tarjeta de circulación"
                value={form.circulation_car_number}
                onChangeText={(text) => updateField('circulation_car_number', text)}
                className={`mb-4 rounded-xl border px-4 py-3 ${errors.circulation_car_number ? 'border-red-500' : 'border-gray-300'}`}
              />

              {/* Marca */}
              <Text className="mb-2 font-body text-gray-800">Marca</Text>
              <View
                className={`mb-4 rounded-xl border ${errors.brand ? 'border-red-500' : 'border-gray-300'}`}>
                {loadingBrands ? (
                  <ActivityIndicator />
                ) : (
                  <Picker
                    selectedValue={form.brand}
                    onValueChange={(value) => updateField('brand', value)}>
                    <Picker.Item label="Selecciona una marca" value="" />
                    {brandsList.map((b) => (
                      <Picker.Item key={b.id} label={b.name} value={b.id.toString()} />
                    ))}
                  </Picker>
                )}
              </View>

              {/* Modelo */}
              <Text className="mb-2 font-body text-gray-800">Modelo</Text>
              <View
                className={`mb-4 rounded-xl border ${errors.model ? 'border-red-500' : 'border-gray-300'}`}>
                {loadingModels ? (
                  <ActivityIndicator />
                ) : (
                  <Picker
                    enabled={!!form.brand}
                    selectedValue={form.model}
                    onValueChange={(value) => updateField('model', value)}>
                    <Picker.Item
                      label={form.brand ? 'Selecciona un modelo' : 'Primero selecciona una marca'}
                      value=""
                    />
                    {modelsList.map((m) => (
                      <Picker.Item key={m.id} label={m.name} value={m.id.toString()} />
                    ))}
                  </Picker>
                )}
              </View>

              {/* Resto de campos... (similar a CreateCar) */}

              {/* Botones */}
              <View className="mt-4 flex-row justify-between">
                <TouchableOpacity onPress={onClose} className="rounded-xl bg-gray-300 px-6 py-3">
                  <Text className="font-semibold">Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={loading}
                  className={`rounded-xl px-6 py-3 ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="font-semibold text-white">Guardar</Text>
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
