import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    global: 'globalThis'
  },
  resolve: {
    alias: {
      buffer: 'buffer'
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@tanstack/react-query',
      'wagmi',
      'wagmi/chains',
      'wagmi/connectors/injected',
      'ethers',
      'buffer'
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  server: {
    hmr: {
      overlay: false
    }
  }
})
