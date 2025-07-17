// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/kerala-admin-panel/', // or '/' for Render
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'), // 👈 Ensure entry is correct
    },
  },
});
