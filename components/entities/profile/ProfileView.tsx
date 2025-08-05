import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from 'auth/AuthContext';

const defaultProfileImage = require('assets/profile-default.webp');

export default function ProfileView() {
  const { user, logout } = useAuth();

  const profileImageUri = user?.profile_image || null;

  const menuItems = [
    { label: 'Editar Perfil', onPress: () => {} },
    { label: 'Subir foto de perfil', onPress: () => {} },
    { label: 'Roles de usuario', onPress: () => {} },
    { label: 'Sobre Rentu', onPress: () => {} },
    { label: 'Cerrar sesión', onPress: () => logout() },
  ];

  return (
    <View className="p-20" style={styles.container}>
      <View style={styles.header}>
        <Image
          source={profileImageUri ? { uri: profileImageUri } : defaultProfileImage}
          style={styles.profileImage}
        />
        <Text className="font-head" style={styles.userName}>{user ? `${user.names} ${user.last_names}` : 'Usuario'}</Text>
      </View>

      <View style={styles.menu}>
        {menuItems.map(({ label, onPress }, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuButton}
            onPress={onPress}
            activeOpacity={0.7}>
            <Text className="font-body" style={styles.menuButtonText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ddd',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
  },
  menu: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  menuButton: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  menuButtonText: {
    fontSize: 18,
    color: '#374151',
  },
});
