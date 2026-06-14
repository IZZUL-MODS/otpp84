// components/BlockStatus.tsx
"use client";

import { Clock, Shield, AlertCircle } from "lucide-react";

interface BlockStatusProps {
  isBlocked: boolean;
  remainingSeconds?: number;
  reason?: string;
  attempts?: number;
}

export default function BlockStatus({ 
  isBlocked, 
  remainingSeconds = 0, 
  reason, 
  attempts 
}: BlockStatusProps) {
  if (!isBlocked) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-500 text-sm">Nomor Terblokir Sementara</h3>
          <p className="text-xs text-red-400 mt-1">{reason || "Terlalu banyak percobaan OTP"}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-red-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Sisa: {formatTime(remainingSeconds)}</span>
            </div>
            {attempts && (
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>Percobaan: {attempts}x</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
