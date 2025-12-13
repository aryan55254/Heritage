"use client";

import { useState, useRef, useEffect } from "react";
import { handlelogout } from "@/app/actions/actions";
import { useRouter } from "next/navigation";

export default function UserMenu({
  initialName,
  email,
}: {
  initialName: string;
  email: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onSignOut = async () => {
    await handlelogout();
    router.refresh();
    router.push("/login");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 hover:bg-amber-900/20 p-2 rounded-xl transition-colors cursor-pointer"
      >
        <div className="text-right hidden md:block">
          <p className="text-sm font-medium text-amber-100">{initialName}</p>
          <p className="text-xs text-amber-200/60 truncate max-w-[150px]">
            {email}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-amber-500/20">
          <span className="text-amber-950 font-bold text-lg">
            {initialName.charAt(0).toUpperCase()}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-gradient-to-br from-amber-950 to-orange-950 border border-amber-500/30 rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl">
          <div className="p-4 border-b border-amber-500/20 md:hidden">
            <p className="text-sm font-medium text-amber-100">{initialName}</p>
            <p className="text-xs text-amber-200/60 truncate">{email}</p>
          </div>

          <div className="p-2 space-y-1">
            <button
              onClick={() => router.push("/settings")}
              className="w-full text-left px-4 py-2.5 text-sm text-amber-100 hover:bg-amber-500/20 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </button>
            <button
              onClick={onSignOut}
              className="w-full text-left px-4 py-2.5 text-sm text-red-300 hover:bg-red-500/20 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
