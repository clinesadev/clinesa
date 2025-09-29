import { create } from 'zustand'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface UIState {
  loading: boolean
  toasts: Toast[]
  setLoading: (loading: boolean) => void
  toast: (message: string, type?: ToastType) => void
  removeToast: (id: string) => void
}

export const useUIStore = create<UIState>((set, get) => ({
  loading: false,
  toasts: [],
  setLoading: (loading) => set({ loading }),
  toast: (message, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = { id, message, type }
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }))

    // Auto remove toast after 5 seconds
    setTimeout(() => {
      get().removeToast(id)
    }, 5000)
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}))
