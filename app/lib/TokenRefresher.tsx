
"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { generateRefreshToken } from "../api/auth/action";


export function TokenRefresher() {
  const pathname = usePathname();

  useEffect(() => {
    
    if (pathname.startsWith('/auth/signIn') || pathname.startsWith('/auth/signUp')) {
      return;
    }

    const heartbeat = async () => {
      await generateRefreshToken();
    };

    // Run every 10 mins
    const interval = setInterval(heartbeat, 1000 * 60 * 10);
    heartbeat();

    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}