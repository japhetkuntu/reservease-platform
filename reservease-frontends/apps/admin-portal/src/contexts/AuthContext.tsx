import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, AdminProfile } from '@/api/auth';

interface AuthContextType {
  user: AdminProfile | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('reservease_admin_token');
    localStorage.removeItem('reservease_admin_refresh');
    setUser(null);
    window.location.href = '/login';
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const profile = await authApi.getProfile();
      setUser(profile);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  const login = async (credentials: any) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);
      localStorage.setItem('reservease_admin_token', response.accessToken);
      localStorage.setItem('reservease_admin_refresh', response.refreshToken);
      await fetchProfile();
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('reservease_admin_token');
    if (token) {
      fetchProfile();
    } else {
      setIsLoadingUnchecked(false);
    }
  }, [fetchProfile]);

  // Temporary helper to handle state correctly
  function setIsLoadingUnchecked(val: boolean) {
      setIsLoading(val);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
