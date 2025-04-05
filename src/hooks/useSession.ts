import { useSession as useNextAuthSession } from 'next-auth/react';
import { Session } from 'next-auth';

interface ExtendedSession extends Omit<Session, 'user'> {
  accessToken?: string;
  user: {
    id: string;
    email: string | null | undefined;
    name?: string | null;
    image?: string | null;
    role?: string;
  };
}

export function useSession() {
  const { data: session, status, update } = useNextAuthSession();
  return {
    session: session as ExtendedSession | null,
    status,
    update,
  };
}