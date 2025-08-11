// import { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   ScrollView,
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import { useRouter } from 'expo-router';
// import { CarService } from 'services/cars.service';
// import { useAuth } from 'auth/AuthContext';
// import { carTransmissionTypes, carTypes, colorsCar } from 'constants/cars';

// export default function CreateCar() {
//   const router = useRouter();
//   const { user } = useAuth();

//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: currentYear - 2010 + 1 }, (_, i) => (2010 + i).toString());

//   const [form, setForm] = useState({
//     circulation_car_number: '',
//     brand: '',
//     model: '',
//     year: '',
//     color: '',
//     is_insured: false,
//     engine_number: '',
//     chacian_bin_number: '',
//     licence_plate: '',
//     owner_name: '',
//     type: '',
//     transmission_type: '',
//     description: '',
//   });

//   const [brandsList, setBrandsList] = useState<{ id: number; name: string }[]>([]);
//   const [modelsList, setModelsList] = useState<{ id: number; name: string }[]>([]);
//   const [loadingBrands, setLoadingBrands] = useState(false);
//   const [loadingModels, setLoadingModels] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState<Record<string, boolean>>({});

//   // Fetch marcas
//   useEffect(() => {
//     const fetchBrands = async () => {
//       setLoadingBrands(true);
//       try {
//         const carService = new CarService();
//         const response = await carService.getBrands();
//         const data = await response.json();
//         setBrandsList(data?.brands?.filter((b: any) => b.available) || []);
//       } catch {
//         Alert.alert('Error', 'No se pudieron cargar las marcas.');
//       } finally {
//         setLoadingBrands(false);
//       }
//     };
//     fetchBrands();
//   }, []);

//   // Fetch modelos
//   useEffect(() => {
//     if (!form.brand) {
//       setModelsList([]);
//       setForm((prev) => ({ ...prev, model: '' }));
//       return;
//     }
//     const fetchModels = async () => {
//       setLoadingModels(true);
//       try {
//         const carService = new CarService();
//         const response = await carService.getBrandModels(form.brand);
//         const data = await response.json();
//         setModelsList(data?.models?.filter((m: any) => m.available) || []);
//       } catch {
//         Alert.alert('Error', 'No se pudieron cargar los modelos.');
//       } finally {
//         setLoadingModels(false);
//       }
//     };
//     fetchModels();
//   }, [form.brand]);

//   const updateField = (field: string, value: any) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//     setErrors((prev) => ({ ...prev, [field]: false }));
//   };

//   const handleSubmit = async () => {
//     const requiredFields = [
//       'circulation_car_number',
//       'brand',
//       'model',
//       'year',
//       'color',
//       'engine_number',
//       'chacian_bin_number',
//       'licence_plate',
//       'owner_name',
//       'type',
//       'transmission_type',
//     ];

//     const newErrors: Record<string, boolean> = {};
//     requiredFields.forEach((field) => {
//       newErrors[field] = !form[field as keyof typeof form];
//     });
//     setErrors(newErrors);

//     if (Object.values(newErrors).some(Boolean)) {
//       Alert.alert('Campos incompletos', 'Completa todos los campos obligatorios.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const carService = new CarService();
//       const payload = {
//         ...form,
//         user_id: user?.id,
//       };

//       const responseData = await carService.createCarStep1(payload);
//       console.log('Respuesta del servidor:', responseData);

//       const carId = responseData?.createCar?.id || responseData?.id || responseData?.data?.id;

//       if (carId) {
//         router.replace(`/my-car/${carId}`);
//       } else {
//         Alert.alert('Error', 'No se recibió un ID válido del carro creado.');
//       }
//     } catch (error: any) {
//       console.error('Error creando carro:', error);
//       Alert.alert('Error', error?.message || 'No se pudo crear el carro. Inténtalo más tarde.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//       <View className="p-6">
//         <Text className="mb-4 text-center font-head text-3xl text-gray-800">
//           Crear un nuevo carro
//         </Text>
//         <Text className="mb-6 font-body text-base text-gray-700">
//           Completa la información para registrar tu carro.
//         </Text>

//         {/* Número de circulación */}
//         <Text className="mb-2 font-body text-gray-800">Número de circulación</Text>
//         <TextInput
//           placeholder="Número de tarjeta de circulación"
//           value={form.circulation_car_number}
//           onChangeText={(text) => updateField('circulation_car_number', text)}
//           className={`mb-4 rounded-xl border px-4 py-3 ${errors.circulation_car_number ? 'border-red-500' : 'border-gray-300'}`}
//         />

//         {/* Marca */}
//         <Text className="mb-2 font-body text-gray-800">Marca</Text>
//         <View
//           className={`mb-4 rounded-xl border ${errors.brand ? 'border-red-500' : 'border-gray-300'}`}>
//           {loadingBrands ? (
//             <ActivityIndicator />
//           ) : (
//             <Picker
//               selectedValue={form.brand}
//               onValueChange={(value) => updateField('brand', value)}>
//               <Picker.Item label="Selecciona una marca" value="" />
//               {brandsList.map((b) => (
//                 <Picker.Item key={b.id} label={b.name} value={b.id.toString()} />
//               ))}
//             </Picker>
//           )}
//         </View>

//         {/* Modelo */}
//         <Text className="mb-2 font-body text-gray-800">Modelo</Text>
//         <View
//           className={`mb-4 rounded-xl border ${errors.model ? 'border-red-500' : 'border-gray-300'}`}>
//           {loadingModels ? (
//             <ActivityIndicator />
//           ) : (
//             <Picker
//               enabled={!!form.brand}
//               selectedValue={form.model}
//               onValueChange={(value) => updateField('model', value)}>
//               <Picker.Item
//                 label={form.brand ? 'Selecciona un modelo' : 'Primero selecciona una marca'}
//                 value=""
//               />
//               {modelsList.map((m) => (
//                 <Picker.Item key={m.id} label={m.name} value={m.id.toString()} />
//               ))}
//             </Picker>
//           )}
//         </View>

//         {/* Año */}
//         <Text className="mb-2 font-body text-gray-800">Año</Text>
//         <View
//           className={`mb-4 rounded-xl border ${errors.year ? 'border-red-500' : 'border-gray-300'}`}>
//           <Picker selectedValue={form.year} onValueChange={(value) => updateField('year', value)}>
//             <Picker.Item label="Selecciona un año" value="" />
//             {years.map((y) => (
//               <Picker.Item key={y} label={y} value={y} />
//             ))}
//           </Picker>
//         </View>

//         {/* Color */}
//         <Text className="mb-2 font-body text-gray-800">Color</Text>
//         <View
//           className={`mb-4 rounded-xl border ${errors.color ? 'border-red-500' : 'border-gray-300'}`}>
//           <Picker selectedValue={form.color} onValueChange={(value) => updateField('color', value)}>
//             <Picker.Item label="Selecciona un color" value="" />
//             {colorsCar.map((c) => (
//               <Picker.Item key={c} label={c} value={c} />
//             ))}
//           </Picker>
//         </View>

//         {/* Tipo */}
//         <Text className="mb-2 font-body text-gray-800">Tipo</Text>
//         <View
//           className={`mb-4 rounded-xl border ${errors.type ? 'border-red-500' : 'border-gray-300'}`}>
//           <Picker selectedValue={form.type} onValueChange={(value) => updateField('type', value)}>
//             <Picker.Item label="Selecciona un tipo" value="" />
//             {carTypes.map((t) => (
//               <Picker.Item key={t} label={t} value={t} />
//             ))}
//           </Picker>
//         </View>

//         {/* Transmisión */}
//         <Text className="mb-2 font-body text-gray-800">Transmisión</Text>
//         <View
//           className={`mb-4 rounded-xl border ${errors.transmission_type ? 'border-red-500' : 'border-gray-300'}`}>
//           <Picker
//             selectedValue={form.transmission_type}
//             onValueChange={(value) => updateField('transmission_type', value)}>
//             <Picker.Item label="Selecciona transmisión" value="" />
//             {carTransmissionTypes.map((t) => (
//               <Picker.Item key={t} label={t} value={t} />
//             ))}
//           </Picker>
//         </View>

//         {/* Número de motor */}
//         <Text className="mb-2 font-body text-gray-800">Número de motor</Text>
//         <TextInput
//           placeholder="Introduce el número de motor"
//           value={form.engine_number}
//           onChangeText={(text) => updateField('engine_number', text)}
//           className={`mb-4 rounded-xl border px-4 py-3 ${errors.engine_number ? 'border-red-500' : 'border-gray-300'}`}
//         />

//         {/* Número de chasis */}
//         <Text className="mb-2 font-body text-gray-800">Chasis</Text>
//         <TextInput
//           placeholder="Introduce el número de chasis/bin"
//           value={form.chacian_bin_number}
//           onChangeText={(text) => updateField('chacian_bin_number', text)}
//           className={`mb-4 rounded-xl border px-4 py-3 ${errors.chacian_bin_number ? 'border-red-500' : 'border-gray-300'}`}
//         />

//         {/* Placa */}
//         <Text className="mb-2 font-body text-gray-800">Placa</Text>
//         <TextInput
//           placeholder="Introduce el número de placa"
//           value={form.licence_plate}
//           onChangeText={(text) => updateField('licence_plate', text)}
//           className={`mb-4 rounded-xl border px-4 py-3 ${errors.licence_plate ? 'border-red-500' : 'border-gray-300'}`}
//         />

//         <Text className="mb-2 font-body text-gray-800">¿Es asegurado?</Text>
//         <View className="mb-4 rounded-xl border border-gray-300">
//           <Picker
//             selectedValue={form.is_insured ? 'true' : 'false'}
//             onValueChange={(value) => updateField('is_insured', value === 'true')}>
//             <Picker.Item label="No" value="false" />
//             <Picker.Item label="Sí" value="true" />
//           </Picker>
//         </View>

//         {/* Nombre del propietario */}
//         <Text className="mb-2 font-body text-gray-800">Nombre del propietario</Text>
//         <TextInput
//           placeholder="Nombre completo del propietario"
//           value={form.owner_name}
//           onChangeText={(text) => updateField('owner_name', text)}
//           className={`mb-4 rounded-xl border px-4 py-3 ${errors.owner_name ? 'border-red-500' : 'border-gray-300'}`}
//         />

//         {/* Descripción */}
//         <Text className="mb-2 font-body text-gray-800">Descripción</Text>
//         <TextInput
//           placeholder="Destaca las cualidades importantes de tu carro"
//           value={form.description}
//           onChangeText={(text) => updateField('description', text)}
//           multiline
//           numberOfLines={4}
//           className="mb-6 rounded-xl border border-gray-300 px-4 py-3"
//           textAlignVertical="top"
//         />

//         {/* Botón */}
//         <TouchableOpacity
//           className={`rounded-xl py-3 ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
//           onPress={handleSubmit}
//           disabled={loading}>
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text className="text-center font-body text-base font-semibold text-white">
//               Crear carro
//             </Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { CarService } from 'services/cars.service';
import { useAuth } from 'auth/AuthContext';
import { carTransmissionTypes, carTypes, colorsCar } from 'constants/cars';

export default function CreateCar() {
  const router = useRouter();
  const { user } = useAuth();

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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Fetch marcas
  useEffect(() => {
    const fetchBrands = async () => {
      setLoadingBrands(true);
      try {
        const carService = new CarService();
        const response = await carService.getBrands();
        const data = await response.json();
        setBrandsList(data?.brands?.filter((b: any) => b.available) || []);
      } catch {
        Alert.alert('Error', 'No se pudieron cargar las marcas.');
      } finally {
        setLoadingBrands(false);
      }
    };
    fetchBrands();
  }, []);

  // Fetch modelos al cambiar brand
  useEffect(() => {
    if (!form.brand) {
      setModelsList([]);
      setForm(prev => ({ ...prev, model: '' }));
      return;
    }
    const fetchModels = async () => {
      setLoadingModels(true);
      try {
        const carService = new CarService();
        // Encontrar ID de la marca seleccionada
        const brandObj = brandsList.find(b => b.name === form.brand);
        if (!brandObj) {
          setModelsList([]);
          return;
        }
        const response = await carService.getBrandModels(String(brandObj.id));
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

  const updateField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: false }));
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
    requiredFields.forEach(field => {
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
      const payload = {
        ...form,
        user_id: user?.id,
      };

      console.log('Payload enviado:', payload);

      const response = await carService.createCarStep1(payload);
      console.log('Respuesta cruda:', response);

      if (response?.createCar?.id) {
        router.replace(`/my-car/${response.createCar.id}`);
      } else {
        throw new Error('No se recibió un ID válido del carro creado');
      }
    } catch (error: any) {
      console.error('Error creating car:', error);
      Alert.alert('Error', error?.message || 'No se pudo crear el carro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="p-6">
        <Text className="mb-4 text-center font-head text-3xl text-gray-800">Crear un nuevo carro</Text>
        <Text className="mb-6 font-body text-base text-gray-700">Completa la información para registrar tu carro.</Text>

        {/* Número de circulación */}
        <Text className="mb-2 font-body text-gray-800">Número de circulación</Text>
        <TextInput
          placeholder="Número de tarjeta de circulación"
          value={form.circulation_car_number}
          onChangeText={text => updateField('circulation_car_number', text)}
          className={`mb-4 rounded-xl border px-4 py-3 ${errors.circulation_car_number ? 'border-red-500' : 'border-gray-300'}`}
        />

        {/* Marca */}
        <Text className="mb-2 font-body text-gray-800">Marca</Text>
        <View className={`mb-4 rounded-xl border ${errors.brand ? 'border-red-500' : 'border-gray-300'}`}>
          {loadingBrands ? (
            <ActivityIndicator />
          ) : (
            <Picker selectedValue={form.brand} onValueChange={value => updateField('brand', value)}>
              <Picker.Item label="Selecciona una marca" value="" />
              {brandsList.map(b => (
                <Picker.Item key={b.id} label={b.name} value={b.name} />
              ))}
            </Picker>
          )}
        </View>

        {/* Modelo */}
        <Text className="mb-2 font-body text-gray-800">Modelo</Text>
        <View className={`mb-4 rounded-xl border ${errors.model ? 'border-red-500' : 'border-gray-300'}`}>
          {loadingModels ? (
            <ActivityIndicator />
          ) : (
            <Picker enabled={!!form.brand} selectedValue={form.model} onValueChange={value => updateField('model', value)}>
              <Picker.Item label={form.brand ? 'Selecciona un modelo' : 'Primero selecciona una marca'} value="" />
              {modelsList.map(m => (
                <Picker.Item key={m.id} label={m.name} value={m.name} />
              ))}
            </Picker>
          )}
        </View>

        {/* Año */}
        <Text className="mb-2 font-body text-gray-800">Año</Text>
        <View className={`mb-4 rounded-xl border ${errors.year ? 'border-red-500' : 'border-gray-300'}`}>
          <Picker selectedValue={form.year} onValueChange={value => updateField('year', value)}>
            <Picker.Item label="Selecciona un año" value="" />
            {years.map(y => (
              <Picker.Item key={y} label={y} value={y} />
            ))}
          </Picker>
        </View>

        {/* Color */}
        <Text className="mb-2 font-body text-gray-800">Color</Text>
        <View className={`mb-4 rounded-xl border ${errors.color ? 'border-red-500' : 'border-gray-300'}`}>
          <Picker selectedValue={form.color} onValueChange={value => updateField('color', value)}>
            <Picker.Item label="Selecciona un color" value="" />
            {colorsCar.map(c => (
              <Picker.Item key={c} label={c} value={c} />
            ))}
          </Picker>
        </View>

        {/* ¿Es asegurado? */}
        <Text className="mb-2 font-body text-gray-800">¿Es asegurado?</Text>
        <View className="mb-4 rounded-xl border border-gray-300">
          <Picker
            selectedValue={form.is_insured ? 'true' : 'false'}
            onValueChange={value => updateField('is_insured', value === 'true')}
          >
            <Picker.Item label="No" value="false" />
            <Picker.Item label="Sí" value="true" />
          </Picker>
        </View>

        {/* Tipo */}
        <Text className="mb-2 font-body text-gray-800">Tipo</Text>
        <View className={`mb-4 rounded-xl border ${errors.type ? 'border-red-500' : 'border-gray-300'}`}>
          <Picker selectedValue={form.type} onValueChange={value => updateField('type', value)}>
            <Picker.Item label="Selecciona un tipo" value="" />
            {carTypes.map(t => (
              <Picker.Item key={t} label={t} value={t} />
            ))}
          </Picker>
        </View>

        {/* Transmisión */}
        <Text className="mb-2 font-body text-gray-800">Transmisión</Text>
        <View className={`mb-4 rounded-xl border ${errors.transmission_type ? 'border-red-500' : 'border-gray-300'}`}>
          <Picker selectedValue={form.transmission_type} onValueChange={value => updateField('transmission_type', value)}>
            <Picker.Item label="Selecciona transmisión" value="" />
            {carTransmissionTypes.map(t => (
              <Picker.Item key={t} label={t} value={t} />
            ))}
          </Picker>
        </View>

        {/* Número de motor */}
        <Text className="mb-2 font-body text-gray-800">Número de motor</Text>
        <TextInput
          placeholder="Introduce el número de motor"
          value={form.engine_number}
          onChangeText={text => updateField('engine_number', text)}
          className={`mb-4 rounded-xl border px-4 py-3 ${errors.engine_number ? 'border-red-500' : 'border-gray-300'}`}
        />

        {/* Número de chasis */}
        <Text className="mb-2 font-body text-gray-800">Chasis</Text>
        <TextInput
          placeholder="Introduce el número de chasis/bin"
          value={form.chacian_bin_number}
          onChangeText={text => updateField('chacian_bin_number', text)}
          className={`mb-4 rounded-xl border px-4 py-3 ${errors.chacian_bin_number ? 'border-red-500' : 'border-gray-300'}`}
        />

        {/* Placa */}
        <Text className="mb-2 font-body text-gray-800">Placa</Text>
        <TextInput
          placeholder="Introduce el número de placa"
          value={form.licence_plate}
          onChangeText={text => updateField('licence_plate', text)}
          className={`mb-4 rounded-xl border px-4 py-3 ${errors.licence_plate ? 'border-red-500' : 'border-gray-300'}`}
        />

        {/* Nombre del propietario */}
        <Text className="mb-2 font-body text-gray-800">Nombre del propietario</Text>
        <TextInput
          placeholder="Nombre completo del propietario"
          value={form.owner_name}
          onChangeText={text => updateField('owner_name', text)}
          className={`mb-4 rounded-xl border px-4 py-3 ${errors.owner_name ? 'border-red-500' : 'border-gray-300'}`}
        />

        {/* Descripción */}
        <Text className="mb-2 font-body text-gray-800">Descripción</Text>
        <TextInput
          placeholder="Destaca las cualidades importantes de tu carro"
          value={form.description}
          onChangeText={text => updateField('description', text)}
          multiline
          numberOfLines={4}
          className="mb-6 rounded-xl border px-4 py-3 border-gray-300"
          textAlignVertical="top"
        />

        {/* Botón */}
        <TouchableOpacity
          className={`rounded-xl py-3 ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-center font-body text-base font-semibold text-white">Crear carro</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
