import { NextRequest, NextResponse } from "next/server";
import { blockNumber, isBlocked, addAttempt, unblockNumber } from "@/lib/block-store";

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, action, duration = 5 } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
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

    switch (action) {
      case "block":
        // Block nomor
        const blockDuration = duration * 60 * 1000; // konversi menit ke ms
        blockNumber(formattedNumber, `Blocked for ${duration} minutes`, blockDuration);
        
        return NextResponse.json({
          success: true,
          message: `Number ${formattedNumber} has been blocked for ${duration} minutes`,
          blocked: true,
        });

      case "unblock":
        // Unblock nomor
        const unblocked = unblockNumber(formattedNumber);
        return NextResponse.json({
          success: unblocked,
          message: unblocked ? `Number ${formattedNumber} has been unblocked` : "Number was not blocked",
          blocked: false,
        });

      case "check":
        // Cek status block
        const status = isBlocked(formattedNumber);
        return NextResponse.json({
          number: formattedNumber,
          blocked: status.blocked,
          remainingSeconds: status.remainingSeconds,
          reason: status.reason,
          attempts: status.attempts,
        });

      case "add-attempt":
        // Tambah percobaan (simulasi request OTP)
        const attemptCount = addAttempt(formattedNumber);
        const newStatus = isBlocked(formattedNumber);
        
        return NextResponse.json({
          success: true,
          attempts: attemptCount,
          blocked: newStatus.blocked,
          remainingSeconds: newStatus.remainingSeconds,
        });

      default:
        return NextResponse.json(
          { error: "Invalid action. Use 'block', 'unblock', 'check', or 'add-attempt'" },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Block API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const phoneNumber = searchParams.get("phoneNumber");

  if (!phoneNumber) {
    return NextResponse.json(
      { error: "Phone number is required" },
      { status: 400 }
    );
  }

  let formattedNumber = phoneNumber.replace(/\D/g, "");
  if (!formattedNumber.startsWith("62")) {
    if (formattedNumber.startsWith("0")) {
      formattedNumber = "62" + formattedNumber.substring(1);
    } else {
      formattedNumber = "62" + formattedNumber;
    }
  }

  const status = isBlocked(formattedNumber);
  
  return NextResponse.json({
    number: formattedNumber,
    blocked: status.blocked,
    remainingSeconds: status.remainingSeconds,
    reason: status.reason,
    attempts: status.attempts,
  });
}
