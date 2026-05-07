import { redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/db";
import { setJurySessionCookie } from "$lib/server/jury-auth";
import type { Cookies } from "@sveltejs/kit";

export async function consumeMagicLinkToken(token: string, cookies: Cookies) {
  const dbToken = await prisma.juryToken.findUnique({
    where: { token },
    include: { juror: true },
  });

  if (!dbToken) {
    throw redirect(302, "/jury/login?error=token_not_found");
  }

  if (dbToken.used) {
    throw redirect(302, "/jury/login?error=token_used");
  }

  if (dbToken.expiresAt < new Date()) {
    throw redirect(302, "/jury/login?error=token_expired");
  }

  await prisma.juryToken.update({
    where: { id: dbToken.id },
    data: { used: true },
  });

  setJurySessionCookie(cookies, dbToken.jurorId);
  throw redirect(302, "/jury/account");
}
