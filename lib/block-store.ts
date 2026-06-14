// Database temporary untuk block list (5 menit)
interface BlockedNumber {
  number: string;
  blockedAt: number;
  expiresAt: number;
  reason: string;
  attempts: number;
}

const blockStore = new Map<string, BlockedNumber>();

// Default block duration: 5 menit (300000 ms)
const BLOCK_DURATION = 5 * 60 * 1000;

export function blockNumber(
  number: string,
  reason: string = "Too many OTP requests",
  duration: number = BLOCK_DURATION
): void {
  const now = Date.now();
  blockStore.set(number, {
    number,
    blockedAt: now,
    expiresAt: now + duration,
    reason,
    attempts: (blockStore.get(number)?.attempts || 0) + 1,
  });

  // Auto cleanup setelah expired
  setTimeout(() => {
    if (blockStore.has(number)) {
      const data = blockStore.get(number);
      if (data && data.expiresAt <= Date.now()) {
        blockStore.delete(number);
      }
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
  
  const remainingMs = data.expiresAt - now;
  const remainingSeconds = Math.ceil(remainingMs / 1000);
  
  return {
    blocked: true,
    remainingSeconds,
    reason: data.reason,
    attempts: data.attempts,
  };
}

export function unblockNumber(number: string): boolean {
  if (blockStore.has(number)) {
    blockStore.delete(number);
    return true;
  }
  return false;
}

export function getBlockedList(): BlockedNumber[] {
  const now = Date.now();
  const blocked: BlockedNumber[] = [];
  
  for (const [_, value] of blockStore.entries()) {
    if (now < value.expiresAt) {
      blocked.push(value);
    } else {
      blockStore.delete(value.number);
    }
  }
  
  return blocked;
}

export function addAttempt(number: string): number {
  const data = blockStore.get(number);
  if (data) {
    data.attempts += 1;
    blockStore.set(number, data);
    return data.attempts;
  }
  return 0;
}

// Cleanup setiap menit
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of blockStore.entries()) {
    if (now > value.expiresAt) {
      blockStore.delete(key);
    }
  }
}, 60 * 1000);
