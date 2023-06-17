import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type AuthChatGmUser = {
    handle: string;
    accessToken: string;
};

export type AuthMatrixUser = {
    userId: string;
    accessToken: string;
};

export type AuthStore = {
    authChatGmUser?: AuthChatGmUser;
    authMatrixUser?: AuthMatrixUser;

    setAuth: (
        authChatGmUser?: AuthChatGmUser,
        authMatrixUser?: AuthMatrixUser
    ) => void;
};

export const useAuthStore = create<AuthStore>(
    // @ts-ignore
    persist(
        (set) => ({
            authUser: undefined,
            setAuth: (authChatGmUser, authMatrixUser) => {
                set({ authChatGmUser, authMatrixUser });
            },
        }),
        {
            name: 'auth-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage),
        }
    )
);
