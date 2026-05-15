// src/routes/auth/login/+page.server.ts
import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect, type Cookies } from "@sveltejs/kit";
import { prisma } from "$lib/server/db";
import { auth } from "$lib/server/auth";
import { setJurySessionCookie } from "$lib/server/jury-auth";
import bcrypt from "bcryptjs";

const ADMIN_LANDING = "/admin/dashboard";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.juryJurorId) throw redirect(302, "/jury/account");
  if (locals.user?.role === "JURY") throw redirect(302, "/jury/account");
  if (locals.user?.role === "ADMIN") throw redirect(302, ADMIN_LANDING);
  if (locals.user) throw redirect(302, "/profile");
  return {};
};

// Перекладаємо Set-Cookie з better-auth Response → SvelteKit cookies API
function forwardSetCookies(response: Response, cookies: Cookies) {
  const headers = response.headers as Headers & {
    getSetCookie?: () => string[];
  };
  const setCookieHeaders = headers.getSetCookie?.() ?? [];

  for (const header of setCookieHeaders) {
    const [nameValue, ...attrs] = header.split(";");
    if (!nameValue) continue;
    const eqIdx = nameValue.indexOf("=");
    if (eqIdx < 0) continue;
    const name = nameValue.slice(0, eqIdx).trim();
    const value = nameValue.slice(eqIdx + 1).trim();

    type Opts = Parameters<Cookies["set"]>[2];
    const opts: Opts = { path: "/" };

    for (const attr of attrs) {
      const [k, v] = attr.trim().split("=");
      if (!k) continue;
      const key = k.toLowerCase();
      if (key === "path") opts.path = v ?? "/";
      else if (key === "httponly") opts.httpOnly = true;
      else if (key === "secure") opts.secure = true;
      else if (key === "samesite") {
        const s = v?.toLowerCase();
        if (s === "lax" || s === "strict" || s === "none") opts.sameSite = s;
      } else if (key === "max-age") opts.maxAge = parseInt(v ?? "0");
    }

    cookies.set(name, value, opts);
  }
}

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const fd = await request.formData();
    const email = fd.get("email")?.toString().trim().toLowerCase() ?? "";
    const password = fd.get("password")?.toString() ?? "";
    if (!email || !password) return fail(400, { error: "Заповніть всі поля" });

    const juror = await prisma.juror.findUnique({ where: { email } });
    if (juror) {
      if (!juror.passwordHash)
        return fail(401, { error: "Невірний email або пароль" });
      const valid = await bcrypt.compare(password, juror.passwordHash);
      if (!valid) return fail(401, { error: "Невірний email або пароль" });
      setJurySessionCookie(cookies, juror.id);
      throw redirect(302, "/jury/account");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return fail(401, { error: "Невірний email або пароль" });

    try {
      const apiRes = await auth.api.signInEmail({
        body: { email, password },
        asResponse: true,
      });

      if (!apiRes.ok) {
        return fail(401, { error: "Невірний email або пароль" });
      }

      forwardSetCookies(apiRes, cookies);

      const data = (await apiRes.json().catch(() => null)) as {
        user?: { id: string };
      } | null;
      if (!data?.user) return fail(401, { error: "Невірний email або пароль" });

      if (user.role === "JURY") {
        let j = await prisma.juror.findUnique({ where: { email } });
        if (!j) {
          j = await prisma.juror.create({
            data: { name: user.name, email, passwordChanged: true },
          });
        }
        if (!j) return fail(500, { error: "Не вдалося створити журі" });
        setJurySessionCookie(cookies, j.id);
        throw redirect(302, "/jury/account");
      }
      if (user.role === "ADMIN") throw redirect(302, ADMIN_LANDING);
      throw redirect(302, "/my-teams");
    } catch (e: unknown) {
      if (e && typeof e === "object" && "status" in e && "location" in e) {
        throw e;
      }
      console.error("[login] error:", e);
      return fail(401, { error: "Невірний email або пароль" });
    // 2. Better Auth
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return fail(401, { error: "Невірний email або пароль" });

    const res = await auth.api.signInEmail({
      body: { email, password },
      asResponse: true,
    });

    if (!res.ok) return fail(401, { error: "Невірний email або пароль" });

    const cookieNames = [
      "better-auth.session_token",
      "better-auth.session_data",
    ];
    const raw = res.headers.get("set-cookie") ?? "";
    for (const name of cookieNames) {
      const escaped = name.replace(/\./g, "\\.");
      const match = raw.match(new RegExp(escaped + "=([^;]+)"));
      if (match) {
        cookies.set(name, decodeURIComponent(match[1] ?? ""), {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30,
        });
      }
    }

    if (user.role === "JURY") throw redirect(302, "/jury/account");
    if (user.role === "ADMIN") throw redirect(302, "/admin");
    throw redirect(302, "/profile");
  },
};
