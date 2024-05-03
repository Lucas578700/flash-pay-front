import { createContext, useContext } from "react";

export const AuthContext = createContext({});

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("UseAuth must be used within a AuthProvider");
  }

  return context;
}
