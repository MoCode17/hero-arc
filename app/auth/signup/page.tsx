"use client";

import { useState, FormEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks";
import { Input, PasswordInput, Checkbox, Button } from "@/components/ui";
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateTerms,
  checkPasswordRequirements,
} from "@/lib/validation";

export default function SignupPage() {
  const router = useRouter();
  const { signUp, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
    form?: string;
  }>({});

  // Calculate password requirements in real-time
  const passwordRequirements = useMemo(
    () => checkPasswordRequirements(password),
    [password]
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Validate all fields
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const confirmValidation = validatePasswordMatch(password, confirmPassword);
    const termsValidation = validateTerms(acceptTerms);

    const newErrors: typeof errors = {};

    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error;
    }
    if (!confirmValidation.isValid) {
      newErrors.confirmPassword = confirmValidation.error;
    }
    if (!termsValidation.isValid) {
      newErrors.terms = termsValidation.error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Attempt sign up
    const result = await signUp(email, password);

    if (result.error) {
      // Handle specific error messages
      if (result.error.toLowerCase().includes("already registered")) {
        setErrors({ form: "Email already in use. Please try logging in instead." });
      } else {
        setErrors({ form: result.error });
      }
      return;
    }

    // Redirect to onboarding on success
    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 py-8">
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
        <h1 className="text-2xl font-bold text-foreground mb-2">Get Started</h1>
        <p className="text-gray-500">Create your account to begin tracking</p>
      </div>

      {/* Signup Form Card */}
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
            hint="Must be a valid email format"
            autoComplete="email"
            disabled={isLoading}
          />

          {/* Password Field */}
          <div>
            <PasswordInput
              label="Password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="new-password"
              disabled={isLoading}
            />
            {/* Password Requirements Indicator */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1">
                <PasswordRequirement
                  met={passwordRequirements.minLength}
                  text="At least 8 characters"
                />
                <PasswordRequirement
                  met={passwordRequirements.hasUppercase}
                  text="1 uppercase letter"
                />
                <PasswordRequirement
                  met={passwordRequirements.hasNumber}
                  text="1 number"
                />
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            autoComplete="new-password"
            disabled={isLoading}
          />

          {/* Terms Checkbox */}
          <Checkbox
            label={
              <span>
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-primary hover:text-primary-dark transition-colors"
                >
                  Terms
                </Link>{" "}
                &{" "}
                <Link
                  href="/privacy"
                  className="text-primary hover:text-primary-dark transition-colors"
                >
                  Privacy Policy
                </Link>
              </span>
            }
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            error={errors.terms}
            disabled={isLoading}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
            className="mt-6"
          >
            Sign Up
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-4 text-sm text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Login Link */}
        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            Log in here
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

// Password requirement indicator component
function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {met ? (
        <svg
          className="w-4 h-4 text-success"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" strokeWidth={2} />
        </svg>
      )}
      <span className={met ? "text-success" : "text-gray-400"}>{text}</span>
    </div>
  );
}
