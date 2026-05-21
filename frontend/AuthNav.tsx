"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthNav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if access_token cookie exists
    const hasToken = document.cookie.includes("access_token=");
    setIsLoggedIn(hasToken);
  }, []);

  const handleLogout = () => {
    document.cookie = "access_token=; path=/; max-age=0;";
    setIsLoggedIn(false);
    router.refresh();
  };

  if (isLoggedIn) {
    return (
      <button 
        onClick={handleLogout} 
        className="text-xs font-bold uppercase tracking-swiss text-red-600 hover:text-red-800 transition-colors"
      >
        Logout
      </button>
    );
  }

  return (
    <Link 
      href="/login" 
      className="text-xs font-bold uppercase tracking-swiss text-ink hover:text-accent transition-colors"
    >
      Login
    </Link>
  );
}