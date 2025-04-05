import { GetServerSideProps } from 'next';
import { getProviders, signIn } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useState } from 'react';
import * as S from "@/styles/SignIn.style"

interface SignInProps {
  providers: Record<BuiltInProviderType, any> | null;
}

export default function SignIn({ providers }: SignInProps) {
  const router = useRouter();
  const { callback, error } = router.query;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCredentialsLoading, setIsCredentialsLoading] = useState(false);

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCredentialsLoading(true);
    console.log(callback)
    const result = await signIn('credentials', {
      email,
      password,
      redirect: true,
      callbackUrl: typeof callback === 'string' ? callback : '/'
    });

    if (result?.error) {
      router.push(`/auth/signin?error=${encodeURIComponent(result.error)}`);
    } else {
      router.push('/');
    }
    
    setIsCredentialsLoading(false);
  };

  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      
      <S.PageContainer>
        <S.Card>
          <S.Title>Sign in to your account</S.Title>
          
          {error && (
            <S.ErrorAlert>
              {typeof error === 'string' ? error : 'Authentication failed'}
            </S.ErrorAlert>
          )}

          <S.Form onSubmit={handleCredentialsSignIn}>
            <S.FormGroup>
              <S.Label htmlFor="email">Email address</S.Label>
              <S.Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </S.FormGroup>
            <S.FormGroup>
              <S.Label htmlFor="password">Password</S.Label>
              <S.Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </S.FormGroup>
            <S.FormGroup>
              <S.SubmitButton
                type="submit"
                $isLoading={isCredentialsLoading}
              >
                {isCredentialsLoading ? 'Signing in...' : 'Sign in with Email'}
              </S.SubmitButton>
            </S.FormGroup>
          </S.Form>

          <S.Divider>
            <S.DividerLine />
            <S.DividerText>Or continue with</S.DividerText>
          </S.Divider>

          {providers && Object.values(providers)
            .filter(provider => provider.id !== 'credentials')
            .map((provider) => (
              <S.FormGroup key={provider.name}>
                <S.OAuthButton
                  onClick={() => {
                    signIn(provider.id, { 
                    callbackUrl: typeof callback === 'string' ? callback : '/'
                  })}}
                >
                  Continue with {provider.name}
                </S.OAuthButton>
              </S.FormGroup>
            ))}

          <S.SignUpLink>
            <span>Don't have an account? </span>
            <a href="/register">Sign up</a>
          </S.SignUpLink>
        </S.Card>
      </S.PageContainer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};