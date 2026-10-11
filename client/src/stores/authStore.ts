import { create } from 'zustand';
import { api } from '../lib/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'ADMIN' | 'INSTRUCTOR';
  avatarUrl?: string;
  xp: number;
  streak: {
    current: number;
    longest: number;
    lastActiveDate: string;
  };
  badges: string[];
  preferences: {
    theme: 'dark' | 'light' | 'system';
    reducedMotion: boolean;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const user = res.data.data.user;
    set({ user, isAuthenticated: true, isLoading: false });
    return user;
  },
  register: async (name: string, email: string, password: string) => {
    const res = await api.post('/auth/register', { name, email, password });
    const user = res.data.data.user;
    set({ user, isAuthenticated: true, isLoading: false });
    return user;
  },
  checkAuth: async () => {
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data.data.user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user, isLoading: false });
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },
}));
