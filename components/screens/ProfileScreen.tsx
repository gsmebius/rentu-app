import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { getUserStatusFromService, useAuth } from 'auth/AuthContext';
import ProfileView from 'components/entities/profile/ProfileView';
import ProfileValidationView from 'components/entities/profile/ProfileValidationView';

export default function ProfileScreen() {
  const { user } = useAuth();
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!user?.id) return;

      try {
        const result = await getUserStatusFromService(user.id);
        setStatus(result); // Suponiendo que retorna solo el número: 0, 1, 2, 3...
      } catch (error) {
        console.error('Error fetching status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [user?.id]);

  if (!user || loading || status === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return status >= 3 ? <ProfileView /> : <ProfileValidationView />;
}
