/**
 * Transaction Section Component
 * Handles transaction signing, broadcasting, and result display
 */

import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Section} from './Section';
import {TransactionSectionProps} from '../types/types';
import {styles} from '../styles/styles';

export function TransactionSection({
  loading,
  metakeepInitialized,
  wallet,
  transactionHash,
  onSignAndBroadcast,
  onOpenEtherscan,
}: TransactionSectionProps): React.JSX.Element {
  return (
    <Section title="Transaction Operations">
      {/* Sign & Broadcast button - requires wallet and SDK to be ready */}
      <TouchableOpacity
        style={[
          styles.primaryButton,
          (loading || !metakeepInitialized || !wallet) &&
            styles.buttonDisabled,
        ]}
        onPress={onSignAndBroadcast}
        disabled={loading || !metakeepInitialized || !wallet}>
        <Text style={styles.primaryButtonText}>
          {loading ? 'Processing...' : 'Sign & Broadcast Transaction'}
        </Text>
      </TouchableOpacity>

      {/* Helper message when wallet not available */}
      {!wallet && metakeepInitialized && (
        <View style={styles.helperContainer}>
          <Text style={styles.helperText}>
            Get wallet first to enable transaction operations
          </Text>
        </View>
      )}

      {/* Transaction success display - shown after successful broadcast */}
      {transactionHash && (
        <View style={styles.transactionInfo}>
          <Text style={styles.sectionSubtitle}>Transaction Successful!</Text>

          {/* Transaction hash display */}
          <View style={styles.hashContainer}>
            <Text style={styles.hashLabel}>Transaction Hash</Text>
            <Text style={styles.hashText} selectable numberOfLines={0}>
              {transactionHash}
            </Text>
          </View>

          {/* Etherscan link button */}
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => onOpenEtherscan(transactionHash)}>
            <Text style={styles.linkButtonText}>🔗 View on Etherscan</Text>
          </TouchableOpacity>

          {/* Helper note */}
          <Text style={styles.etherscanNote}>
            Track your transaction on Sepolia testnet
          </Text>
        </View>
      )}
    </Section>
  );
}

