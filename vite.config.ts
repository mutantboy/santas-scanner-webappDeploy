import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  
  plugins: [react()],
  server: {
    host: true
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:3000'),
  }, 
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true 
  }  
});
