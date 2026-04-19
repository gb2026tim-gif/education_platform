import { createAuthClient } from "better-auth/svelte";

const client = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:5173",
});

export const authClient = client;
export const signIn = client.signIn;
export const signOut = client.signOut;
export const signUp = client.signUp;
