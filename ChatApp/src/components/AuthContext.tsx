import { createContext } from 'react';
import { User } from '../types';

export interface AuthContextProp {
  initialized: boolean;
  user: User | null;
  signup: (email: string, password: string, name: string) => Promise<void>;
  processingSignup: boolean;
}

const AuthContext = createContext<AuthContextProp>({
  initialized: false,
  user: null,
  signup: async () => {},
  processingSignup: false,
});

export default AuthContext;
