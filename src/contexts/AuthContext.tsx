import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  loading: boolean;
  login: (username: string, pass: string) => Promise<{ success: boolean; status?: number }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  const login = async (username: string, pass: string) => {
    setLoading(true);
    try {
      const response = await fetch("https://qenaracingteam.runasp.net/Racing/Authentication/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: pass }),
      });

      if (!response.ok) {
        return { success: false, status: response.status };
      }

      const data = await response.json();
      const recievedToken = data.data;

      if (recievedToken) {
        setToken(recievedToken);
        localStorage.setItem("token", recievedToken);
        return { success: true };
      } else {
        return { success: false, status: 400 };
      }
    } catch (error) {
      return { success: false, status: 500 };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};