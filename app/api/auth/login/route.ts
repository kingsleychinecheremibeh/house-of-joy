// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

// ── Simple in-memory rate limiter ─────────────────────────────────────────
const attempts = new Map<string, { count: number; lockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000; // 15 minutes

function getIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"
  );
}

function checkRateLimit(ip: string): { allowed: boolean; waitMs?: number } {
  const now = Date.now();
  const record = attempts.get(ip);

  if (!record) return { allowed: true };

  if (record.lockedUntil > now) {
    return { allowed: false, waitMs: record.lockedUntil - now };
  }

  if (record.count >= MAX_ATTEMPTS) {
    // Lock duration has passed — reset
    attempts.delete(ip);
    return { allowed: true };
  }

  return { allowed: true };
}

function recordFailure(ip: string) {
  const now = Date.now();
  const record = attempts.get(ip) ?? { count: 0, lockedUntil: 0 };
  record.count += 1;
  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCK_MS;
  }
  attempts.set(ip, record);
}

function clearRecord(ip: string) {
  attempts.delete(ip);
}

// ── Handler ───────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  const { allowed, waitMs } = checkRateLimit(ip);

  if (!allowed) {
    const minutes = Math.ceil((waitMs ?? 0) / 60000);
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${minutes} minute${minutes > 1 ? "s" : ""}.` },
      { status: 429 }
    );
  }

  const { password } = await req.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    recordFailure(ip);
    return NextResponse.json(
      { error: "Wrong password. Please try again." },
      { status: 401 }
    );
  }

  clearRecord(ip);
  const session = await getSession();
  session.isLoggedIn = true;
  await session.save();

  return NextResponse.json({ success: true });
}
