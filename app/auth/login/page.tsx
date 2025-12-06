"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks";
import { Input, PasswordInput, Checkbox, Button } from "@/components/ui";
import { validateEmail } from "@/lib/validation";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setErrors({ email: emailValidation.error });
      return;
    }

    // Validate password is not empty
    if (!password) {
      setErrors({ password: "Password is required" });
      return;
    }

    // Store preference for session persistence
    if (staySignedIn) {
      localStorage.setItem("staySignedIn", "true");
    } else {
      localStorage.removeItem("staySignedIn");
    }

    // Attempt sign in
    const result = await signIn(email, password);

    if (result.error) {
      // Handle specific error messages
      if (result.error.toLowerCase().includes("invalid login credentials")) {
        setErrors({ form: "Incorrect email or password" });
      } else {
        setErrors({ form: result.error });
      }
      return;
    }

    // Redirect based on onboarding status
    if (result.needsOnboarding) {
      router.push("/onboarding");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4">
      {/* Logo and Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-block">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <svg
              className="w-10 h-10 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
        <p className="text-gray-500">Track your calories, reach your goals</p>
      </div>

      {/* Login Form Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Form Error */}
          {errors.form && (
            <div className="p-4 rounded-xl bg-danger/10 border border-danger/20">
              <p className="text-sm text-danger text-center">{errors.form}</p>
            </div>
          )}

          {/* Email Field */}
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="email"
            disabled={isLoading}
          />

          {/* Password Field */}
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="current-password"
            disabled={isLoading}
          />

          {/* Stay Signed In & Forgot Password Row */}
          <div className="flex items-center justify-between">
            <Checkbox
              label="Stay signed in"
              checked={staySignedIn}
              onChange={(e) => setStaySignedIn(e.target.checked)}
              disabled={isLoading}
            />
            <Link
              href="/auth/forgot-password"
              className="text-sm text-primary hover:text-primary-dark transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
            className="mt-6"
          >
            Log In
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-4 text-sm text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            Sign up here
          </Link>
        </p>
      </div>

      {/* Footer */}
      <p className="mt-8 text-sm text-gray-400">
        Made with care for your health journey
      </p>
    </div>
  );
}
