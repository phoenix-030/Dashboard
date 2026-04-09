import { useAuth } from '../auth/AuthContext';

export const useSession = () => {
  const { user, isAuthenticated, loading } = useAuth();
  
  return {
    user,
    isAuthenticated,
    loading,
    isSessionActive: isAuthenticated && !!user
  };
};
