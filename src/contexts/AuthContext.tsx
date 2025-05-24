'use client';

import type { AuthUser, User } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { users as mockUsers, ADMIN_CREDENTIALS } from '@/lib/mockData'; // For demo purposes
import { useRouter } from 'next/navigation';

interface AuthContextType {
  currentUser: AuthUser | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<AuthUser | null>;
  signup: (userData: Omit<User, 'id' | 'linkedQrCodes'>) => Promise<AuthUser | null>;
  logout: () => void;
  adminLogin: (username: string, pass: string) => Promise<boolean>;
  updateCurrentUser: (updatedUser: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<AuthUser | null> => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      if (response.ok) {
        const { user, token } = await response.json();
        setCurrentUser(user);
        setIsAdmin(false);
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('token', token);
        setLoading(false);
        return user;
      }
      throw new Error('Invalid credentials');
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const signup = async (userData: Omit<User, 'id' | 'linkedQrCodes'>): Promise<AuthUser | null> => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        const { user, token } = await response.json();
        setCurrentUser(user);
        setIsAdmin(false);
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('token', token);
        setLoading(false);
        return user;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    router.push('/login');
  };

  const adminLogin = async (username: string, pass: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pass }),
      });
      if (response.ok) {
        setCurrentUser(null);
        setIsAdmin(true);
        localStorage.setItem('isAdmin', 'true');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (error: any) {
      setLoading(false);
      return false;
    }
  };

  const updateCurrentUser = (updatedFields: Partial<AuthUser>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updatedFields };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAdmin, loading, login, signup, logout, adminLogin, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
