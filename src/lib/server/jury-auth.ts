import { createHmac, timingSafeEqual } from "node:crypto";
import { dev } from "$app/environment";
import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";

const COOKIE_NAME = "jury_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function getSecret() {
  const secret =
    env.JURY_SESSION_SECRET ?? env.JWT_SECRET ?? env.BETTER_AUTH_SECRET;
  if (!secret) {
    if (dev) {
      return "dev-jury-secret-change-me";
    }
    throw error(500, "JURY_SESSION_SECRET is not configured");
  }
  return secret;
}

function toBase64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString();
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function createJurySessionToken(jurorId: string) {
  const payload = {
    jurorId,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyJurySessionToken(token: string) {
  const [payloadPart, signaturePart] = token.split(".");
  if (!payloadPart || !signaturePart) return null;

  const expected = sign(payloadPart);
  const providedBuffer = Buffer.from(signaturePart);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length) return null;
  const validSig = timingSafeEqual(providedBuffer, expectedBuffer);
  if (!validSig) return null;

  try {
    const payload = JSON.parse(fromBase64Url(payloadPart)) as {
      jurorId: string;
      exp: number;
    };
    if (!payload.jurorId || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function setJurySessionCookie(
  cookies: import("@sveltejs/kit").Cookies,
  jurorId: string,
) {
  cookies.set(COOKIE_NAME, createJurySessionToken(jurorId), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: !dev,
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearJurySessionCookie(
  cookies: import("@sveltejs/kit").Cookies,
) {
  cookies.delete(COOKIE_NAME, { path: "/" });
}

export function getJurySession(cookies: import("@sveltejs/kit").Cookies) {
  const token = cookies.get(COOKIE_NAME);
  if (!token) return null;
  return verifyJurySessionToken(token);
}
