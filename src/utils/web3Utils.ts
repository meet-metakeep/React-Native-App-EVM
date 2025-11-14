/**
 * Web3 & Blockchain Utility Functions
 * Functions for interacting with Ethereum blockchain
 */

import {
  TransactionParams,
  SignedTransaction,
  NonceResponse,
  BroadcastResponse,
  MetaKeepSDK,
} from '../types/types';
import {CONFIG} from '../config/config';

/**
 * Helper function to try RPC request with fallback
 * @param primaryUrl - Primary RPC URL
 * @param backupUrl - Backup RPC URL
 * @param requestBody - JSON-RPC request body
 * @returns Response data
 */
const fetchWithFallback = async (
  primaryUrl: string,
  backupUrl: string,
  requestBody: object,
): Promise<any> => {
  const tryFetch = async (url: string, isFallback: boolean = false) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      CONFIG.NETWORK_TIMEOUT,
    );

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // If rate limited (429) or server error (5xx), try fallback
      if (!response.ok) {
        if (
          (response.status === 429 || response.status >= 500) &&
          !isFallback
        ) {
          console.log(
            `Primary RPC failed with status ${response.status}, trying backup...`,
          );
          return await tryFetch(backupUrl, true);
        }
        throw new Error(
          `RPC error: ${response.status} - ${
            response.status === 429
              ? 'Rate limit exceeded'
              : 'Server error'
          }`,
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        if (!isFallback) {
          console.log('Primary RPC timeout, trying backup...');
          return await tryFetch(backupUrl, true);
        }
        throw new Error(
          'Network request timed out. Please check your internet connection.',
        );
      }
      throw error;
    }
  };

  return await tryFetch(primaryUrl);
};

/**
 * Fetches the current transaction nonce for an Ethereum address
 * @param address - Ethereum address to query
 * @param rpcUrl - RPC endpoint URL (optional, uses config by default)
 * @returns Current nonce as a number
 */
export const getCurrentNonce = async (
  address: string,
  rpcUrl?: string,
): Promise<number> => {
  const requestBody = {
    jsonrpc: '2.0',
    method: 'eth_getTransactionCount',
    params: [address, 'latest'],
    id: 1,
  };

  const result: NonceResponse = await fetchWithFallback(
    rpcUrl || CONFIG.RPC_URL,
    CONFIG.RPC_URL_BACKUP,
    requestBody,
  );

  if (!result.result) {
    throw new Error('Failed to get nonce from network');
  }

  return parseInt(result.result, 16);
};

/**
 * Creates transaction parameters for signing
 * @param nonce - Transaction nonce
 * @returns Transaction parameters object
 */
export const createTransactionParams = (nonce: number): TransactionParams => {
  return {
    type: 2, // EIP-1559 transaction type
    to: CONFIG.RECIPIENT_ADDRESS,
    value: CONFIG.TX_VALUE,
    nonce: `0x${nonce.toString(16)}`,
    data: CONFIG.TX_DATA,
    chainId: CONFIG.CHAIN_ID,
    gas: CONFIG.TX_GAS_LIMIT,
    maxFeePerGas: CONFIG.TX_MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: CONFIG.TX_MAX_PRIORITY_FEE_PER_GAS,
  };
};

/**
 * Signs a transaction using MetaKeep SDK
 * @param metakeep - MetaKeep SDK instance
 * @param params - Transaction parameters
 * @returns Signed transaction data
 */
export const signTransaction = async (
  metakeep: MetaKeepSDK,
  params: TransactionParams,
): Promise<SignedTransaction> => {
  try {
    // Try to sign with primary method
    return await metakeep.signTransaction(params, 'MetaKeep Demo Transaction');
  } catch (signError) {
    console.error('Primary signing method failed, trying fallback:', signError);
    // Retry with fallback (same params, but creates new object)
    return await metakeep.signTransaction(
      {...params},
      'MetaKeep Demo Transaction',
    );
  }
};

/**
 * Broadcasts signed transaction to the network
 * @param signedTx - Signed transaction data
 * @param rpcUrl - RPC endpoint URL (optional, uses config by default)
 * @returns Transaction hash
 */
export const broadcastTransaction = async (
  signedTx: SignedTransaction,
  rpcUrl?: string,
): Promise<string> => {
  // Extract signed transaction from possible fields
  const rawTx =
    signedTx.rawTransaction ||
    signedTx.signedTransaction ||
    signedTx.signedRawTransaction;

  if (!rawTx) {
    throw new Error('No signed transaction data found');
  }

  const requestBody = {
    jsonrpc: '2.0',
    method: 'eth_sendRawTransaction',
    params: [rawTx],
    id: 1,
  };

  const result: BroadcastResponse = await fetchWithFallback(
    rpcUrl || CONFIG.RPC_URL,
    CONFIG.RPC_URL_BACKUP,
    requestBody,
  );

  if (result.error) {
    throw new Error(result.error.message || 'Failed to broadcast transaction');
  }

  if (!result.result) {
    throw new Error('Unexpected response format');
  }

  return result.result;
};

