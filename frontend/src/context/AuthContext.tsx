import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  authProvider: 'google' | 'email' | 'phone';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (provider: 'google' | 'email' | 'phone', credentials?: { email?: string; password?: string; phone?: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
  authToken: string | null;
  setAuthInfo: (token: string, tokenType: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const storedAuthToken = localStorage.getItem('authToken');
    if (storedAuthToken) {
      setAuthToken(storedAuthToken);
    }
    setLoading(false);
  }, []);

  const setAuthInfo = (token: string, tokenType: string) => {
    setAuthToken(`${tokenType} ${token}`);
    localStorage.setItem('authToken', `${tokenType} ${token}`);
  };


  const login = async (provider: 'google' | 'email' | 'phone', credentials?: { email?: string; password?: string; phone?: string }) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock user data - replace with actual API call
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: credentials?.email || 'john@example.com',
        authProvider: provider,
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading, authToken, setAuthInfo }}>
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
