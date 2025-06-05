// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1000 KB (optional)
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Put all node_modules imports into a 'vendor' chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          // You can add more custom chunking logic here if needed
        },
      },
    },
  },
});
