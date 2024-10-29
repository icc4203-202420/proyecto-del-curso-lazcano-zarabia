import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';

interface JwtPayload {
  sub: string;
}

interface UserContextType {
  userId: string | null;
}

const UserContext = createContext<UserContextType>({ userId: null });

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        try {
          const decodedToken = jwtDecode<JwtPayload>(token);
          setUserId(decodedToken.sub);
        } catch (error) {
          console.error('Error al decodificar el token:', error);
          setUserId(null);
        }
      }
    };

    fetchUserId();
  }, []);

  return (
    <UserContext.Provider value={{ userId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
