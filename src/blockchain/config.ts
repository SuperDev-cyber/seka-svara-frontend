/**
 * Blockchain Configuration
 * Network: Base Sepolia Testnet
 */

export const BLOCKCHAIN_CONFIG = {
  // Network Configuration
  network: {
    name: 'Base Sepolia',
    chainId: 84532, // Base Sepolia Chain ID
    rpcUrl: 'https://base-sepolia.drpc.org',
    blockExplorer: 'https://sepolia.basescan.org',
  },

  // GameEscrow Contract
  gameEscrow: {
    address: '0x01BdF4098a5CD6539B8A91DB96EaF3418ed02707',
  },

  // Gas settings (optional)
  gas: {
    limit: 500000,
    maxPriorityFeePerGas: '2000000000', // 2 gwei
  },
} as const;

// Room Types Enum (matches contract)
export enum RoomType {
  PUBLIC = 0,
  PRIVATE = 1,
  TOURNAMENT = 2,
}

// Export for easy access
export const CONTRACT_ADDRESS = BLOCKCHAIN_CONFIG.gameEscrow.address;
export const RPC_URL = BLOCKCHAIN_CONFIG.network.rpcUrl;
export const CHAIN_ID = BLOCKCHAIN_CONFIG.network.chainId;

