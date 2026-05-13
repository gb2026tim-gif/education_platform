// src/app.d.ts
// See https://kit.svelte.dev/docs/types#app

import type { Session, User } from 'better-auth';

declare global {
  namespace App {
    interface Locals {
      user: (User & { role?: string; mustChangePassword?: boolean }) | null;
      session: Session | null;
      mustChangePassword: boolean;
    }
    interface PageData {
      user?: Locals['user'];
      mustChangePassword?: boolean;
    }
  }
}

export {};
