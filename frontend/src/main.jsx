import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { supportedChains } from './config/network'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import './index.css'
import { sepolia } from 'wagmi/chains'

// Buffer polyfill
import { Buffer } from 'buffer'
window.Buffer = Buffer

// Get Alchemy API key from environment variable
const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY
if (!ALCHEMY_API_KEY) {
  throw new Error('Missing VITE_ALCHEMY_API_KEY environment variable')
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
  [
    alchemyProvider({ apiKey: ALCHEMY_API_KEY }),
    publicProvider()
  ]
)

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  chains,
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: 1000,
      staleTime: 5000,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiConfig>
  </React.StrictMode>,
)
