import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { patchStoredTokens, clearStoredTokens, getStoredTokens } from "../api/client";

interface User {
  id?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  email: string;
  school?: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isVerified: boolean;
  /** Call after a successful login/verifyEmail API response to store user + tokens. */
  login: (
    user: { id?: string; name?: string; firstName?: string; lastName?: string; email: string; school?: string; isVerified?: boolean },
    token: string,
    refreshToken: string
  ) => void;
  /** Sync profile updates into the stored user. */
  updateUser: (patch: Partial<User>) => void;
  verify: () => void;
  updateEmail: (email: string) => void;
  logout: () => void;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  isLoggedIn: false,
  isVerified: false,
  login: () => {},
  updateUser: () => {},
  verify: () => {},
  updateEmail: () => {},
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
        // Persist user profile + tokens in one object so client.ts can read them
        persistUser({ ...userData, token, refreshToken });
        // Expose just the tokens via the shared helper so client.ts patch works too
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
      userData: { id?: string; name?: string; firstName?: string; lastName?: string; email: string; school?: string; isVerified?: boolean },
      token: string,
      refreshToken: string
    ) => {
      const displayName =
        userData.name ??
        (`${userData.firstName ?? ""} ${userData.lastName ?? ""}`.trim() || "User");
      const user: User = {
        id: userData.id,
        name: displayName,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        school: userData.school ?? "",
        isVerified: userData.isVerified ?? true,
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

  const verify = useCallback(() => {
    if (user) {
      const verifiedUser = { ...user, isVerified: true };
      const { token, refreshToken } = getStoredTokens();

      persistUser({ ...verifiedUser, token: token || undefined, refreshToken: refreshToken || undefined });
      setUser(verifiedUser);
    }
  }, [user]);

  const updateEmail = useCallback(
    (email: string) => {
      if (user) {
        const updatedUser = { ...user, email, isVerified: false };
        const { token, refreshToken } = getStoredTokens();

        persistUser({ ...updatedUser, token: token || undefined, refreshToken: refreshToken || undefined });
        setUser(updatedUser);
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
        verify,
        updateEmail,
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
