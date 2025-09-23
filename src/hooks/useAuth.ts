import { useLocalStorage } from './useLocalStorage';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const defaultAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
};

// Mock user for demo purposes
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Admin',
};

export function useAuth() {
  const [authState, setAuthState] = useLocalStorage<AuthState>('ticketApp_auth', defaultAuthState);

  const login = (email: string, password: string) => {
    // Simulate login - in real app, this would call an API
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          setAuthState({
            user: mockUser,
            isAuthenticated: true,
          });
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const register = (name: string, email: string, password: string) => {
    // Simulate registration - in real app, this would call an API
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (name && email && password) {
          const newUser: User = {
            id: Date.now().toString(),
            name,
            email,
            role: 'User',
          };
          setAuthState({
            user: newUser,
            isAuthenticated: true,
          });
          resolve();
        } else {
          reject(new Error('All fields are required'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setAuthState(defaultAuthState);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (authState.user) {
      setAuthState({
        ...authState,
        user: { ...authState.user, ...updates },
      });
    }
  };

  return {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
  };
}