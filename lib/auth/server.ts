import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants";

export class AdminUnauthorizedError extends Error {
  status: number;

  constructor(message = "UNAUTHORIZED") {
    super(message);
    this.name = "AdminUnauthorizedError";
    this.status = 401;
  }
}

export function requireAdminSession(): void {
  const expected = process.env.ADMIN_SESSION_TOKEN;
  if (!expected) {
    throw new Error("ADMIN_SESSION_TOKEN is not configured");
  }

  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  if (!token || token !== expected) {
    throw new AdminUnauthorizedError();
  }
}
