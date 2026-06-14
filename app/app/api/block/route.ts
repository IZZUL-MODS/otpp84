// app/api/block/route.ts
import { NextRequest, NextResponse } from "next/server";
import { blockNumber, isBlocked, unblockNumber } from "@/lib/block-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, action, duration = 5 } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Nomor WhatsApp tidak boleh kosong" },
        { status: 400 }
      );
    }

    // Format nomor
    let formattedNumber = phoneNumber.replace(/\D/g, "");
    if (!formattedNumber.startsWith("62")) {
      if (formattedNumber.startsWith("0")) {
        formattedNumber = "62" + formattedNumber.substring(1);
      } else {
        formattedNumber = "62" + formattedNumber;
      }
    }
    if (!formattedNumber.startsWith("+")) {
      formattedNumber = "+" + formattedNumber;
    }

    // Proses berdasarkan action
    if (action === "block") {
      const durationMs = duration * 60 * 1000;
      blockNumber(formattedNumber, `Diblokir selama ${duration} menit`, durationMs);
      
      return NextResponse.json({
        success: true,
        blocked: true,
        message: `Nomor ${formattedNumber} berhasil diblokir selama ${duration} menit`,
        remainingSeconds: duration * 60,
      });
    }

    if (action === "unblock") {
      const success = unblockNumber(formattedNumber);
      return NextResponse.json({
        success: true,
        blocked: false,
        message: success ? `Nomor ${formattedNumber} berhasil dibuka blokirnya` : "Nomor tidak sedang diblokir",
      });
    }

    if (action === "check") {
      const status = isBlocked(formattedNumber);
      return NextResponse.json({
        number: formattedNumber,
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
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
