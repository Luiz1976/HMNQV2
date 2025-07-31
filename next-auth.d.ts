import { AuthUser } from '@/lib/types';

declare module 'next-auth' {
  interface Session {
    user: AuthUser;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user?: AuthUser;
  }
}