import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type AuthUser = {
    userId: string;
    accessToken: string;
};

export type AuthStore = {
    authUser?: AuthUser;
    setAuthUser: (authUser?: AuthUser) => void;
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            authUser: undefined,
            setAuthUser: (authUser?: AuthUser) => {
                set({ authUser });
            },
        }),
        {
            name: 'matrix-auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
