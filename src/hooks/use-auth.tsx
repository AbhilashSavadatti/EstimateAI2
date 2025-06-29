import { useState, useEffect, createContext, useContext } from 'react';
import { api } from '@/lib/api';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  company_name: string;
  subscription_tier: 'free' | 'basic' | 'premium' | 'enterprise';
  avatarUrl?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<User>;
}

interface RegisterData {
  name: string;
  email: string;
  companyName: string;
  password: string;
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('estimateai-token');
      
      if (token) {
        try {
          const userData = await api.auth.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          localStorage.removeItem('estimateai-token');
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    
    try {
      const response = await api.auth.login(email, password);
      localStorage.setItem('estimateai-token', response.token);
      setUser(response.user);
      return response.user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<User> => {
    setIsLoading(true);
    
    try {
      const response = await api.auth.register({
        name: data.name,
        email: data.email,
        company_name: data.companyName,
        password: data.password,
      });
      
      localStorage.setItem('estimateai-token', response.token);
      setUser(response.user);
      return response.user;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('estimateai-token');
    setUser(null);
  };

  const updateUser = async (data: Partial<User>): Promise<User> => {
    try {
      const updatedUser = await api.auth.updateUser(data);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};