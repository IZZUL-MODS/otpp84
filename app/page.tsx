"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import ParticlesBackground from "@/components/ParticlesBackground";
import BlockStatus from "@/components/BlockStatus";
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  Ban, 
  Phone, 
  Activity,
  Zap,
  ShieldAlert,
  Lock
} from "lucide-react";

export default function HomePage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [duration, setDuration] = useState(5);
  const [action, setAction] = useState<"block" | "check" | "unblock">("block");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      setError("Masukkan nomor WhatsApp yang valid");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          action,
          duration,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || "Terjadi kesalahan");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkStatus = async () => {
    if (!phoneNumber) {
      setError("Masukkan nomor WhatsApp terlebih dahulu");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/block?phoneNumber=${phoneNumber}`);
      const data = await res.json();

      if (res.ok) {
        setResult({ ...data, action: "check" });
      } else {
        setError(data.error || "Terjadi kesalahan");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Clock, title: "Durasi Fleksibel", desc: "1-60 menit waktu blokir" },
    { icon: Shield, title: "Blokir Instan", desc: "Langsung aktif dalam detik" },
    { icon: Activity, title: "Monitoring", desc: "Cek status blokir real-time" },
    { icon: Zap, title: "Cepat", desc: "Proses dalam 1 detik" },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden">
      <ParticlesBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-500/10">
              <Ban className="w-6 h-6 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">WhatsApp Blocker</h1>
          </div>
          <ThemeToggle />
        </motion.div>

        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                ⚠️ Penggunaan yang Bertanggung Jawab
              </p>
              <p className="text-xs text-yellow-600/80 dark:text-yellow-400/80 mt-1">
                Website ini dibuat untuk edukasi dan pencegahan spam. 
                Menyalahgunakan sistem untuk mengganggu orang lain melanggar hukum.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 shadow-2xl"
        >
          {/* Phone Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-foreground">
              Nomor WhatsApp Target
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">+62</span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="81234567890"
                className="w-full pl-12 pr-4 py-3 rounded-xl input-pink text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Contoh: 81234567890 atau 6281234567890
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { value: "block", label: "🔴 Blokir", icon: Ban },
              { value: "check", label: "🔍 Cek Status", icon: ShieldAlert },
              { value: "unblock", label: "🟢 Buka Blokir", icon: Lock },
            ].map((btn) => (
              <button
                key={btn.value}
                onClick={() => setAction(btn.value as any)}
                className={`py-2 rounded-xl transition-all text-sm font-medium ${
                  action === btn.value
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
                    : "bg-white/10 hover:bg-white/20 text-foreground"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Duration (hanya untuk block) */}
          {action === "block" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6"
            >
              <label className="block text-sm font-medium mb-2 text-foreground">
                Durasi Blokir (menit)
              </label>
              <div className="flex gap-2 flex-wrap">
                {[1, 5, 10, 15, 30, 60].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      duration === d
                        ? "bg-pink-500 text-white"
                        : "bg-white/10 hover:bg-white/20 text-foreground"
                    }`}
                  >
                    {d} menit
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action === "check" ? checkStatus : handleSubmit}
            disabled={isLoading}
            className={`w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              action === "block" 
                ? "btn-danger" 
                : action === "unblock"
                ? "bg-green-600 hover:bg-green-700"
                : "btn-pink"
            }`}
          >
            {isLoading ? (
              <div className="spinner-premium" />
            ) : action === "block" ? (
              <>
                <Ban className="w-5 h-5" />
                Blokir Nomor
              </>
            ) : action === "unblock" ? (
              <>
                <Lock className="w-5 h-5" />
                Buka Blokir
              </>
            ) : (
              <>
                <ShieldAlert className="w-5 h-5" />
                Cek Status
              </>
            )}
          </motion.button>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              {result.blocked === true ? (
                <BlockStatus
                  isBlocked={true}
                  remainingSeconds={result.remainingSeconds}
                  reason={result.reason}
                  attempts={result.attempts}
                />
              ) : result.blocked === false && result.action !== "check" ? (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                  <div className="flex items-center gap-2 text-green-500">
                    <Lock className="w-5 h-5" />
                    <span className="font-medium">{result.message}</span>
                  </div>
                </div>
              ) : result.blocked === false && result.action === "check" ? (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                  <div className="flex items-center gap-2 text-green-500">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Nomor tidak terblokir</span>
                  </div>
                  <p className="text-sm text-green-400 mt-1">
                    Nomor ini bebas dan dapat menerima OTP
                  </p>
                </div>
              ) : null}
            </motion.div>
          )}
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="glass rounded-xl p-3 text-center"
            >
              <feature.icon className="w-5 h-5 text-pink-500 mx-auto mb-1" />
              <h3 className="font-semibold text-xs text-foreground">{feature.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-muted-foreground mt-6 py-4 border-t border-primary/20"
        >
          <p>⚡ WhatsApp Temporary Block System | 5-Minute Rate Limiting</p>
          <p className="mt-1">Untuk keamanan dan pencegahan spam OTP</p>
        </motion.footer>
      </div>
    </main>
  );
}