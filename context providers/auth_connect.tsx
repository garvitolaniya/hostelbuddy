import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'user' | 'admin';

interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const storedUser = localStorage.getItem('hostelHelperUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  
  useEffect(() => {
    if (user) {
      localStorage.setItem('hostelHelperUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('hostelHelperUser');
    }
  }, [user]);

  // Login function
  const login = async (username: string, password: string) => {
    setLoading(true);
    
    
    try {
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      
      const role: UserRole = username.toLowerCase() === 'admin' && password === 'admin' 
        ? 'admin' 
        : 'user';
      
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: username,
        role,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`,
      };
      
      setUser(newUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
  };

  // Function to switch between user and admin roles (for demo)
  const switchRole = () => {
    if (!user) return;
    
    setUser({
      ...user,
      role: user.role === 'admin' ? 'user' : 'admin'
    });
  };

  const value = {
    user,
    loading,
    login,
    logout,
    switchRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

