import { sepolia } from 'wagmi/chains';

export const supportedChains = [sepolia];

// Optional: Add custom RPC configuration if needed
export const customSepolia = {
  ...sepolia,
  rpcUrls: {
    ...sepolia.rpcUrls,
    default: {
      http: [`https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`],
    },
    public: {
      http: [`https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`],
    },
  },
}; 