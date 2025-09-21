import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users database
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Quản trị viên',
    avatar: 'https://picsum.photos/seed/admin/40/40',
    role: 'Admin'
  },
  {
    id: '2',
    email: 'sale@example.com',
    password: 'sale123',
    name: 'Nhân viên Sales',
    avatar: 'https://picsum.photos/seed/sales/40/40',
    role: 'Sales Executive'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user in mock database
      const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const userToSave: User = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          avatar: foundUser.avatar,
          role: foundUser.role
        };
        
        setUser(userToSave);
        localStorage.setItem('currentUser', JSON.stringify(userToSave));
        setIsLoading(false);
        return true;
      } else {
        setError('Email hoặc mật khẩu không đúng');
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      setError('Đã xảy ra lỗi khi đăng nhập');
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if email already exists
      const existingUser = MOCK_USERS.find(u => u.email === email);
      if (existingUser) {
        setError('Email này đã được sử dụng');
        setIsLoading(false);
        return false;
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        avatar: `https://picsum.photos/seed/${email}/40/40`,
        role: 'Sales Executive'
      };

      // Add to mock database (in real app, this would be API call)
      MOCK_USERS.push({
        ...newUser,
        password
      });

      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    } catch (error) {
      setError('Đã xảy ra lỗi khi đăng ký');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    setError(null);
  };

  const contextValue: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
    error
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};