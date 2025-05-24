'use client';

import type { AuthUser, User } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { users as mockUsers, ADMIN_CREDENTIALS } from '@/lib/mockData'; // For demo purposes

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

  useEffect(() => {
    // Simulate checking for persisted login state (e.g., from localStorage)
    const storedUser = localStorage.getItem('currentUser');
    const storedIsAdmin = localStorage.getItem('isAdmin');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    if (storedIsAdmin) {
      setIsAdmin(JSON.parse(storedIsAdmin));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<AuthUser | null> => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = mockUsers.find(u => u.email === email && u.password === pass);
    if (user) {
      const authUser: AuthUser = { id: user.id, email: user.email, name: user.name, phone: user.phone, whatsapp: user.whatsapp };
      setCurrentUser(authUser);
      setIsAdmin(false); // Ensure admin is false on user login
      localStorage.setItem('currentUser', JSON.stringify(authUser));
      localStorage.removeItem('isAdmin');
      setLoading(false);
      return authUser;
    }
    setLoading(false);
    return null;
  };

  const signup = async (userData: Omit<User, 'id' | 'linkedQrCodes'>): Promise<AuthUser | null> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    if (mockUsers.some(u => u.email === userData.email)) {
      setLoading(false);
      throw new Error("User already exists with this email.");
    }
    const newUser: User = {
      id: `user${mockUsers.length + 1}`,
      ...userData,
      linkedQrCodes: [],
    };
    mockUsers.push(newUser); // Add to mock data
    const authUser: AuthUser = { id: newUser.id, email: newUser.email, name: newUser.name, phone: newUser.phone, whatsapp: newUser.whatsapp };
    setCurrentUser(authUser);
    setIsAdmin(false);
    localStorage.setItem('currentUser', JSON.stringify(authUser));
    localStorage.removeItem('isAdmin');
    setLoading(false);
    return authUser;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
  };

  const adminLogin = async (username: string, pass: string): Promise<boolean> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    if (username === ADMIN_CREDENTIALS.username && pass === ADMIN_CREDENTIALS.password) {
      setCurrentUser(null); // No regular user when admin is logged in
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      localStorage.removeItem('currentUser');
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };
  
  const updateCurrentUser = (updatedFields: Partial<AuthUser>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updatedFields };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update mockData.users as well for persistence across "sessions" in this demo
      const userIndex = mockUsers.findIndex(u => u.id === currentUser.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...updatedFields };
      }
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
