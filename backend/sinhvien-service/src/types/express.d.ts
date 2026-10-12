import type { Request } from 'express';

declare global {
  namespace Express {
    interface User {
      MSV?: string;
      msv?: string;
      VAITRO?: string;
      role?: string;
    }
  }
}

export {};