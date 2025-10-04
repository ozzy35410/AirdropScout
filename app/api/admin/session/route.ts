import { NextRequest, NextResponse } from "next/server";
import { sha256Hex } from "@/lib/auth/hash";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE } from "@/lib/auth/constants";

const isProduction = process.env.NODE_ENV === "production";

type SessionResponse = { ok: true } | { ok: false; error: string };

type LoginPayload = {
  password?: string;
};

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginPayload;
    const password = body.password?.trim();

    if (!password) {
      return NextResponse.json<SessionResponse>({ ok: false, error: "MISSING_PASSWORD" }, { status: 400 });
    }

    const expectedHash = process.env.ADMIN_PASSWORD_HASH;
    const sessionToken = process.env.ADMIN_SESSION_TOKEN;

    if (!expectedHash || !sessionToken) {
      console.error("Admin credentials are not configured");
      return NextResponse.json<SessionResponse>({ ok: false, error: "UNAVAILABLE" }, { status: 500 });
    }

    const providedHash = sha256Hex(password);
    if (providedHash !== expectedHash) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return NextResponse.json<SessionResponse>({ ok: false, error: "INVALID_CREDENTIALS" }, { status: 401 });
    }

    const response = NextResponse.json<SessionResponse>({ ok: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: ADMIN_SESSION_MAX_AGE,
      path: "/"
    });

    return response;
  } catch (error) {
    console.error("Failed to create admin session", error);
    return NextResponse.json<SessionResponse>({ ok: false, error: "UNKNOWN" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json<SessionResponse>({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: 0,
    path: "/"
  });
  return response;
}
