import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserRole } from '../types';

interface User {
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  parentId?: string;
  permissions?: string[];
}

interface AuthContextType {
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (user: User) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
  user: User | null;
  registeredUsers: User[];
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('admin');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('ktm_users');
    if (saved) return JSON.parse(saved);
    return [
      { name: 'Admin Kilometro 0', email: '12345', password: '12345', role: 'admin' },
      { name: 'Comercio Local S.A.', email: 'tienda@test.com', password: 'password', role: 'tienda' },
      { name: 'Carlos (Rider 04)', email: 'rider@test.com', password: 'password', role: 'motorizado' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('ktm_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const login = (email: string, password: string) => {
    const user = registeredUsers.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      setRole(user.role);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const register = (newUser: User) => {
    setRegisteredUsers(prev => [...prev, newUser]);
  };

  const updateUser = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setRegisteredUsers(prev => prev.map(u => u.email === currentUser.email ? updated : u));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      role, 
      isAuthenticated,
      login,
      register,
      updateUser,
      logout,
      setRole,
      user: currentUser,
      registeredUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
