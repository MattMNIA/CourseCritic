import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';

// Load env file based on mode
process.env = { ...process.env, ...dotenv.config({ path: '../.env' }).parsed };

export default defineConfig({
  plugins: [react()],
  define: {
    // This is the key change that makes env variables available
    'process.env': JSON.stringify(process.env)
  },
  root: path.resolve(__dirname),
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      }
    },
    watch: {
      usePolling: true
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
