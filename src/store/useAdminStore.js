import Cookies from 'js-cookie';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAdminStore = create(
  persist(
    (set) => ({
      admin: null,
      token: null,
      isAuthenticated: false,
      login: (adminData, token) => {
        Cookies.set('admin_token', token, { expires: 1 });
        set({ admin: adminData, token, isAuthenticated: true });
      },
      logout: () => {
        Cookies.remove('admin_token');
        set({ admin: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'admin-auth-storage',
      partialize: (state) => ({ admin: state.admin, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAdminStore;
