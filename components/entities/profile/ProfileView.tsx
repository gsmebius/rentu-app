import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Modal } from 'react-native';
import { useAuth } from 'auth/AuthContext';

const defaultProfileImage = require('assets/profile-default.webp');

export default function ProfileView() {
  const { user, logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  const profileImageUri = user?.profile_image || null;

  const handleConfirmLogout = async () => {
    setModalVisible(false);
    try {
      await logout();
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
  };

  const menuItems = [
    { label: 'Editar Perfil', onPress: () => {} },
    { label: 'Subir foto de perfil', onPress: () => {} },
    { label: 'Roles de usuario', onPress: () => {} },
    { label: 'Sobre Rentu', onPress: () => {} },
    { label: 'Cerrar sesión', onPress: () => setModalVisible(true) },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={profileImageUri ? { uri: profileImageUri } : defaultProfileImage}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>
          {user ? `${user.names} ${user.last_names}` : 'Usuario'}
        </Text>
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        {menuItems.map(({ label, onPress }, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [styles.menuButton, pressed && { backgroundColor: '#f0f0f0' }]}
            onPress={onPress}
          >
            <Text style={styles.menuButtonText}>{label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Modal de confirmación */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Cerrar sesión</Text>
            <Text style={styles.modalMessage}>¿Estás seguro que deseas cerrar sesión?</Text>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: '#ddd' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, { backgroundColor: '#f87171' }]}
                onPress={handleConfirmLogout}
              >
                <Text style={styles.modalButtonText}>Sí, cerrar sesión</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f9fafb',
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
    paddingHorizontal: 12,
  },
  menuButtonText: {
    fontSize: 18,
    color: '#374151',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
