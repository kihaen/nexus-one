export type User = {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
  };
  
  export type SignUpFormData = {
    name: string;
    email: string;
    password: string;
  };
  
  export type ApiResponse<T> = {
    data?: T;
    error?: string;
  };
  
  export type Session = {
    user: User;
    expires: string;
  };