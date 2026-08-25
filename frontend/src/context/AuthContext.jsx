import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthContext } from "./authContext.js";
import {
  AUTH_TOKEN_KEY,
  loginEmployee,
  logoutEmployee,
} from "../services/employeeService.js";

const AUTH_USER_KEY = "picstart_auth_user";

function readStoredUser() {
  try {
    const storedUser = localStorage.getItem(AUTH_USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [user, setUser] = useState(readStoredUser);

  const clearSession = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    function handleUnauthorized() {
      clearSession();
    }

    window.addEventListener("picstart:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("picstart:unauthorized", handleUnauthorized);
  }, [clearSession]);

  const login = useCallback(async (email, password) => {
    const response = await loginEmployee(email, password);
    localStorage.setItem(AUTH_TOKEN_KEY, response.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));
    setToken(response.token);
    setUser(response.user);
    return response;
  }, []);

  const logout = useCallback(async () => {
    try {
      if (localStorage.getItem(AUTH_TOKEN_KEY)) {
        await logoutEmployee();
      }
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      isLoading: false,
      user,
      login,
      logout,
    }),
    [login, logout, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
