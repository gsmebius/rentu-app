import { useEffect, useState } from 'react';
import { getUserStatusFromService, useAuth } from 'auth/AuthContext';
import ProfileView from 'components/entities/profile/ProfileView';
import ProfileValidationView from 'components/entities/profile/ProfileValidationView';
import LoadingView from 'components/ui/LoadingView';
import EmptyProfile from 'components/entities/profile/EmptyProfile';

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

  if (loading) {
    return <LoadingView />;
  }

  if (!user || status === null) {
    return <EmptyProfile />;
  }

  return status >= 3 ? <ProfileView /> : <ProfileValidationView />;
}
