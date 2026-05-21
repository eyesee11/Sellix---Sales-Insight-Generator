"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UploadForm from "../../UploadForm";
import AuthNav from "../../AuthNav";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hasToken = document.cookie.includes("access_token=");
    setIsLogged(typeof document !== 'undefined' && hasToken);
    setIsAuthChecking(false);
  }, []);

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <p className="text-sm font-black uppercase tracking-swiss text-ink animate-pulse">Authenticating...</p>
      </div>
    );
  }

  if (!isLogged) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper text-ink font-sans">
        <div className="max-w-md w-full p-10 bg-white border-2 border-ink shadow-brutal mx-4 text-center space-y-6">
          <div className="text-5xl mb-4">👮</div>
          <h3 className="text-3xl font-black uppercase tracking-tight">Access Denied</h3>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-swiss mb-6">
            You must be logged in to access the dashboard.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link
              href="/login"
              className="bg-accent text-white font-black uppercase tracking-swiss text-sm border-2 border-ink px-8 py-3 shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink font-sans">
      <nav className="sticky top-0 z-50 bg-paper border-b-2 border-ink">
        <div className="max-w-7xl mx-auto px-6 py-0 flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 group">
            <Image src="/logo.png" alt="Sellix logo" width={64} height={64} />
            <span className="font-black text-sm uppercase tracking-swiss">Sellix</span>
            <span className="hidden sm:block text-[10px] font-bold uppercase tracking-wide2 text-gray-400 border border-rule px-1.5 py-0.5 ml-1">
              Pragati
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <AuthNav />
          </div>
        </div>
      </nav>

      <section className="border-b-2 border-ink bg-white min-h-[calc(100vh-3.5rem)]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-accent" />
                <span className="text-[11px] font-black uppercase tracking-wide2 text-accent">
                  Dashboard
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight mb-6">
                Go Ahead. <br />
                <span className="text-accent">Drop the File.</span>
              </h2>
              <p className="text-base text-gray-600 font-medium leading-relaxed mb-8">
                Your sales data goes in. A polished executive summary comes out.
                The AI does the thinking. You take the credit. This is the way.
              </p>
              <ul className="space-y-3">
                {[
                  "Accepts .csv and .xlsx up to 10 MB",
                  "Revenue, units, region & category breakdowns",
                  "Groq LLaMA 3.3 · sub-3s generation",
                  "Delivered as a formatted HTML email",
                  "Rate limited to keep it fair (5 req/min)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-medium text-gray-700">
                    <span className="mt-0.5 w-4 h-4 bg-accent border-2 border-ink flex-shrink-0 flex items-center justify-center shadow-[1px_1px_0_#0a0a0a]">
                      <span className="text-white text-[8px] font-black">✓</span>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <UploadForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
