import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        global: 'window',
    },
    resolve: {
        alias: ['assets', 'pages', 'services', 'utils'].map((i) => ({
            find: `~/${i}`,
            replacement: path.resolve(__dirname, 'src', i),
        })),
    },
});

