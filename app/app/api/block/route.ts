// app/api/block/route.ts
import { NextRequest, NextResponse } from "next/server";

// Simpan data block di memory (untuk development)
const blockStore = new Map<string, {
  expiresAt: number;
  reason: string;
  attempts: number;
}>();

function blockNumber(number: string, reason: string, durationMinutes: number) {
  const expiresAt = Date.now() + (durationMinutes * 60 * 1000);
  const existing = blockStore.get(number);
  blockStore.set(number, {
    expiresAt,
    reason,
    attempts: (existing?.attempts || 0) + 1,
  });
  
  // Auto hapus setelah expired
  setTimeout(() => {
    if (blockStore.has(number)) {
      const data = blockStore.get(number);
      if (data && data.expiresAt <= Date.now()) {
        blockStore.delete(number);
      }
    }
  }, durationMinutes * 60 * 1000);
}

function isBlocked(number: string) {
  const data = blockStore.get(number);
  if (!data) return { blocked: false, remainingSeconds: 0 };
  
  const now = Date.now();
  if (now > data.expiresAt) {
    blockStore.delete(number);
    return { blocked: false, remainingSeconds: 0 };
  }
  
  const remainingSeconds = Math.ceil((data.expiresAt - now) / 1000);
  return {
    blocked: true,
    remainingSeconds,
    reason: data.reason,
    attempts: data.attempts,
  };
}

function unblockNumber(number: string) {
  return blockStore.delete(number);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received request:", body); // Debug log
    
    const { phoneNumber, action, duration = 5 } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Nomor WhatsApp tidak boleh kosong" },
        { status: 400 }
      );
    }

    // Format nomor (bersihkan dari karakter aneh)
    let formattedNumber = phoneNumber.toString().replace(/\D/g, "");
    
    // Tambahkan kode negara 62 jika belum
    if (formattedNumber.startsWith("0")) {
      formattedNumber = "62" + formattedNumber.substring(1);
    } else if (!formattedNumber.startsWith("62") && !formattedNumber.startsWith("+62")) {
      formattedNumber = "62" + formattedNumber;
    }
    
    // Tambahkan + untuk standar internasional
    const fullNumber = "+" + formattedNumber;

    console.log("Action:", action, "Number:", fullNumber); // Debug log

    // Proses berdasarkan action
    if (action === "block") {
      blockNumber(fullNumber, `Diblokir selama ${duration} menit`, duration);
      
      return NextResponse.json({
        success: true,
        blocked: true,
        message: `✅ Nomor ${fullNumber} berhasil diblokir selama ${duration} menit`,
        remainingSeconds: duration * 60,
      });
    }

    if (action === "unblock") {
      const success = unblockNumber(fullNumber);
      return NextResponse.json({
        success: true,
        blocked: false,
        message: success ? `✅ Nomor ${fullNumber} berhasil dibuka blokirnya` : "ℹ️ Nomor tidak sedang diblokir",
      });
    }

    if (action === "check") {
      const status = isBlocked(fullNumber);
      return NextResponse.json({
        number: fullNumber,
        blocked: status.blocked,
        remainingSeconds: status.remainingSeconds,
        reason: status.reason,
        attempts: status.attempts,
      });
    }

    return NextResponse.json(
      { error: "Action tidak valid. Gunakan: block, unblock, atau check" },
      { status: 400 }
    );
    
  } catch (error: any) {
    console.error("API Error detail:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}
