import { create } from 'zustand';
import { api } from '../lib/api.js';

interface User {
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
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
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
