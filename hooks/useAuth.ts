"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores";
import type { Tables } from "@/types/database";
import type { User as SupabaseUser } from "@supabase/supabase-js";

// Auth state type (re-exported for backwards compatibility)
export interface AuthState {
  user: SupabaseUser | null;
  profile: Tables<"user_profiles"> | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Auth hook return type
export interface UseAuthReturn extends AuthState {
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error?: string; needsOnboarding?: boolean }>;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (
    data: Partial<Tables<"user_profiles">>
  ) => Promise<{ error?: string }>;
  refreshProfile: () => Promise<void>;
}

/**
 * Hook for authentication state and actions.
 * Uses Zustand store under the hood for global state management.
 */
export function useAuth(): UseAuthReturn {
  const {
    user,
    profile,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshProfile,
    initializeAuth,
  } = useAuthStore();

  // Initialize auth on mount
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const init = async () => {
      cleanup = await initializeAuth();
    };

    init();

    return () => {
      cleanup?.();
    };
  }, [initializeAuth]);

  return {
    user,
    profile,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshProfile,
  };
}
