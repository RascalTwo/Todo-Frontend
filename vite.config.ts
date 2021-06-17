import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import eslintPlugin from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [eslintPlugin({ include: 'src/**/*.{ts,js,tsx,jsx}'}), reactRefresh()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000/',
      '/ws': 'ws://localhost:5000/'
    }
  },
  base: './'
});
