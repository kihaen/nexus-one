import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import styled from 'styled-components';

// Reuse styled components from your sign-in page where possible
import {
  PageContainer,
  Card,
  ErrorAlert,
  Form,
  FormGroup,
  Label,
  Input,
  SubmitButton,
} from '@/styles/SignIn.style'; // Adjust import path as needed

// Additional styled components specific to register page
const RegisterTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const SignInLink = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  a {
    color: #2563eb;
    font-weight: 500;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Spinner = styled.svg`
  animation: spin 1s linear infinite;
  margin-right: 0.75rem;
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      // Redirect to login with success message
      router.push(`/auth/signin?success=Registration successful. Please sign in.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register | Your App</title>
      </Head>
      
      <PageContainer>
        <Card>
          <div className="text-center">
            <RegisterTitle>Create your account</RegisterTitle>
            <SignInLink>
              Already have an account?{' '}
              <Link href="/auth/signin">
                Sign in
              </Link>
            </SignInLink>
          </div>

          {error && (
            <ErrorAlert>
              {error}
            </ErrorAlert>
          )}

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name" className="sr-only">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="email" className="sr-only">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <SubmitButton
                type="submit"
                $isLoading={loading}
                disabled={loading}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <Spinner width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"></circle>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75"></path>
                    </Spinner>
                    Registering...
                  </span>
                ) : (
                  'Register'
                )}
              </SubmitButton>
            </FormGroup>
          </Form>
        </Card>
      </PageContainer>
    </>
  );
}