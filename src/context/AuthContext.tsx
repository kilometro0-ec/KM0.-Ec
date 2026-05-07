import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserRole } from '../types';
import { useNotifications } from './NotificationContext';

interface User {
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  parentId?: string;
  permissions?: string[];
  status?: 'active' | 'suspended' | 'inactive';
}

interface AuthContextType {
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (user: User) => void;
  updateUser: (data: Partial<User>) => void;
  updateAnyUser: (email: string, data: Partial<User>) => void;
  deleteUser: (email: string) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
  user: User | null;
  registeredUsers: User[];
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { notify } = useNotifications();
  const [role, setRole] = useState<UserRole>('admin');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('km0_users');
    if (saved) return JSON.parse(saved);
    return [
      { name: 'Admin Kilometro 0', email: '12345', password: '12345', role: 'admin' },
      { name: 'Comercio Local S.A.', email: 'tienda@test.com', password: 'password', role: 'tienda' },
      { name: 'Carlos (Rider 04)', email: 'rider@test.com', password: 'password', role: 'motorizado' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('km0_users', JSON.stringify(registeredUsers));

    // Sync with Google Sheets
    const syncWithSheets = async () => {
      try {
        const response = await fetch('/api/sync/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registeredUsers)
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Server error during sync');
        }
      } catch (err: any) {
        console.error('Failed to sync users with sheets:', err);
        notify('Error de Sincronización', `No se pudo enviar los usuarios a Google Sheets: ${err.message}`, 'alert' as any);
      }
    };
    
    const timeoutId = setTimeout(syncWithSheets, 2000); 
    return () => clearTimeout(timeoutId);
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

  const updateAnyUser = (email: string, data: Partial<User>) => {
    setRegisteredUsers(prev => prev.map(u => u.email === email ? { ...u, ...data } : u));
  };

  const deleteUser = (email: string) => {
    setRegisteredUsers(prev => prev.filter(u => u.email !== email));
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
      updateAnyUser,
      deleteUser,
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
