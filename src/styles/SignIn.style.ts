import styled from "styled-components";
// Styled Components
export const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  padding: 0.75rem;
`;

export const Card = styled.div`
  max-width: 28rem;
  width: 100%;
  padding: 2rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
`;

export const ErrorAlert = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
`;

export const Form = styled.form`
  margin-top: 2rem;
`;

export const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
`;

export const Input = styled.input`
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-size: 0.875rem;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
  }
`;

export const SubmitButton = styled.button<{ $isLoading: boolean }>`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: #2563eb;
  &:hover {
    background-color: #1d4ed8;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px white, 0 0 0 4px #3b82f6;
  }
  ${({ $isLoading }) => $isLoading && `
    opacity: 0.5;
    cursor: not-allowed;
  `}
`;

export const Divider = styled.div`
  position: relative;
  margin: 1.5rem 0;
`;

export const DividerLine = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  &::before {
    content: '';
    width: 100%;
    border-top: 1px solid #d1d5db;
  }
`;

export const DividerText = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  padding: 0 0.5rem;
  background-color: white;
  color: #6b7280;
  font-size: 0.875rem;
`;

export const OAuthButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  background-color: white;
  &:hover {
    background-color: #f9fafb;
  }
`;

export const SignUpLink = styled.div`
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
  a {
    font-weight: 500;
    color: #2563eb;
    &:hover {
      color: #1d4ed8;
    }
  }
`;