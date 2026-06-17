import { create } from 'zustand';

export type Theme = 'light' | 'dark';
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ModalConfig {
  [key: string]: boolean;
}

interface UiState {
  sidebarCollapsed: boolean;
  theme: Theme;
  modals: ModalConfig;
  toasts: Toast[];

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  openModal: (name: string) => void;
  closeModal: (name: string) => void;
  toggleModal: (name: string) => void;
  showToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
}

let toastIdCounter = 0;
const generateToastId = () => `toast-${++toastIdCounter}-${Date.now()}`;

export const useUiStore = create<UiState>((set, get) => ({
  sidebarCollapsed: false,
  theme: (() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as Theme;
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  })(),
  modals: {},
  toasts: [],

  toggleSidebar: () => {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
  },

  setSidebarCollapsed: (collapsed: boolean) => {
    set({ sidebarCollapsed: collapsed });
  },

  setTheme: (theme: Theme) => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
    set({ theme });
  },

  toggleTheme: () => {
    const { theme, setTheme } = get();
    setTheme(theme === 'light' ? 'dark' : 'light');
  },

  openModal: (name: string) => {
    set((state) => ({
      modals: { ...state.modals, [name]: true },
    }));
  },

  closeModal: (name: string) => {
    set((state) => ({
      modals: { ...state.modals, [name]: false },
    }));
  },

  toggleModal: (name: string) => {
    set((state) => ({
      modals: { ...state.modals, [name]: !state.modals[name] },
    }));
  },

  showToast: (toast: Omit<Toast, 'id'>) => {
    const id = generateToastId();
    const newToast: Toast = { id, duration: 3000, ...toast };
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        get().dismissToast(id);
      }, newToast.duration);
    }
  },

  dismissToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },
}));
