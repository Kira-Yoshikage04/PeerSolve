import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { signInWithGoogle, signOut } from '../services/db';
import { ALLOWED_DOMAIN } from '../constants';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate checking for an existing session on mount
  useEffect(() => {
    setLoading(true);
    // For this mock, we'll just start logged out.
    setUser(null);
    setLoading(false);
  }, []);

  const login = async () => {
    setLoading(true);
    try {
      // Use the mock signIn function
      const loggedInUser = await signInWithGoogle();
      if (!loggedInUser.email?.endsWith(ALLOWED_DOMAIN)) {
          alert(`Access denied. Only users with a ${ALLOWED_DOMAIN} email are allowed.`);
          setUser(null);
      } else {
          setUser(loggedInUser);
      }
    } catch (error) {
        console.error("Mock login failed:", error);
    } finally {
        setLoading(false);
    }
  };

  const logout = async () => {
    await signOut();
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    if (user && user.id === updatedUser.id) {
        setUser(updatedUser);
    }
  };

  const value = { user, loading, login, logout, updateUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};