/**
 * User Context Provider Component
 * Provides user data context for navigation between user list and user details pages
 */

'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { UserContextUser } from '@/types/user';

interface UserContextValue {
  selectedUser: UserContextUser | null;
  setSelectedUser: (user: UserContextUser | null) => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
}

interface UserContextProviderProps {
  children: ReactNode;
}

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [selectedUser, setSelectedUser] = useState<UserContextUser | null>(null);

  return (
    <UserContext.Provider value={{ selectedUser, setSelectedUser }}>
      {children}
    </UserContext.Provider>
  );
}

