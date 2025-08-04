// import { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { UserService } from 'services/users.service';

// interface ProfileValidation2Props {
//   userId: number;
//   onValidationSuccess?: () => void;
//   onValidationError?: (error?: any) => void;
// }

// export interface updateUserStep2DTO {
//   user_type: number;
//   identity_document_type?: string;
//   identity_document_number?: string;
//   licence_document_number?: string;
// }

// export default function ProfileValidation2({
//   userId,
//   onValidationSuccess,
//   onValidationError,
// }: ProfileValidation2Props) {
//   const [userType, setUserType] = useState<number>(1);
//   const [identityType, setIdentityType] = useState<'DNI' | 'PASSPORT' | ''>('');
//   const [identityNumber, setIdentityNumber] = useState('');
//   const [licenceNumber, setLicenceNumber] = useState('');
//   const [identityFiles, setIdentityFiles] = useState<( {uri: string, name: string, type: string} | null )[]>([null, null]);
//   const [licenceFiles, setLicenceFiles] = useState<( {uri: string, name: string, type: string} | null )[]>([null, null]);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({
//     identityType: false,
//     identityNumber: false,
//     identityFiles: false,
//     licenceNumber: false,
//     licenceFiles: false,
//   });

//   const pickSingleFile = async (
//     currentFiles: ( {uri: string, name: string, type: string} | null )[],
//     setFiles: React.Dispatch<React.SetStateAction<( {uri: string, name: string, type: string} | null )[]>>,
//     index: number
//   ) => {
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         allowsMultipleSelection: false,
//         quality: 0.8,
//         mediaTypes: ImagePicker.MediaTypeOptions.Images, 
//         base64: false,
//       });

//       if (!result.canceled && result.assets.length > 0) {
//         const asset = result.assets[0];
//         const fileType = asset.mimeType || 'image/jpeg';
//         const file = {
//           uri: asset.uri,
//           name: asset.fileName || asset.uri.split('/').pop() || `image_${Date.now()}.jpg`,
//           type: fileType,
//         };
//         const updated = [...currentFiles];
//         updated[index] = file;
//         setFiles(updated);
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Hubo un problema al seleccionar la imagen.');
//       onValidationError?.(error);
//     }
//   };

//   const removeFile = (
//     currentFiles: ( {uri: string, name: string, type: string} | null )[],
//     setFiles: React.Dispatch<React.SetStateAction<( {uri: string, name: string, type: string} | null )[]>>,
//     index: number
//   ) => {
//     const updated = [...currentFiles];
//     updated[index] = null;
//     setFiles(updated);
//   };

//   const handleSubmit = async () => {
//     let hasError = false;
//     const newErrors = {
//       identityType: false,
//       identityNumber: false,
//       identityFiles: false,
//       licenceNumber: false,
//       licenceFiles: false,
//     };

//     if ([1, 3].includes(userType)) {
//       if (!identityType) newErrors.identityType = true;
//       if (!identityNumber.trim()) newErrors.identityNumber = true;
//       if (identityFiles[0] === null || identityFiles[1] === null) newErrors.identityFiles = true;
//     }
//     if ([2, 3].includes(userType)) {
//       if (!licenceNumber.trim()) newErrors.licenceNumber = true;
//       if (licenceFiles[0] === null || licenceFiles[1] === null) newErrors.licenceFiles = true;
//     }
    
//     hasError = Object.values(newErrors).some(Boolean);
//     setErrors(newErrors);

//     if (hasError) {
//       Alert.alert('Error', 'Completa todos los campos obligatorios antes de continuar.');
//       onValidationError?.('Faltan datos o imágenes');
//       return;
//     }
    
//     setLoading(true);
//     try {
//       const userService = new UserService();
//       const formData = new FormData();
      
//       // Mapeo para Prisma: 'DNI' -> 'ID'
//       const prismicIdentityType = identityType === 'DNI' ? 'ID' : identityType;

//       // 1. Añadir los campos del DTO
//       formData.append('user_type', String(userType));
      
//       if (prismicIdentityType) {
//         formData.append('identity_document_type', prismicIdentityType);
//       }
//       if (identityNumber.trim()) {
//         formData.append('identity_document_number', identityNumber.trim());
//       }
//       if (licenceNumber.trim()) {
//         formData.append('licence_document_number', licenceNumber.trim());
//       }
      
//       // 2. Procesar y adjuntar los archivos de identidad (si aplican)
//       if ([1, 3].includes(userType)) {
//         const identityFilesToUpload = identityFiles.filter(Boolean);
//         for (const file of identityFilesToUpload) {
//           const blob = await new Promise<Blob>((resolve, reject) => {
//             const xhr = new XMLHttpRequest();
//             xhr.onload = function() { resolve(xhr.response); };
//             xhr.onerror = function() { reject(new Error('URI a Blob fallido')); };
//             xhr.responseType = 'blob';
//             xhr.open('GET', file!.uri, true);
//             xhr.send(null);
//           });
//           formData.append('files', blob, file!.name);
//         }
//       }
      
//       // 3. Procesar y adjuntar los archivos de licencia (si aplican)
//       if ([2, 3].includes(userType)) {
//         const licenceFilesToUpload = licenceFiles.filter(Boolean);
//         for (const file of licenceFilesToUpload) {
//           const blob = await new Promise<Blob>((resolve, reject) => {
//             const xhr = new XMLHttpRequest();
//             xhr.onload = function() { resolve(xhr.response); };
//             xhr.onerror = function() { reject(new Error('URI a Blob fallido')); };
//             xhr.responseType = 'blob';
//             xhr.open('GET', file!.uri, true);
//             xhr.send(null);
//           });
//           formData.append('files', blob, file!.name);
//         }
//       }
      
//       await userService.updateUserStep2(userId, formData);
//       Alert.alert('Éxito', 'Validación enviada correctamente.');
//       onValidationSuccess?.();
//     } catch (error: any) {
//       console.error('Error al validar usuario:', error);
//       const errorMessage = error?.response?.data?.message || error?.message || 'Error en la validación.';
//       Alert.alert('Error', errorMessage);
//       onValidationError?.(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View className="p-6">
//       <Text className="mb-4 text-center font-head text-3xl text-gray-800">
//         Validación de Documentos
//       </Text>
//       <Text className="mb-6 font-body text-base text-gray-700">
//         Para continuar, necesitamos tus documentos oficiales según el tipo de usuario que elijas.
//       </Text>

//       {/* Tipo de usuario */}
//       <View className="mb-4">
//         <Text className="mb-2 font-body text-gray-800">Tipo de usuario</Text>
//         {[
//           { type: 1, label: 'Propietario (subiré mis carros)' },
//           { type: 2, label: 'Cliente (quiero un carro para mí)' },
//           { type: 3, label: 'Ambos (haré las 2 cosas)' },
//         ].map(({ type, label }) => (
//           <TouchableOpacity
//             key={type}
//             className={`mb-2 rounded-lg border p-3 ${userType === type ? 'border-blue-600' : 'border-gray-300'}`}
//             onPress={() => setUserType(type)}>
//             <Text className="font-body text-gray-800">{label}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Documentos de identidad */}
//       {[1, 3].includes(userType) && (
//         <>
//           <Text className="mb-2 font-body text-gray-800">Tipo de documento de identidad</Text>
//           <View className="mb-4 flex-row gap-4">
//             {[
//               { key: 'DNI', label: 'DNI de mi país' },
//               { key: 'PASSPORT', label: 'Pasaporte' },
//             ].map((opt) => (
//               <TouchableOpacity
//                 key={opt.key}
//                 className={`flex-1 rounded-lg border p-3 ${
//                   identityType === opt.key
//                     ? 'border-blue-600'
//                     : errors.identityType
//                       ? 'border-red-500'
//                       : 'border-gray-300'
//                 }`}
//                 onPress={() => {
//                   setIdentityType(opt.key as 'DNI' | 'PASSPORT');
//                   setErrors((prev) => ({ ...prev, identityType: false }));
//                 }}>
//                 <Text className="text-center font-body text-gray-800">{opt.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           <TextInput
//             placeholder="Número de documento"
//             value={identityNumber}
//             onChangeText={(text) => {
//               setIdentityNumber(text);
//               setErrors((prev) => ({ ...prev, identityNumber: false }));
//             }}
//             className={`mb-4 rounded-xl border px-4 py-3 font-body text-base text-gray-800 ${
//               errors.identityNumber ? 'border-red-500' : 'border-gray-300'
//             }`}
//             placeholderTextColor="#A0A0A0"
//           />

//           <Text className="mb-2 font-body text-gray-800">Subir documento de identidad</Text>
//           <View className="mb-4 flex-row gap-4">
//             {['Foto frontal', 'Foto posterior'].map((label, index) => (
//               <TouchableOpacity
//                 key={index}
//                 className={`flex-1 items-center justify-center rounded-xl border p-3 ${
//                   identityFiles[index]
//                     ? 'border-blue-600'
//                     : errors.identityFiles
//                       ? 'border-red-500'
//                       : 'border-blue-600'
//                 }`}
//                 onPress={() => pickSingleFile(identityFiles, setIdentityFiles, index)}
//                 onLongPress={() =>
//                   identityFiles[index] && removeFile(identityFiles, setIdentityFiles, index)
//                 }>
//                 {identityFiles[index] ? (
//                   <Image
//                     source={{ uri: identityFiles[index]!.uri }}
//                     style={{ width: 80, height: 80, borderRadius: 8 }}
//                   />
//                 ) : (
//                   <Text className="font-body text-blue-600">{label}</Text>
//                 )}
//               </TouchableOpacity>
//             ))}
//           </View>
//         </>
//       )}

//       {/* Licencia de conducir */}
//       {[2, 3].includes(userType) && (
//         <>
//           <Text className="mb-2 font-body text-gray-800">Licencia de conducir:</Text>
//           <TextInput
//             placeholder="Número de licencia de conducir"
//             value={licenceNumber}
//             onChangeText={(text) => {
//               setLicenceNumber(text);
//               setErrors((prev) => ({ ...prev, licenceNumber: false }));
//             }}
//             className={`mb-4 rounded-xl border px-4 py-3 font-body text-base text-gray-800 ${
//               errors.licenceNumber ? 'border-red-500' : 'border-gray-300'
//             }`}
//             placeholderTextColor="#A0A0A0"
//           />

//           <Text className="mb-2 font-body text-gray-800">Subir licencia de conducir</Text>
//           <View className="mb-4 flex-row gap-4">
//             {['Foto frontal', 'Foto posterior'].map((label, index) => (
//               <TouchableOpacity
//                 key={index}
//                 className={`flex-1 items-center justify-center rounded-xl border p-3 ${
//                   licenceFiles[index]
//                     ? 'border-blue-600'
//                     : errors.licenceFiles
//                       ? 'border-red-500'
//                       : 'border-blue-600'
//                 }`}
//                 onPress={() => pickSingleFile(licenceFiles, setLicenceFiles, index)}
//                 onLongPress={() =>
//                   licenceFiles[index] && removeFile(licenceFiles, setLicenceFiles, index)
//                 }>
//                 {licenceFiles[index] ? (
//                   <Image
//                     source={{ uri: licenceFiles[index]!.uri }}
//                     style={{ width: 80, height: 80, borderRadius: 8 }}
//                   />
//                 ) : (
//                   <Text className="font-body text-blue-600">{label}</Text>
//                 )}
//               </TouchableOpacity>
//             ))}
//           </View>
//         </>
//       )}

//       <TouchableOpacity
//         className={`rounded-xl py-3 ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
//         onPress={handleSubmit}
//         disabled={loading}>
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text className="text-center font-body text-base font-semibold text-white">
//             Enviar validación
//           </Text>
//         )}
//       </TouchableOpacity>
//     </View>
//   );
// }

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { UserService } from 'services/users.service';

interface ProfileValidation2Props {
  userId: number;
  onValidationSuccess?: () => void;
  onValidationError?: (error?: any) => void;
}

export interface updateUserStep2DTO {
  user_type: number;
  identity_document_type?: string;
  identity_document_number?: string;
  licence_document_number?: string;
}

export default function ProfileValidation2({
  userId,
  onValidationSuccess,
  onValidationError,
}: ProfileValidation2Props) {
  const [userType, setUserType] = useState<number>(1);
  const [identityType, setIdentityType] = useState<'DNI' | 'PASSPORT' | ''>('');
  const [identityNumber, setIdentityNumber] = useState('');
  const [licenceNumber, setLicenceNumber] = useState('');
  const [identityFiles, setIdentityFiles] = useState<( {uri: string, name: string, type: string} | null )[]>([null, null]);
  const [licenceFiles, setLicenceFiles] = useState<( {uri: string, name: string, type: string} | null )[]>([null, null]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    identityType: false,
    identityNumber: false,
    identityFiles: false,
    licenceNumber: false,
    licenceFiles: false,
  });

  const pickSingleFile = async (
    currentFiles: ( {uri: string, name: string, type: string} | null )[],
    setFiles: React.Dispatch<React.SetStateAction<( {uri: string, name: string, type: string} | null )[]>>,
    index: number
  ) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: false,
        quality: 0.8,
        mediaTypes: ImagePicker.MediaTypeOptions.Images, 
        base64: false,
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileType = asset.mimeType || 'image/jpeg';
        const file = {
          uri: asset.uri,
          name: asset.fileName || asset.uri.split('/').pop() || `image_${Date.now()}.jpg`,
          type: fileType,
        };
        const updated = [...currentFiles];
        updated[index] = file;
        setFiles(updated);
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al seleccionar la imagen.');
      onValidationError?.(error);
    }
  };

  const removeFile = (
    currentFiles: ( {uri: string, name: string, type: string} | null )[],
    setFiles: React.Dispatch<React.SetStateAction<( {uri: string, name: string, type: string} | null )[]>>,
    index: number
  ) => {
    const updated = [...currentFiles];
    updated[index] = null;
    setFiles(updated);
  };

  const handleSubmit = async () => {
    let hasError = false;
    const newErrors = {
      identityType: false,
      identityNumber: false,
      identityFiles: false,
      licenceNumber: false,
      licenceFiles: false,
    };

    // Validar que todos los campos y archivos estén presentes, independientemente del tipo de usuario
    if (!identityType) newErrors.identityType = true;
    if (!identityNumber.trim()) newErrors.identityNumber = true;
    if (identityFiles[0] === null || identityFiles[1] === null) newErrors.identityFiles = true;
    if (!licenceNumber.trim()) newErrors.licenceNumber = true;
    if (licenceFiles[0] === null || licenceFiles[1] === null) newErrors.licenceFiles = true;

    hasError = Object.values(newErrors).some(Boolean);
    setErrors(newErrors);

    if (hasError) {
      Alert.alert('Error', 'Completa todos los campos obligatorios antes de continuar.');
      onValidationError?.('Faltan datos o imágenes');
      return;
    }
    
    setLoading(true);
    try {
      const userService = new UserService();
      const formData = new FormData();
      
      // Mapeo para Prisma: 'DNI' -> 'ID'
      const prismicIdentityType = identityType === 'DNI' ? 'ID' : identityType;

      // 1. Añadir los campos del DTO
      formData.append('user_type', String(userType));
      
      if (prismicIdentityType) {
        formData.append('identity_document_type', prismicIdentityType);
      }
      if (identityNumber.trim()) {
        formData.append('identity_document_number', identityNumber.trim());
      }
      if (licenceNumber.trim()) {
        formData.append('licence_document_number', licenceNumber.trim());
      }
      
      // 2. Procesar y adjuntar los archivos de identidad (siempre)
      const identityFilesToUpload = identityFiles.filter(Boolean);
      for (const file of identityFilesToUpload) {
        const blob = await new Promise<Blob>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function() { resolve(xhr.response); };
          xhr.onerror = function() { reject(new Error('URI a Blob fallido')); };
          xhr.responseType = 'blob';
          xhr.open('GET', file!.uri, true);
          xhr.send(null);
        });
        formData.append('files', blob, file!.name);
      }
      
      // 3. Procesar y adjuntar los archivos de licencia (siempre)
      const licenceFilesToUpload = licenceFiles.filter(Boolean);
      for (const file of licenceFilesToUpload) {
        const blob = await new Promise<Blob>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function() { resolve(xhr.response); };
          xhr.onerror = function() { reject(new Error('URI a Blob fallido')); };
          xhr.responseType = 'blob';
          xhr.open('GET', file!.uri, true);
          xhr.send(null);
        });
        formData.append('files', blob, file!.name);
      }
      
      await userService.updateUserStep2(userId, formData);
      Alert.alert('Éxito', 'Validación enviada correctamente.');
      onValidationSuccess?.();
    } catch (error: any) {
      console.error('Error al validar usuario:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Error en la validación.';
      Alert.alert('Error', errorMessage);
      onValidationError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="p-6">
      <Text className="mb-4 text-center font-head text-3xl text-gray-800">
        Validación de Documentos
      </Text>
      <Text className="mb-6 font-body text-base text-gray-700">
        Para continuar, necesitamos tus documentos oficiales.
      </Text>

      {/* Tipo de usuario */}
      <View className="mb-4">
        <Text className="mb-2 font-body text-gray-800">Tipo de usuario</Text>
        {[
          { type: 1, label: 'Propietario (subiré mis carros)' },
          { type: 2, label: 'Cliente (quiero un carro para mí)' },
          { type: 3, label: 'Ambos (haré las 2 cosas)' },
        ].map(({ type, label }) => (
          <TouchableOpacity
            key={type}
            className={`mb-2 rounded-lg border p-3 ${userType === type ? 'border-blue-600' : 'border-gray-300'}`}
            onPress={() => setUserType(type)}>
            <Text className="font-body text-gray-800">{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Documentos de identidad (ahora siempre visible) */}
      <>
        <Text className="mb-2 font-body text-gray-800">Tipo de documento de identidad</Text>
        <View className="mb-4 flex-row gap-4">
          {[
            { key: 'DNI', label: 'DNI de mi país' },
            { key: 'PASSPORT', label: 'Pasaporte' },
          ].map((opt) => (
            <TouchableOpacity
              key={opt.key}
              className={`flex-1 rounded-lg border p-3 ${
                identityType === opt.key
                  ? 'border-blue-600'
                  : errors.identityType
                    ? 'border-red-500'
                    : 'border-gray-300'
              }`}
              onPress={() => {
                setIdentityType(opt.key as 'DNI' | 'PASSPORT');
                setErrors((prev) => ({ ...prev, identityType: false }));
              }}>
              <Text className="text-center font-body text-gray-800">{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          placeholder="Número de documento"
          value={identityNumber}
          onChangeText={(text) => {
            setIdentityNumber(text);
            setErrors((prev) => ({ ...prev, identityNumber: false }));
          }}
          className={`mb-4 rounded-xl border px-4 py-3 font-body text-base text-gray-800 ${
            errors.identityNumber ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholderTextColor="#A0A0A0"
        />

        <Text className="mb-2 font-body text-gray-800">Subir documento de identidad</Text>
        <View className="mb-4 flex-row gap-4">
          {['Foto frontal', 'Foto posterior'].map((label, index) => (
            <TouchableOpacity
              key={index}
              className={`flex-1 items-center justify-center rounded-xl border p-3 ${
                identityFiles[index]
                  ? 'border-blue-600'
                  : errors.identityFiles
                    ? 'border-red-500'
                    : 'border-blue-600'
              }`}
              onPress={() => pickSingleFile(identityFiles, setIdentityFiles, index)}
              onLongPress={() =>
                identityFiles[index] && removeFile(identityFiles, setIdentityFiles, index)
              }>
              {identityFiles[index] ? (
                <Image
                  source={{ uri: identityFiles[index]!.uri }}
                  style={{ width: 80, height: 80, borderRadius: 8 }}
                />
              ) : (
                <Text className="font-body text-blue-600">{label}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </>

      {/* Licencia de conducir (ahora siempre visible) */}
      <>
        <Text className="mb-2 font-body text-gray-800">Licencia de conducir:</Text>
        <TextInput
          placeholder="Número de licencia de conducir"
          value={licenceNumber}
          onChangeText={(text) => {
            setLicenceNumber(text);
            setErrors((prev) => ({ ...prev, licenceNumber: false }));
          }}
          className={`mb-4 rounded-xl border px-4 py-3 font-body text-base text-gray-800 ${
            errors.licenceNumber ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholderTextColor="#A0A0A0"
        />

        <Text className="mb-2 font-body text-gray-800">Subir licencia de conducir</Text>
        <View className="mb-4 flex-row gap-4">
          {['Foto frontal', 'Foto posterior'].map((label, index) => (
            <TouchableOpacity
              key={index}
              className={`flex-1 items-center justify-center rounded-xl border p-3 ${
                licenceFiles[index]
                  ? 'border-blue-600'
                  : errors.licenceFiles
                    ? 'border-red-500'
                    : 'border-blue-600'
              }`}
              onPress={() => pickSingleFile(licenceFiles, setLicenceFiles, index)}
              onLongPress={() =>
                licenceFiles[index] && removeFile(licenceFiles, setLicenceFiles, index)
              }>
              {licenceFiles[index] ? (
                <Image
                  source={{ uri: licenceFiles[index]!.uri }}
                  style={{ width: 80, height: 80, borderRadius: 8 }}
                />
              ) : (
                <Text className="font-body text-blue-600">{label}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </>

      <TouchableOpacity
        className={`rounded-xl py-3 ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
        onPress={handleSubmit}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-center font-body text-base font-semibold text-white">
            Enviar validación
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}