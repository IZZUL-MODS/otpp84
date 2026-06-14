// components/ThemeToggle.tsx
"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-white/10 border border-pink-300/30 hover:border-pink-400 transition-all"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-pink-500" />
      ) : (
        <Sun className="w-5 h-5 text-pink-400" />
      )}
    </button>
  );
}
