import { AppShell, MantineProvider } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainPage } from './pages';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from '../auth/contexts/auth-context/auth-provider';
import { AppLoader } from './loaders/app-loader/app-loader';

const queryClient = new QueryClient();

export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <MantineProvider>
                    <AppLoader>
                        <AppShell>
                            <Router>
                                <Routes>
                                    <Route path="/" element={<MainPage />} />
                                </Routes>
                            </Router>
                        </AppShell>
                    </AppLoader>
                </MantineProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
};
