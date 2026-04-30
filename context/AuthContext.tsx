import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

// --- Types ---
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'PHOTOGRAPHER';
  avatar?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'PHOTOGRAPHER';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  isPhotographer: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshToken: () => Promise<void>;
  checkAuth: () => boolean;
}

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080/api/v0.1';

// Axios instance with auth interceptor
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check and restore session
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');
        
        if (savedUser && savedToken) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setToken(savedToken);
          
          // Optional: Verify token with backend
          // await verifyToken(savedToken);
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };
    
    restoreSession();
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { token: authToken, user: userData } = response.data;
      
      if (!authToken || !userData) {
        throw new Error('Invalid response from server');
      }
      
      setUser(userData);
      setToken(authToken);
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', authToken);
      
      toast.success('Login successful!', {
        description: `Welcome back, ${userData.name || userData.email}!`,
        duration: 3000,
      });
      
      return;
    } catch (error: any) {
      console.error('Login error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Login failed. Please try again.';
      
      toast.error('Login failed', {
        description: errorMessage,
        duration: 4000,
      });
      
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/register', userData);
      const { token: authToken, user: newUser } = response.data;
      
      if (!authToken || !newUser) {
        throw new Error('Invalid response from server');
      }
      
      setUser(newUser);
      setToken(authToken);
      
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', authToken);
      
      toast.success('Registration successful!', {
        description: `Welcome to Jemigraph, ${newUser.name}!`,
        duration: 3000,
      });
      
      return;
    } catch (error: any) {
      console.error('Registration error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Registration failed. Please try again.';
      
      toast.error('Registration failed', {
        description: errorMessage,
        duration: 4000,
      });
      
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    toast.info('Logged out', {
      description: 'You have been successfully logged out.',
      duration: 2000,
    });
  }, []);

  // Update user data
  const updateUser = useCallback((userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }, [user]);

  // Refresh token
  const refreshToken = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await apiClient.post('/auth/refresh-token', { token });
      const { token: newToken } = response.data;
      
      if (newToken) {
        setToken(newToken);
        localStorage.setItem('token', newToken);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  }, [token, logout]);

  // Check authentication status
  const checkAuth = useCallback(() => {
    const hasToken = !!localStorage.getItem('token');
    const hasUser = !!localStorage.getItem('user');
    return hasToken && hasUser && !!user;
  }, [user]);

  // Memoized values
  const isAdmin = useMemo(() => user?.role === 'ADMIN', [user]);
  const isPhotographer = useMemo(() => user?.role === 'PHOTOGRAPHER', [user]);
  const isAuthenticated = useMemo(() => !!user && !!token, [user, token]);

  const value = {
    user,
    token,
    isAdmin,
    isPhotographer,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    updateUser,
    refreshToken,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Helper hook for protected routes
export const useRequireAuth = (redirectTo: string = '/auth/login') => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);
  
  return { isAuthenticated, isLoading };
};

// Helper hook for role-based access
export const useRequireRole = (allowedRoles: Array<'ADMIN' | 'PHOTOGRAPHER'>, redirectTo: string = '/dashboard') => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
      } else if (user && !allowedRoles.includes(user.role)) {
        router.push(redirectTo);
        toast.error('Access Denied', {
          description: 'You do not have permission to access this page.',
        });
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router, redirectTo]);
  
  return { user, isAuthenticated, isLoading };
};

// Import router for helper hooks
import { useRouter } from 'next/navigation';