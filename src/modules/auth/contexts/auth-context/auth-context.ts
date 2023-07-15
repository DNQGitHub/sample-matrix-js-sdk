import { createContext, useContext } from 'react';
import { AuthUser as ChatGmAuthUser } from '~/modules/chatgm/stores/auth-store';
import { AuthUser as MatrixAuthUser } from '~/modules/matrix/stores/auth-store';

export type AuthContextValue = {
    chatGmAuthUser?: ChatGmAuthUser;
    matrixAuthUser?: MatrixAuthUser;
    hasUserLogined?: boolean;
};

export const AuthContext = createContext<AuthContextValue>(
    {} as AuthContextValue
);

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) throw new Error('Miss wrapping with AuthContext.Provider');

    return context;
};
