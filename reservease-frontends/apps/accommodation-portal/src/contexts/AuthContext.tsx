import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { clearStoredTokens, getStoredTokens, patchStoredTokens } from "../api/client";

interface User {
  id?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  email: string;
  isVerified: boolean;
  profilePicture?: string;
  city?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isVerified: boolean;
  login: (
    user: { id?: string; name?: string; firstName?: string; lastName?: string; email: string; isVerified?: boolean; profilePicture?: string; city?: string; bio?: string },
    token: string,
    refreshToken: string
  ) => void;
  updateUser: (patch: Partial<User>) => void;
  logout: () => void;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  isLoggedIn: false,
  isVerified: false,
  login: () => {},
  updateUser: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

const STORAGE_KEY = "reservease_user";

function loadStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function persistUser(userData: (User & { token?: string; refreshToken?: string }) | null) {
  if (userData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  } else {
    clearStoredTokens();
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadStoredUser);

  const setAndPersist = useCallback(
    (userData: User | null, token?: string, refreshToken?: string) => {
      if (userData) {
        persistUser({ ...userData, token, refreshToken });
        if (token && refreshToken) patchStoredTokens(token, refreshToken);
      } else {
        persistUser(null);
      }
      setUser(userData);
    },
    []
  );

  const login = useCallback(
    (
      userData: { id?: string; name?: string; firstName?: string; lastName?: string; email: string; isVerified?: boolean; profilePicture?: string; city?: string; bio?: string },
      token: string,
      refreshToken: string
    ) => {
      const displayName =
        userData.name ??
        (`${userData.firstName ?? ""} ${userData.lastName ?? ""}`.trim() || userData.email.split("@")[0]);

      const user: User = {
        id: userData.id,
        name: displayName,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        isVerified: userData.isVerified ?? true,
        profilePicture: userData.profilePicture,
        city: userData.city,
        bio: userData.bio,
      };
      setAndPersist(user, token, refreshToken);
    },
    [setAndPersist]
  );

  const updateUser = useCallback(
    (patch: Partial<User>) => {
      if (user) {
        const updated = { ...user, ...patch };
        const { token, refreshToken } = getStoredTokens();
        persistUser({ ...updated, token: token || undefined, refreshToken: refreshToken || undefined });
        setUser(updated);
      }
    },
    [user]
  );

  const logout = useCallback(() => {
    setAndPersist(null);
  }, [setAndPersist]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isVerified: user?.isVerified ?? false,
        login,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
