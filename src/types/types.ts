/**
 * TypeScript Type Definitions
 * All interfaces and types used throughout the application
 */

import type {PropsWithChildren} from 'react';

/**
 * Section component props for displaying titled content areas
 */
export type SectionProps = PropsWithChildren<{
  title: string;
}>;

/**
 * Wallet data structure returned from MetaKeep SDK
 */
export interface WalletData {
  wallet?: {
    ethAddress?: string;
    solAddress?: string;
    eosAddress?: string;
    email?: string;
  };
  email?: string;
  user?: {
    email?: string;
  };
  userInfo?: {
    email?: string;
  };
}

/**
 * MetaKeep SDK interface
 */
export interface MetaKeepSDK {
  getWallet: () => Promise<WalletData>;
  setUser: (user: {email: string}) => Promise<void>;
  signTransaction: (
    params: TransactionParams,
    reason: string,
  ) => Promise<SignedTransaction>;
}

/**
 * EIP-1559 transaction parameters
 */
export interface TransactionParams {
  type: number;
  to: string;
  value: string;
  nonce: string;
  data: string;
  chainId: string;
  gas: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
}

/**
 * Signed transaction response from MetaKeep
 */
export interface SignedTransaction {
  rawTransaction?: string;
  signedTransaction?: string;
  signedRawTransaction?: string;
}

/**
 * RPC JSON response for transaction count
 */
export interface NonceResponse {
  result?: string;
  error?: {
    message: string;
  };
}

/**
 * RPC JSON response for transaction broadcast
 */
export interface BroadcastResponse {
  result?: string;
  error?: {
    message: string;
  };
}

/**
 * Status Section Props
 */
export interface StatusSectionProps {
  metakeepInitialized: boolean;
}

/**
 * Wallet Section Props
 */
export interface WalletSectionProps {
  loading: boolean;
  metakeepInitialized: boolean;
  wallet: WalletData | null;
  userEmail: string;
  onGetWallet: () => void;
}

/**
 * Transaction Section Props
 */
export interface TransactionSectionProps {
  loading: boolean;
  metakeepInitialized: boolean;
  wallet: WalletData | null;
  transactionHash: string;
  onSignAndBroadcast: () => void;
  onOpenEtherscan: (txHash: string) => void;
}

