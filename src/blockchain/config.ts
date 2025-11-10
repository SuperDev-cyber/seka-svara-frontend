/**
 * Blockchain Configuration
 * Network: Binance Smart Chain (BSC) Mainnet
 */

export const BLOCKCHAIN_CONFIG = {
  // Network Configuration
  network: {
    name: 'Binance Smart Chain',
    chainId: 56, // BSC Mainnet Chain ID
    // Using Web3Auth bundled RPC for consistency with SafeAuth integration
    // This ensures all frontend blockchain operations use the same RPC endpoint
    rpcUrl: 'https://api.web3auth.io/infura-service/v1/0x38/BDYU7Pkurgm7StMwMbJl3upFOo6-0Xgm6e0-VIsVSjjmWP7_j583kzMx4Op0dIP2tlmOw1yhHA7rmBOni8fCb0Q',
    blockExplorer: 'https://bscscan.com',
  },

  // GameEscrow Contract
  gameEscrow: {
    address: '0xd079BbF34fD2BECa098c8C48D4742B7ef1D62A80',
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

