import { useEffect } from 'react';
import { useMutation } from 'react-query';
import { AuthService } from '~/modules/auth/auth-service';
import { matrixClient } from '~/modules/matrix/matrix-client';

export const useAppLoader = () => {
    const loadHandler = useMutation({
        mutationFn: async () => {
            const authService = new AuthService();

            const hasUserLogined = await authService.hasUserLogined();

            if (hasUserLogined) {
                await matrixClient.startClient();
            }
        },
    });

    useEffect(
        () => {
            loadHandler.mutate();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return { loadHandler };
};
