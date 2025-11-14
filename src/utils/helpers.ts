/**
 * Helper Utility Functions
 * General-purpose helper functions
 */

import {Linking, Alert} from 'react-native';
import {WalletData} from '../types/types';
import {CONFIG} from '../config/config';

/**
 * Extracts user email from wallet data response
 * Tries multiple possible locations in the response object
 * @param walletData - The wallet data returned from MetaKeep SDK
 * @returns Extracted email or empty string if not found
 */
export const extractEmailFromWallet = (walletData: WalletData): string => {
  return (
    walletData.wallet?.email ||
    walletData.email ||
    walletData.user?.email ||
    walletData.userInfo?.email ||
    ''
  );
};

/**
 * Opens Etherscan URL for transaction
 * @param txHash - Transaction hash
 */
export const openEtherscan = async (txHash: string): Promise<void> => {
  const etherscanUrl = `${CONFIG.ETHERSCAN_URL}/tx/${txHash}`;
  console.log('Opening Etherscan URL:', etherscanUrl);
  try {
    await Linking.openURL(etherscanUrl);
  } catch (error) {
    console.error('Failed to open URL:', error);
    Alert.alert('Error', 'Failed to open Etherscan link');
  }
};

