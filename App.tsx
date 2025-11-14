/**
 * MetaKeep Demo App - React Native Integration
 * Demonstrates wallet creation and transaction signing with MetaKeep SDK
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  useColorScheme,
  View,
  Alert,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import MetaKeep from 'metakeep-react-native-sdk';

// Configuration & Types
import {CONFIG} from './src/config/config';
import {WalletData, MetaKeepSDK} from './src/types/types';

// Utilities
import {extractEmailFromWallet, openEtherscan} from './src/utils/helpers';
import {
  getCurrentNonce,
  createTransactionParams,
  signTransaction,
  broadcastTransaction,
} from './src/utils/web3Utils';

// Components
import {
  StatusSection,
  WalletSection,
  TransactionSection,
} from './src/components';

// Styles
import {styles} from './src/styles/styles';

/**
 * Main App Component - MetaKeep Integration Demo
 */
function App(): React.JSX.Element {
  // ========== STATE MANAGEMENT ==========
  const isDarkMode = useColorScheme() === 'dark';
  const [metakeepInitialized, setMetakeepInitialized] = useState(false);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [metakeep, setMetakeep] = useState<MetaKeepSDK | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  // Background style based on theme
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // ========== INITIALIZATION ==========
  /**
   * Initialize MetaKeep SDK on component mount
   */
  useEffect(() => {
    try {
      const sdk = new MetaKeep(CONFIG.METAKEEP_APP_ID) as MetaKeepSDK;
      setMetakeep(sdk);
      setMetakeepInitialized(true);
      console.log('MetaKeep SDK initialized successfully');
    } catch (error) {
      console.error('Failed to initialize MetaKeep SDK:', error);
      Alert.alert('MetaKeep SDK Error', 'Failed to initialize MetaKeep SDK');
    }
  }, []);

  // ========== WALLET OPERATIONS ==========
  /**
   * Retrieves wallet information from MetaKeep SDK
   */
  const handleGetWallet = async () => {
    if (!metakeep) {
      Alert.alert('Error', 'MetaKeep SDK not initialized');
      return;
    }

    try {
      setLoading(true);

      const walletData = await metakeep.getWallet();
      const extractedEmail = extractEmailFromWallet(walletData);

      setUserEmail(extractedEmail);
      setWallet(walletData);

      console.log('Wallet retrieved successfully');
    } catch (error) {
      console.error('Failed to get wallet:', error);
      Alert.alert('Error', `Failed to get wallet: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // ========== TRANSACTION OPERATIONS ==========
  /**
   * Signs and broadcasts a transaction to the Sepolia network
   */
  const handleSignAndBroadcast = async () => {
    if (!metakeep) {
      Alert.alert('Error', 'MetaKeep SDK not initialized');
      return;
    }

    if (!wallet?.wallet?.ethAddress) {
      Alert.alert('Error', 'Please get wallet first to obtain ETH address');
      return;
    }

    try {
      setLoading(true);

      // Set user email (optional)
      if (userEmail) {
        try {
          await metakeep.setUser({email: userEmail});
          console.log('User email set successfully');
        } catch (userError) {
          console.error('Failed to set user (non-critical):', userError);
        }
      }

      // Step 1: Get current nonce
      const currentNonce = await getCurrentNonce(
        wallet.wallet.ethAddress,
        CONFIG.RPC_URL,
      );
      console.log('Retrieved nonce:', currentNonce);

      // Step 2: Create transaction parameters
      const txParams = createTransactionParams(currentNonce);
      console.log('Transaction parameters created');

      // Step 3: Sign transaction
      const signedTx = await signTransaction(metakeep, txParams);
      console.log('Transaction signed successfully');

      // Step 4: Broadcast transaction
      const txHash = await broadcastTransaction(signedTx, CONFIG.RPC_URL);
      console.log('Transaction broadcasted:', txHash);

      setTransactionHash(txHash);

      // Show success alert
      Alert.alert(
        'Transaction Successful!',
        `Transaction has been broadcasted to Sepolia network.\n\nHash: ${txHash}`,
        [
          {
            text: 'View on Etherscan',
            onPress: () => openEtherscan(txHash),
          },
          {
            text: 'OK',
          },
        ],
      );
    } catch (error) {
      console.error('Failed to sign/broadcast transaction:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert('Error', `Failed to process transaction: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // ========== RENDER ==========
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 32}}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>MetaKeep Demo</Text>
            <Text style={styles.headerSubtitle}>React Native Integration</Text>
          </View>

          {/* SDK Status Section */}
          <StatusSection metakeepInitialized={metakeepInitialized} />

          {/* Wallet Operations Section */}
          <WalletSection
            loading={loading}
            metakeepInitialized={metakeepInitialized}
            wallet={wallet}
            userEmail={userEmail}
            onGetWallet={handleGetWallet}
          />

          {/* Transaction Operations Section */}
          <TransactionSection
            loading={loading}
            metakeepInitialized={metakeepInitialized}
            wallet={wallet}
            transactionHash={transactionHash}
            onSignAndBroadcast={handleSignAndBroadcast}
            onOpenEtherscan={openEtherscan}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
