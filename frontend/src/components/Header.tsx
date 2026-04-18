"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStoredUser, logout, UserInfo } from "@/lib/api";

export default function Header() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUser(getStoredUser());
  }, []);

  // SSR 중에는 로딩 상태 유지
  if (!mounted) {
    return (
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-xl text-gray-800 dark:text-white">
              Switch-On
            </span>
          </Link>
          <div className="w-20 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-xl text-gray-800 dark:text-white">
            Switch-On
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/challenges"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors"
          >
            챌린지
          </Link>
          <Link
            href="#"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors"
          >
            커뮤니티
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.nickname.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user.nickname}
                </span>
              </div>
              <button
                onClick={logout}
                className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
