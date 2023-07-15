import { Box, Button, Flex, Text, TextInput } from '@mantine/core';
import { useLoginForm } from './use-login-form';
import { useAuthContext } from '../../contexts/auth-context/auth-context';

export const LoginForm = () => {
    const {
        userHandle,
        password,
        loginHandler,
        logoutHandler,
        setUserHandle,
        setPassword,
    } = useLoginForm();

    const { hasUserLogined } = useAuthContext();

    return (
        <Flex
            style={{ border: '1px solid black', borderRadius: 8 }}
            gap={12}
            p={20}
        >
            <Box style={{ flex: 1 }}>
                <Text>User Handle:</Text>
                <TextInput
                    value={userHandle}
                    disabled={hasUserLogined || loginHandler.isLoading}
                    onChange={(e) => {
                        setUserHandle(e.currentTarget.value);
                    }}
                />
            </Box>

            <Box style={{ flex: 1 }}>
                <Text>Password:</Text>
                <TextInput
                    value={password}
                    disabled={hasUserLogined || loginHandler.isLoading}
                    onChange={(e) => {
                        setPassword(e.currentTarget.value);
                    }}
                />
            </Box>

            <Button
                style={{ alignSelf: 'flex-end' }}
                disabled={hasUserLogined || loginHandler.isLoading}
                onClick={() => loginHandler.mutate()}
            >
                {loginHandler.isLoading ? 'Processing...' : 'Login'}
            </Button>

            <Button
                style={{ alignSelf: 'flex-end' }}
                disabled={!hasUserLogined}
                onClick={() => logoutHandler.mutate()}
            >
                {logoutHandler.isLoading ? 'Processing...' : 'Logout'}
            </Button>
        </Flex>
    );
};
