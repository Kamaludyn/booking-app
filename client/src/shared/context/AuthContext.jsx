import { createContext, useContext, useState } from "react";
import api from "../services/api";

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the Auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  // The token and user data are initialized from localStorage to persist the user's session across page reloads
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // Login function
  const login = (token, userData) => {
    // Update the token and user state
    setToken(token);
    setUser(userData);

    // Store token and user in localStorage for persistence
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    // Clear the user and token state
    setUser(null);
    setToken(null);

    // Remove the user and token from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Remove Authorization header
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
