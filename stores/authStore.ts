import { create } from "zustand";
import { createClient } from "@/lib/supabase-client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { Tables } from "@/types/database";

// Session persistence keys
const STAY_SIGNED_IN_KEY = "staySignedIn";
const SESSION_ACTIVE_KEY = "sessionActive";

// Auth state type
export interface AuthState {
  user: SupabaseUser | null;
  profile: Tables<"user_profiles"> | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Auth actions type
export interface AuthActions {
  setUser: (user: SupabaseUser | null) => void;
  setProfile: (profile: Tables<"user_profiles"> | null) => void;
  setLoading: (isLoading: boolean) => void;
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
  fetchProfile: (userId: string) => Promise<Tables<"user_profiles"> | null>;
  initializeAuth: () => Promise<() => void>;
}

export type AuthStore = AuthState & AuthActions;

// Create the auth store
export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,

  // State setters
  setUser: (user) =>
    set({ user, isAuthenticated: !!user }),

  setProfile: (profile) => set({ profile }),

  setLoading: (isLoading) => set({ isLoading }),

  // Fetch user profile from database
  fetchProfile: async (userId: string) => {
    const supabase = createClient();
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

  // Refresh profile data
  refreshProfile: async () => {
    const { user, fetchProfile } = get();
    if (!user) return;

    const profile = await fetchProfile(user.id);
    set({ profile });
  },

  // Initialize auth state and set up listener
  initializeAuth: async () => {
    const supabase = createClient();
    const { fetchProfile } = get();

    try {
      // Get current session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // Check if user should stay signed in
        const staySignedIn = localStorage.getItem(STAY_SIGNED_IN_KEY) === "true";
        const sessionWasActive = sessionStorage.getItem(SESSION_ACTIVE_KEY) === "true";

        // If user didn't opt to stay signed in and this is a new browser session
        // (sessionStorage is empty but we have an auth session), sign them out
        if (!staySignedIn && !sessionWasActive) {
          await supabase.auth.signOut();
          set({
            user: null,
            profile: null,
            isLoading: false,
            isAuthenticated: false,
          });
          return () => {};
        }

        // Mark this browser session as active
        sessionStorage.setItem(SESSION_ACTIVE_KEY, "true");

        const profile = await fetchProfile(session.user.id);
        set({
          user: session.user,
          profile,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        set({
          user: null,
          profile: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      set({
        user: null,
        profile: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        // Mark session as active when signed in
        sessionStorage.setItem(SESSION_ACTIVE_KEY, "true");

        const profile = await fetchProfile(session.user.id);
        set({
          user: session.user,
          profile,
          isLoading: false,
          isAuthenticated: true,
        });
      } else if (event === "SIGNED_OUT") {
        // Clear session markers on sign out
        localStorage.removeItem(STAY_SIGNED_IN_KEY);
        sessionStorage.removeItem(SESSION_ACTIVE_KEY);

        set({
          user: null,
          profile: null,
          isLoading: false,
          isAuthenticated: false,
        });
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        // Keep current profile, just update user
        set({ user: session.user });
      }
    });

    // Return cleanup function
    return () => {
      subscription.unsubscribe();
    };
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const supabase = createClient();
    const { fetchProfile } = get();

    set({ isLoading: true });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set({ isLoading: false });
      return { error: error.message };
    }

    if (data.user) {
      // Mark session as active for this browser tab/window
      sessionStorage.setItem(SESSION_ACTIVE_KEY, "true");

      const profile = await fetchProfile(data.user.id);
      set({
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

  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    const supabase = createClient();

    set({ isLoading: true });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      set({ isLoading: false });
      return { error: error.message };
    }

    // If email confirmation is disabled, user is signed in immediately
    if (data.user && data.session) {
      // New users are assumed to want persistent sessions by default
      localStorage.setItem(STAY_SIGNED_IN_KEY, "true");
      sessionStorage.setItem(SESSION_ACTIVE_KEY, "true");

      set({
        user: data.user,
        profile: null, // New user, no profile yet
        isLoading: false,
        isAuthenticated: true,
      });
    } else {
      // Email confirmation is enabled, user needs to verify email
      set({ isLoading: false });
    }

    return {};
  },

  // Sign out
  signOut: async () => {
    const supabase = createClient();

    set({ isLoading: true });

    // Clear session persistence markers immediately
    localStorage.removeItem(STAY_SIGNED_IN_KEY);
    sessionStorage.removeItem(SESSION_ACTIVE_KEY);

    await supabase.auth.signOut();

    set({
      user: null,
      profile: null,
      isLoading: false,
      isAuthenticated: false,
    });
  },

  // Update user profile
  updateProfile: async (data: Partial<Tables<"user_profiles">>) => {
    const supabase = createClient();
    const { user, fetchProfile } = get();

    if (!user) {
      return { error: "Not authenticated" };
    }

    // Check if profile exists
    const existingProfile = await fetchProfile(user.id);

    if (existingProfile) {
      // Update existing profile
      const { error } = await supabase
        .from("user_profiles")
        .update(data)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error updating profile:", error);
        return { error: error.message };
      }
    } else {
      // Create new profile
      const { error } = await supabase.from("user_profiles").insert({
        user_id: user.id,
        ...data,
      } as Tables<"user_profiles">);

      if (error) {
        console.error("Error creating profile:", error);
        return { error: error.message };
      }
    }

    // Refresh profile data
    const updatedProfile = await fetchProfile(user.id);
    set({ profile: updatedProfile });

    return {};
  },
}));
