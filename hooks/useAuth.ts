"use client";

import { useState, useEffect, useCallback } from "react";
import type { User, UserProfile, AuthState } from "@/types";

// Placeholder hook - will be implemented with Supabase
export function useAuth(): AuthState & {
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error?: string }>;
} {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      // TODO: Implement with Supabase
      setState((prev) => ({ ...prev, isLoading: false }));
    };

    checkSession();
  }, []);

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      setState((prev) => ({ ...prev, isLoading: true }));
      // TODO: Implement with Supabase
      console.log("Sign in:", email, password);
      setState((prev) => ({ ...prev, isLoading: false }));
      return {};
    },
    []
  );

  const signUp = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      setState((prev) => ({ ...prev, isLoading: true }));
      // TODO: Implement with Supabase
      console.log("Sign up:", email, password);
      setState((prev) => ({ ...prev, isLoading: false }));
      return {};
    },
    []
  );

  const signOut = useCallback(async (): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));
    // TODO: Implement with Supabase
    setState({
      user: null,
      profile: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  const updateProfile = useCallback(
    async (data: Partial<UserProfile>): Promise<{ error?: string }> => {
      // TODO: Implement with Supabase
      console.log("Update profile:", data);
      return {};
    },
    []
  );

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };
}
