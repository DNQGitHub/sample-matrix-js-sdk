import { useState } from 'react';
import { useMutation } from 'react-query';
import { AuthService } from '~/modules/auth/auth-service';
import { matrixClient } from '~/modules/matrix/matrix-client';

export const useLoginForm = () => {
    const [userHandle, setUserHandle] = useState('gm.qtest1');
    const [password, setPassword] = useState('123456789');

    const loginHandler = useMutation({
        mutationFn: async () => {
            const authService = new AuthService();
            await authService.loginWithChatGmUserHandle({
                handle: userHandle,
                password: password,
            });
            await matrixClient.startClient();
        },
    });

    const logoutHandler = useMutation({
        mutationFn: async () => {
            const authService = new AuthService();
            await authService.logout();
        },
    });

    return {
        userHandle,
        password,
        loginHandler,
        logoutHandler,
        setUserHandle,
        setPassword,
    };
};
