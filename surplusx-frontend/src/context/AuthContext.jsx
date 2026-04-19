import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH USER =================
  const fetchUser = async (token) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Invalid or expired token");
      }

      const data = await res.json();

      setUser(data);
      return data; // ✅ useful for chaining

    } catch (err) {
      console.error("Auth Error:", err.message);

      localStorage.removeItem("token");
      setUser(null);

      return null;
    }
  };

  // ================= INITIAL LOAD =================
  useEffect(() => {

    const initAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        await fetchUser(token);
      }

      setLoading(false);
    };

    initAuth();

  }, []);

  // ================= LOGIN =================
  const login = async (token) => {

    setLoading(true);

    localStorage.setItem("token", token);

    const userData = await fetchUser(token);

    setLoading(false);
    console.log(token);

    return userData;
  };

  // ================= LOGOUT =================
  const logout = () => {

    localStorage.removeItem("token");
    setUser(null);

  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ================= CUSTOM HOOK =================
export const useAuth = () => useContext(AuthContext);