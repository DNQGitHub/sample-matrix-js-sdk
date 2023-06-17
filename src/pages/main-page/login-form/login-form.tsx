import React from 'react';
import { Button, Flex, TextInput } from '@mantine/core';
import { useLoginForm } from './use-login-form';
import { useAuthStore } from '~/services/auth-service/auth-store';

export const LoginForm = () => {
    const [handle, setHandle] = React.useState('gm.qtest1');
    const [password, setPassword] = React.useState('123456789');

    const { handleLoginWithHandle, handleLogout } = useLoginForm();
    const isLogined = useAuthStore(
        (s) => !!s.authChatGmUser && !!s.authMatrixUser
    );

    return (
        <Flex gap={5}>
            <TextInput
                placeholder="@handle"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
            />
            <TextInput
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button
                disabled={isLogined}
                onClick={() => {
                    handleLoginWithHandle({ handle, password });
                }}
            >
                Login
            </Button>
            <Button
                disabled={!isLogined}
                onClick={() => {
                    handleLogout();
                }}
            >
                Logout
            </Button>
        </Flex>
    );
};
