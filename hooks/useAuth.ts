"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase-client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { Tables } from "@/types/database";

// Auth state type
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

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const supabase = createClient();

  // Fetch user profile from database
  const fetchProfile = useCallback(
    async (userId: string): Promise<Tables<"user_profiles"> | null> => {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        // Profile doesn't exist yet (user hasn't completed onboarding)
        if (error.code === "PGRST116") {
          return null;
        }
        console.error("Error fetching profile:", error);
        return null;
      }

      return data;
    },
    [supabase]
  );

  // Refresh profile data
  const refreshProfile = useCallback(async () => {
    if (!state.user) return;

    const profile = await fetchProfile(state.user.id);
    setState((prev) => ({ ...prev, profile }));
  }, [state.user, fetchProfile]);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setState({
            user: session.user,
            profile,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setState({
            user: null,
            profile: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setState({
          user: null,
          profile: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const profile = await fetchProfile(session.user.id);
        setState({
          user: session.user,
          profile,
          isLoading: false,
          isAuthenticated: true,
        });
      } else if (event === "SIGNED_OUT") {
        setState({
          user: null,
          profile: null,
          isLoading: false,
          isAuthenticated: false,
        });
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        // Keep current profile, just update user
        setState((prev) => ({
          ...prev,
          user: session.user,
        }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  // Sign in with email and password
  const signIn = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ error?: string; needsOnboarding?: boolean }> => {
      setState((prev) => ({ ...prev, isLoading: true }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return { error: error.message };
      }

      if (data.user) {
        const profile = await fetchProfile(data.user.id);
        setState({
          user: data.user,
          profile,
          isLoading: false,
          isAuthenticated: true,
        });

        // Check if user needs to complete onboarding
        if (!profile || !profile.onboarding_completed) {
          return { needsOnboarding: true };
        }
      }

      return {};
    },
    [supabase, fetchProfile]
  );

  // Sign up with email and password
  const signUp = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      setState((prev) => ({ ...prev, isLoading: true }));

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return { error: error.message };
      }

      // If email confirmation is disabled, user is signed in immediately
      if (data.user && data.session) {
        setState({
          user: data.user,
          profile: null, // New user, no profile yet
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        // Email confirmation is enabled, user needs to verify email
        setState((prev) => ({ ...prev, isLoading: false }));
      }

      return {};
    },
    [supabase]
  );

  // Sign out
  const signOut = useCallback(async (): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));

    await supabase.auth.signOut();

    setState({
      user: null,
      profile: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, [supabase]);

  // Update user profile
  const updateProfile = useCallback(
    async (
      data: Partial<Tables<"user_profiles">>
    ): Promise<{ error?: string }> => {
      if (!state.user) {
        return { error: "Not authenticated" };
      }

      // Check if profile exists
      const existingProfile = await fetchProfile(state.user.id);

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from("user_profiles")
          .update(data)
          .eq("user_id", state.user.id);

        if (error) {
          console.error("Error updating profile:", error);
          return { error: error.message };
        }
      } else {
        // Create new profile
        const { error } = await supabase.from("user_profiles").insert({
          user_id: state.user.id,
          ...data,
        } as Tables<"user_profiles">);

        if (error) {
          console.error("Error creating profile:", error);
          return { error: error.message };
        }
      }

      // Refresh profile data
      const updatedProfile = await fetchProfile(state.user.id);
      setState((prev) => ({ ...prev, profile: updatedProfile }));

      return {};
    },
    [supabase, state.user, fetchProfile]
  );

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshProfile,
  };
}
