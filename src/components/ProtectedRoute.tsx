import { useRouter } from 'next/router';
import { useSession } from '../hooks/useSession';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(router.asPath)}`);
    }
    
    if (requiredRole && session?.user.role !== requiredRole) {
      router.push('/unauthorized');
    }
  }, [session, status, router, requiredRole]);

  if (status === 'loading' || !session) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}