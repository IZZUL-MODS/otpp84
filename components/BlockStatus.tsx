"use client";

import { motion } from "framer-motion";
import { AlertCircle, Clock, Shield, XCircle } from "lucide-react";

interface BlockStatusProps {
  isBlocked: boolean;
  remainingSeconds?: number;
  reason?: string;
  attempts?: number;
}

export default function BlockStatus({ isBlocked, remainingSeconds, reason, attempts }: BlockStatusProps) {
  if (!isBlocked) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-6 p-5 rounded-xl bg-red-500/10 border border-red-500/30"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-red-500/20 animate-pulse-red">
          <XCircle className="w-6 h-6 text-red-500" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-red-500">Nomor Terblokir Sementara</h3>
          <p className="text-sm text-red-400 mt-1">
            {reason || "Terlalu banyak percobaan OTP yang tidak sah"}
          </p>
          <div className="flex items-center gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1 text-red-400">
              <Clock className="w-3 h-3" />
              <span>Sisa waktu: {formatTime(remainingSeconds || 0)}</span>
            </div>
            {attempts && (
              <div className="flex items-center gap-1 text-red-400">
                <Shield className="w-3 h-3" />
                <span>Percobaan: {attempts}x</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}