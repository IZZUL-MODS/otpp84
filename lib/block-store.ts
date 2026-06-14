// lib/block-store.ts
interface BlockedNumber {
  number: string;
  blockedAt: number;
  expiresAt: number;
  reason: string;
  attempts: number;
}

const blockStore = new Map<string, BlockedNumber>();
const BLOCK_DURATION = 5 * 60 * 1000; // 5 menit

export function blockNumber(
  number: string, 
  reason: string = "Too many OTP requests", 
  duration: number = BLOCK_DURATION
): void {
  const existing = blockStore.get(number);
  blockStore.set(number, {
    number,
    blockedAt: Date.now(),
    expiresAt: Date.now() + duration,
    reason,
    attempts: (existing?.attempts || 0) + 1,
  });

  // Auto cleanup setelah expired
  setTimeout(() => {
    const data = blockStore.get(number);
    if (data && data.expiresAt <= Date.now()) {
      blockStore.delete(number);
    }
  }, duration);
}

export function isBlocked(number: string): {
  blocked: boolean;
  remainingSeconds: number;
  reason?: string;
  attempts?: number;
} {
  const data = blockStore.get(number);
  
  if (!data) {
    return { blocked: false, remainingSeconds: 0 };
  }
  
  const now = Date.now();
  if (now > data.expiresAt) {
    blockStore.delete(number);
    return { blocked: false, remainingSeconds: 0 };
  }
  
  return {
    blocked: true,
    remainingSeconds: Math.ceil((data.expiresAt - now) / 1000),
    reason: data.reason,
    attempts: data.attempts,
  };
}

export function unblockNumber(number: string): boolean {
  return blockStore.delete(number);
}
