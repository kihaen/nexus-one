import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { useEffect } from 'react';

const AuthErrorPage: NextPage = () => {
  const router = useRouter();
  const { error } = router.query;

  useEffect(() => {
    // If the error is OAuthAccountNotLinked, suggest signing in with the original provider
    if (error === 'OAuthAccountNotLinked') {
      const timer = setTimeout(() => {
        // Redirect to sign-in after 5 seconds
        signIn(undefined, { callbackUrl: '/' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        {error === 'OAuthAccountNotLinked' ? (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-4">Account Not Linked</h1>
            <p className="mb-4">
              The email associated with your account is already registered with another login method.
              Please sign in with your original method to link accounts.
            </p>
            <p>You will be redirected to the sign-in page in 5 seconds...</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
            <p className="mb-4">An unexpected error occurred: {error}</p>
            <button
              onClick={() => signIn(undefined, { callbackUrl: '/' })}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthErrorPage;