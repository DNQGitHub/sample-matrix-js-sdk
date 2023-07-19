import { useEffect } from 'react';
import { useMutation } from 'react-query';
import { AuthService } from '~/modules/auth/auth-service';
import { resolvePromise } from '~/modules/common/utils';
import { matrixClient } from '~/modules/matrix/matrix-client';

export const useAppLoader = () => {
    const loadHandler = useMutation({
        mutationFn: async () => {
            const authService = new AuthService();

            const hasUserLogined = await authService.hasUserLogined();

            if (hasUserLogined) {
                const [, startMatrixErr] = await resolvePromise(
                    matrixClient.startClient()
                );

                if (
                    startMatrixErr &&
                    (startMatrixErr as Error).name === 'M_UNKNOWN_TOKEN'
                ) {
                    await authService.logout();
                }
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
