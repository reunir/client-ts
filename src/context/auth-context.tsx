import { useLocalStorage } from '../hooks/useLocalStorage';
import { AuthProp, userType } from '../types';
import { useCallback, createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type authContextType = {
  user: userType;
  token: string | null;
  logout: () => void;
  getUserData: () => Promise<void>;
  setUser: (value: string | null) => void;
};
const authContextDefaultValues: authContextType = {
  user: null,
  token: null,
  logout: () => {},
  getUserData: () => {
    return new Promise<void>(() => {});
  },
  setUser: (value: string | null) => {},
};
export const AuthContext = createContext<authContextType>(
  authContextDefaultValues
);
AuthContext.displayName = 'AuthContext';

function AuthProvider(props: AuthProp) {
  const { storedUser, setUser, token, getUserData } = useLocalStorage(
    'reunir-user',
    null
  );
  const navigate = useNavigate();
  const logout = useCallback(() => {
    setUser(null);
  }, [setUser]);
  return (
    <AuthContext.Provider
      value={{ logout, user: storedUser, setUser, token, getUserData }}
      {...props}
    ></AuthContext.Provider>
  );
}
function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
}
export { AuthProvider, useAuth };
