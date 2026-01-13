import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, RegisterCredentials, ApiResponse } from '@/types/user';
import { api } from '@/services/api';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<ApiResponse<User>>;
  register: (credentials: RegisterCredentials) => Promise<ApiResponse<User>>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          api.setToken(token);
          const response = await api.getCurrentUser();
          if (response.success && response.user) {
            const userData = response.user as User & { role?: string; createdAt: string };
            setUser({
              id: userData.id,
              email: userData.email,
              name: userData.name,
              createdAt: new Date(userData.createdAt)
            });
            setIsAuthenticated(true);
            setIsAdmin(userData.role === 'admin');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Clear invalid token
        localStorage.removeItem('auth_token');
        api.setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<ApiResponse<User>> => {
    try {
      const response = await api.login(credentials.email, credentials.password);
      
      if (response.success && response.token && response.user) {
        api.setToken(response.token);
        const userData = response.user as User & { role?: string; createdAt: string };
        const mappedUser: User = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          createdAt: new Date(userData.createdAt)
        };
        
        setUser(mappedUser);
        setIsAuthenticated(true);
        setIsAdmin(userData.role === 'admin');

        return { success: true, data: mappedUser };
      }
      
      throw new Error('Login failed: Invalid response');
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<ApiResponse<User>> => {
    try {
      const response = await api.register(credentials.email, credentials.password, credentials.name);
      
      if (response.success && response.token && response.user) {
        api.setToken(response.token);
        const userData = response.user as User & { role?: string; createdAt: string };
        const mappedUser: User = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          createdAt: new Date(userData.createdAt)
        };
        
        setUser(mappedUser);
        setIsAuthenticated(true);
        setIsAdmin(userData.role === 'admin');

        return { success: true, data: mappedUser };
      }
      
      throw new Error('Registration failed: Invalid response');
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    api.setToken(null);
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      login, 
      register, 
      logout,
      isAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
