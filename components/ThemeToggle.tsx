"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-pink-300/30 hover:border-pink-400 transition-all duration-300 group"
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-pink-500 relative z-10" />
      ) : (
        <Sun className="w-5 h-5 text-pink-400 relative z-10" />
      )}
    </motion.button>
  );
}