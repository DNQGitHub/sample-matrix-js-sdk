import { PropsWithChildren } from 'react';
import { AuthContext } from './auth-context';
import { useAuthStore as useChatGmAuthStore } from '~/modules/chatgm/stores/auth-store';
import { useAuthStore as useMatrixAuthStore } from '~/modules/matrix/stores/auth-store';

export type AuthProviderProps = PropsWithChildren;

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const chatGmAuthUser = useChatGmAuthStore((s) => s.authUser);
    const matrixAuthUser = useMatrixAuthStore((s) => s.authUser);

    return (
        <AuthContext.Provider
            value={{
                chatGmAuthUser,
                matrixAuthUser,
                hasUserLogined: !!chatGmAuthUser && !!matrixAuthUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
