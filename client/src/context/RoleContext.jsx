import { createContext, useContext, useState } from "react";

const RoleContext = createContext();

export function RoleProvider({ children }) {
  const [role, setRole] = useState(localStorage.getItem("role") || "customer");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null"),
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    setRole(userData.role);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenData);
    localStorage.setItem("role", userData.role);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole("customer");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <RoleContext.Provider value={{ role, setRole, user, token, login, logout }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
