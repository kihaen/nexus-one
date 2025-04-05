import { useSession as useNextAuthSession } from 'next-auth/react';
import { Session } from 'next-auth';

interface ExtendedSession extends Session {
  accessToken?: string;
}

export function useSession() {
  const { data: session, status, update } = useNextAuthSession();
  return {
    session: session as ExtendedSession | null,
    status,
    update,
  };
}