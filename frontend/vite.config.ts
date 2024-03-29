import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
   build: {
      sourcemap: true
   },
   plugins: [react()],
   server: {
      host: true,
      open: false,
      proxy: {
         '/api': 'http://localhost:5000'
      }
   }
});

