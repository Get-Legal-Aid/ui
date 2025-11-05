/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import type { ReactNode } from "react";
import type { User } from "@/services/auth/auth.types";
import {
  signOut as authSignOut,
  refreshToken,
} from "@/services/auth/auth.service";
import { getCurrentUser } from "@/services/auth/auth.service";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (user: User) => void;
  signOut: () => Promise<void>;
  updateUser: (user: User) => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const USER_STORAGE_KEY = "auth_user";

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef<number | null>(null);

  // Check if user is authenticated (based on user data only)
  const isAuthenticated = !!user;

  // Set up proactive token refresh timer
  const setupTokenRefresh = useCallback(() => {
    // Clear any existing timer
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }

    // Refresh token every 12 minutes (before 15-minute expiry)
    refreshTimerRef.current = setInterval(async () => {
      try {
        await refreshToken();
      } catch (error) {
        console.error("Proactive token refresh failed:", error);
        // If refresh fails, clear auth state
        try {
          await authSignOut();
        } catch {
          // Ignore logout errors during refresh failure
        }
        setUser(null);
        localStorage.removeItem(USER_STORAGE_KEY);
        clearTokenRefresh();
      }
    }, 12 * 60 * 1000); // 12 minutes
  }, []);

  // Clear token refresh timer
  const clearTokenRefresh = () => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  };

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to get current user from server (cookies sent automatically)
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        // Optionally cache user data in localStorage for offline scenarios
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
        // Start proactive token refresh
        setupTokenRefresh();
      } catch (error) {
        // Not authenticated or network error
        console.log("User not authenticated or network error:", error);
        setUser(null);
        // Clear any stale user data
        localStorage.removeItem(USER_STORAGE_KEY);
        // Also clear any old token data from previous implementation
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // Clear any refresh timer
        clearTokenRefresh();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Cleanup timer on unmount
    return () => {
      clearTokenRefresh();
    };
  }, [setupTokenRefresh]);

  const signIn = (userData: User) => {
    setUser(userData);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    // Start token refresh timer when user signs in
    setupTokenRefresh();
  };

  const signOut = async () => {
    try {
      // Call logout API to clear server-side cookies
      await authSignOut();
    } catch (error) {
      console.error("Logout API call failed:", error);
      // Continue with local cleanup even if API call fails
    } finally {
      // Clear local user state
      setUser(null);
      localStorage.removeItem(USER_STORAGE_KEY);
      // Clear token refresh timer
      clearTokenRefresh();
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  };

  const refreshUserData = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      // If getCurrentUser fails, user might not be authenticated anymore
      await signOut();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    signIn,
    signOut,
    updateUser,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
