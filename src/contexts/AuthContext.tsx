import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export type UserRole = "admin" | "teacher";

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => { success: boolean; error?: string };
  register: (username: string, password: string, fullName: string) => { success: boolean; error?: string };
  logout: () => void;
  deleteUser: (id: string) => void;
  updateUserRole: (id: string, role: UserRole) => void;
  hasUsers: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple hash for localStorage demo — in production the Express server uses bcrypt
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(36) + '_' + str.length;
}

interface StoredUser extends User {
  passwordHash: string;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [storedUsers, setStoredUsers] = useState<StoredUser[]>(() => {
    const saved = localStorage.getItem("school_users");
    return saved ? JSON.parse(saved) : [];
  });

  // Restore session
  useEffect(() => {
    const session = localStorage.getItem("school_session");
    if (session) {
      const parsed = JSON.parse(session);
      const found = storedUsers.find(u => u.id === parsed.id);
      if (found) {
        const { passwordHash, ...userData } = found;
        setUser(userData);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("school_users", JSON.stringify(storedUsers));
  }, [storedUsers]);

  const login = useCallback((username: string, password: string) => {
    const found = storedUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!found) return { success: false, error: "User not found" };
    if (found.passwordHash !== simpleHash(password)) return { success: false, error: "Invalid password" };
    const { passwordHash, ...userData } = found;
    setUser(userData);
    localStorage.setItem("school_session", JSON.stringify({ id: userData.id }));
    return { success: true };
  }, [storedUsers]);

  const register = useCallback((username: string, password: string, fullName: string) => {
    if (storedUsers.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, error: "Username already exists" };
    }
    if (password.length < 4) {
      return { success: false, error: "Password must be at least 4 characters" };
    }
    // First user becomes admin, rest need approval (are teachers by default)
    const role: UserRole = storedUsers.length === 0 ? "admin" : "teacher";
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      username: username.trim(),
      fullName: fullName.trim(),
      role,
      passwordHash: simpleHash(password),
      createdAt: new Date().toISOString(),
    };
    setStoredUsers(prev => [...prev, newUser]);
    const { passwordHash, ...userData } = newUser;
    setUser(userData);
    localStorage.setItem("school_session", JSON.stringify({ id: userData.id }));
    return { success: true };
  }, [storedUsers]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("school_session");
  }, []);

  const deleteUser = useCallback((id: string) => {
    setStoredUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  const updateUserRole = useCallback((id: string, role: UserRole) => {
    setStoredUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
  }, []);

  const users = storedUsers.map(({ passwordHash, ...u }) => u);

  return (
    <AuthContext.Provider value={{
      user,
      users,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
      login,
      register,
      logout,
      deleteUser,
      updateUserRole,
      hasUsers: storedUsers.length > 0,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
