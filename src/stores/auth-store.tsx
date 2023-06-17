import { create } from 'zustand';

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

export const useAuthStore = create<AuthStore>((set) => ({
    authUser: undefined,
    setAuth: (authChatGmUser, authMatrixUser) => {
        set({ authChatGmUser, authMatrixUser });
    },
}));
