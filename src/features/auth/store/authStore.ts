import { create } from 'zustand';
import { apiClient } from '@/shared/lib/api-client';
import type { User, LoginCredentials } from '@/shared/types/auth.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error: string | null }>;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: () => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        set({ user, isAuthenticated: true, isLoading: false });
      } catch {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },

  login: async (credentials) => {
    try {
      const { data } = await apiClient.post('/auth/login', credentials);

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      set({ user: data.user, isAuthenticated: true });
      return { success: true, error: null };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao conectar com o servidor';
      return { success: false, error: errorMessage };
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },
}));
