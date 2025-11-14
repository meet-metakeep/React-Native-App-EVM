/**
 * Application Configuration Constants
 * All environment-specific settings and blockchain parameters
 */

export const CONFIG = {
  // MetaKeep SDK Configuration
  METAKEEP_APP_ID: 'a071e2fe-54b8-41f2-8082-137e2073085e',

  // Network Configuration (Sepolia Testnet)
  RPC_URL: 'https://ethereum-sepolia-rpc.publicnode.com', // Primary RPC
  RPC_URL_BACKUP: 'https://rpc.sepolia.org', // Backup RPC
  CHAIN_ID: '0xaa36a7', // Sepolia testnet chain ID
  ETHERSCAN_URL: 'https://sepolia.etherscan.io',

  // Transaction Default Parameters
  RECIPIENT_ADDRESS: '0x97706df14a769e28ec897dac5ba7bcfa5aa9c444',
  TX_VALUE: '0x2710', // 10000 wei
  TX_DATA: '0x0123456789',
  TX_GAS_LIMIT: '0x186A0', // 100000
  TX_MAX_FEE_PER_GAS: '0x59682F00', // 1.5 Gwei
  TX_MAX_PRIORITY_FEE_PER_GAS: '0x59682F00', // 1.5 Gwei

  // Network Timeout
  NETWORK_TIMEOUT: 30000, // 30 seconds
};

