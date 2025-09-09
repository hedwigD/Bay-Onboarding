export const CONTRACT_ADDRESS = "0x71f7a3061734bc69c52e35c4595bec3e4dc60090";

export const TARGET_CHAIN = {
  id: 11155111,
  name: "Sepolia",
  rpcUrl: import.meta.env.VITE_SEPOLIA_RPC || "https://sepolia.infura.io/v3/YOUR_KEY",
  explorer: "https://sepolia.etherscan.io",
  nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
} as const;
