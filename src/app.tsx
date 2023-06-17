import { AppShell, MantineProvider } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainPage } from './pages';
import { MatrixProvider } from './contexts';

export const App = () => {
    return (
        <MantineProvider>
            <MatrixProvider>
                <Router>
                    <AppShell>
                        <Routes>
                            <Route path="/" element={<MainPage />} />
                        </Routes>
                    </AppShell>
                </Router>
            </MatrixProvider>
        </MantineProvider>
    );
};
