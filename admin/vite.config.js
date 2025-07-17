import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/kerala-admin-panel/' // 👈 important if deploying to GitHub Pages
});