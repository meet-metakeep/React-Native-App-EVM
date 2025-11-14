/**
 * Wallet Section Component
 * Handles wallet operations and displays wallet information
 */

import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Section} from './Section';
import {WalletSectionProps} from '../types/types';
import {styles} from '../styles/styles';

export function WalletSection({
  loading,
  metakeepInitialized,
  wallet,
  userEmail,
  onGetWallet,
}: WalletSectionProps): React.JSX.Element {
  return (
    <Section title="Wallet Operations">
      {/* Get Wallet button - disabled during loading or if SDK not ready */}
      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.buttonDisabled]}
        onPress={onGetWallet}
        disabled={loading || !metakeepInitialized}>
        <Text style={styles.primaryButtonText}>
          {loading ? 'Loading...' : 'Get Wallet'}
        </Text>
      </TouchableOpacity>

      {/* Wallet information display - shown after successful retrieval */}
      {wallet && (
        <View style={styles.walletInfo}>
          <Text style={styles.sectionSubtitle}>
            Wallet Retrieved Successfully
          </Text>

          {/* User email display */}
          {userEmail && (
            <View style={styles.emailContainer}>
              <Text style={styles.emailLabel}>User Email</Text>
              <Text style={styles.emailText} selectable>
                {userEmail}
              </Text>
            </View>
          )}

          {/* Ethereum address */}
          <View style={styles.addressContainer}>
            <Text style={styles.addressLabel}>ETH Address</Text>
            <Text style={styles.addressText} selectable numberOfLines={0}>
              {wallet.wallet?.ethAddress || 'N/A'}
            </Text>
          </View>

          {/* Solana address */}
          <View style={styles.addressContainer}>
            <Text style={styles.addressLabel}>SOL Address</Text>
            <Text style={styles.addressText} selectable numberOfLines={0}>
              {wallet.wallet?.solAddress || 'N/A'}
            </Text>
          </View>

          {/* EOS address */}
          <View style={styles.addressContainer}>
            <Text style={styles.addressLabel}>EOS Address</Text>
            <Text style={styles.addressText} selectable numberOfLines={0}>
              {wallet.wallet?.eosAddress || 'N/A'}
            </Text>
          </View>
        </View>
      )}
    </Section>
  );
}

