"use client";
import { useState } from "react";
import { useAuth } from "@/hooks";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-purple-300 to-indigo-600 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4">
          <svg
            className="w-10 h-10 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.87 0-7-3.13-7-7V8.3l7-3.11 7 3.11V13c0 3.87-3.13 7-7 7z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hero Arc</h1>
      </div>
      <div className="bg-white/20 backdrop-blur-md w-full max-w-md rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-8">Create Account</h1>
      </div>
    </div>
  );
}
