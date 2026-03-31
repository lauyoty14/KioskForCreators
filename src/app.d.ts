import type { GeneradorPublic } from '$lib/types';

declare global {
  namespace App {
    interface Locals {
      token: string | null;
      user: GeneradorPublic | null;
    }

    interface PageData {
      user?: GeneradorPublic | null;
      apiBaseUrl?: string;
    }
  }
}

export {};
