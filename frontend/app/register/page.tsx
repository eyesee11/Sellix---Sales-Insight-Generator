"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Registration failed");
      }

      router.push("/login");
    } catch (err: unknown) {
    if (err instanceof Error) {
        setError(err.message);
    } else {
        setError("Something went wrong");
    }
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper text-ink font-sans">
      <div className="max-w-md w-full p-8 bg-paper border-2 border-ink shadow-brutal mx-4">
        <div className="flex items-center justify-center gap-3 mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tight">Register</h2>
        </div>
        
        {error && (
          <div className="mb-6 p-3 border-2 border-red-600 bg-red-50">
            <p className="text-red-600 text-xs font-bold uppercase tracking-swiss text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-swiss text-ink/70">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full border-2 border-ink bg-white px-4 py-3 placeholder:text-ink/30 
                       focus:outline-none focus:ring-0 focus:shadow-brutal transition-all duration-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-swiss text-ink/70">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full border-2 border-ink bg-white px-4 py-3 placeholder:text-ink/30 
                       focus:outline-none focus:ring-0 focus:shadow-brutal transition-all duration-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-ink text-paper font-black uppercase tracking-swiss py-4 border-2 border-transparent
                     hover:bg-white hover:text-ink hover:border-ink hover:shadow-brutal transition-all mt-4"
          >
            Create Account
          </button>
        </form>

        <div className="mt-8 border-t-2 border-ink pt-6 text-center">
          <p className="text-xs font-bold uppercase tracking-swiss text-ink/70">
            Already have an account?{' '}
            <Link href="/login" className="text-accent hover:underline decoration-2 underline-offset-4">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}