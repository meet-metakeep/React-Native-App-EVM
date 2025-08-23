/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import MetaKeep from 'metakeep-react-native-sdk';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [metakeepInitialized, setMetakeepInitialized] = useState(false);
  const [wallet, setWallet] = useState<any>(null);
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [metakeep, setMetakeep] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    try {
      // Initialize MetaKeep SDK with your app ID from console.metakeep.xyz
      const sdk = new MetaKeep('YOUR_APP_ID_HERE');
      setMetakeep(sdk);
      setMetakeepInitialized(true);
      console.log('MetaKeep SDK initialized successfully');
    } catch (error) {
      console.error('Failed to initialize MetaKeep SDK:', error);
      Alert.alert('MetaKeep SDK Error', 'Failed to initialize MetaKeep SDK');
    }
  }, []);

  const getWallet = async () => {
    if (!metakeep) {
      Alert.alert('Error', 'MetaKeep SDK not initialized');
      return;
    }
    try {
      setLoading(true);
      const walletData = await metakeep.getWallet();

      // Extract user email from wallet response
      let extractedEmail = '';
      if (walletData.wallet?.email) {
        extractedEmail = walletData.wallet.email;
      } else if (walletData.email) {
        extractedEmail = walletData.email;
      } else if (walletData.user?.email) {
        extractedEmail = walletData.user.email;
      } else if (walletData.userInfo?.email) {
        extractedEmail = walletData.userInfo.email;
      }

      // Use default email if none found
      if (!extractedEmail) {
        extractedEmail = 'meet@metakeep.xyz';
      }

      setUserEmail(extractedEmail);
      setWallet(walletData);
    } catch (error) {
      console.error('Failed to get wallet:', error);
      Alert.alert('Error', `Failed to get wallet: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const signAndBroadcastTransaction = async () => {
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

      // Set user for MetaKeep SDK
      try {
        await metakeep.setUser({
          email: userEmail,
        });
      } catch (userError: any) {
        console.warn(
          'Failed to set user, continuing anyway:',
          userError.message,
        );
      }

      // Get current nonce
      const nonceResponse = await fetch('https://rpc.sepolia.org', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getTransactionCount',
          params: [wallet.wallet.ethAddress, 'latest'],
          id: 1,
        }),
      });

      if (!nonceResponse.ok) {
        throw new Error(`Network error: ${nonceResponse.status}`);
      }

      const nonceResult = await nonceResponse.json();
      if (!nonceResult.result) {
        throw new Error('Failed to get nonce from network');
      }

      const currentNonce = parseInt(nonceResult.result, 16);

      // Sign transaction
      const transactionParams = {
        type: 2,
        to: '0x97706df14a769e28ec897dac5ba7bcfa5aa9c444',
        value: '0x2710',
        nonce: `0x${currentNonce.toString(16)}`,
        data: '0x0123456789',
        chainId: '0xaa36a7',
        gas: '0x186A0',
        maxFeePerGas: '0x59682F00',
        maxPriorityFeePerGas: '0x59682F00',
      };

      let signedTx: any;
      try {
        signedTx = await metakeep.signTransaction(
          transactionParams,
          'MetaKeep Demo Transaction',
        );
      } catch (signError: any) {
        // Try fallback transaction format
        const fallbackParams = {
          type: 2,
          to: '0x97706df14a769e28ec897dac5ba7bcfa5aa9c444',
          value: '0x2710',
          nonce: `0x${currentNonce.toString(16)}`,
          data: '0x0123456789',
          chainId: '0xaa36a7',
          gas: '0x186A0',
          maxFeePerGas: '0x59682F00',
          maxPriorityFeePerGas: '0x59682F00',
        };

        signedTx = await metakeep.signTransaction(
          fallbackParams,
          'MetaKeep Demo Transaction',
        );
      }

      // Broadcast transaction
      const response = await fetch('https://rpc.sepolia.org', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_sendRawTransaction',
          params: [
            signedTx.rawTransaction ||
              signedTx.signedTransaction ||
              signedTx.signedRawTransaction,
          ],
          id: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
      }

      const result = await response.json();
      if (result.result) {
        setTransactionHash(result.result);

        Alert.alert(
          'Transaction Successful! 🎉',
          `Transaction has been broadcasted to Sepolia network.\n\nHash: ${result.result}`,
          [
            {
              text: 'View on Etherscan',
              onPress: async () => {
                const etherscanUrl = `https://sepolia.etherscan.io/tx/${result.result}`;
                try {
                  await Linking.openURL(etherscanUrl);
                } catch (error) {
                  Alert.alert('Error', 'Failed to open Etherscan link');
                }
              },
            },
            {
              text: 'OK',
            },
          ],
        );
      } else if (result.error) {
        const errorMessage =
          result.error.message || 'Failed to broadcast transaction';
        throw new Error(errorMessage);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Failed to sign/broadcast transaction:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert('Error', `Failed to process transaction: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            paddingBottom: 40,
          }}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>MetaKeep Demo</Text>
            <Text style={styles.headerSubtitle}>React Native Integration</Text>
          </View>

          {/* MetaKeep SDK Status */}
          <Section title="MetaKeep SDK Status">
            <View style={styles.statusContainer}>
              <View style={styles.statusIndicator}>
                <Text style={styles.statusText}>
                  {metakeepInitialized ? '✓ Initialized' : '⏳ Initializing...'}
                </Text>
              </View>
              <Text style={styles.appIdText}>
                App ID:{' '}
                {metakeepInitialized ? 'YOUR_APP_ID_HERE' : 'Loading...'}
              </Text>
            </View>
          </Section>

          {/* Wallet Operations */}
          <Section title="Wallet Operations">
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={getWallet}
              disabled={loading || !metakeepInitialized}>
              <Text style={styles.primaryButtonText}>
                {loading ? '⏳ Loading...' : '🔑 Get Wallet'}
              </Text>
            </TouchableOpacity>

            {wallet && (
              <View style={styles.walletInfo}>
                <Text style={styles.sectionSubtitle}>
                  Wallet Retrieved Successfully
                </Text>
                {userEmail && (
                  <View style={styles.emailContainer}>
                    <Text style={styles.emailLabel}>User Email:</Text>
                    <Text style={styles.emailText}>{userEmail}</Text>
                  </View>
                )}
                <View style={styles.addressContainer}>
                  <Text style={styles.addressLabel}>ETH Address:</Text>
                  <Text style={styles.addressText}>
                    {wallet.wallet?.ethAddress || 'N/A'}
                  </Text>
                </View>
                <View style={styles.addressContainer}>
                  <Text style={styles.addressLabel}>SOL Address:</Text>
                  <Text style={styles.addressText}>
                    {wallet.wallet?.solAddress || 'N/A'}
                  </Text>
                </View>
                <View style={styles.addressContainer}>
                  <Text style={styles.addressLabel}>EOS Address:</Text>
                  <Text style={styles.addressText}>
                    {wallet.wallet?.eosAddress || 'N/A'}
                  </Text>
                </View>
              </View>
            )}
          </Section>

          {/* Transaction Operations */}
          <Section title="Transaction Operations">
            <TouchableOpacity
              style={[
                styles.primaryButton,
                (loading || !metakeepInitialized || !wallet) &&
                  styles.buttonDisabled,
              ]}
              onPress={signAndBroadcastTransaction}
              disabled={loading || !metakeepInitialized || !wallet}>
              <Text style={styles.primaryButtonText}>
                {loading
                  ? '⏳ Processing...'
                  : '📝 Sign & Broadcast Transaction'}
              </Text>
            </TouchableOpacity>

            {!wallet && metakeepInitialized && (
              <View style={styles.helperContainer}>
                <Text style={styles.helperText}>
                  ⚠️ Get wallet first to enable transaction operations
                </Text>
              </View>
            )}

            {transactionHash && (
              <View style={styles.transactionInfo}>
                <Text style={styles.sectionSubtitle}>
                  Transaction Successful! 🎉
                </Text>
                <View style={styles.hashContainer}>
                  <Text style={styles.hashLabel}>Transaction Hash:</Text>
                  <Text style={styles.hashText}>{transactionHash}</Text>
                </View>
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={async () => {
                    const etherscanUrl = `https://sepolia.etherscan.io/tx/${transactionHash}`;
                    console.log('Opening Etherscan URL:', etherscanUrl);
                    try {
                      await Linking.openURL(etherscanUrl);
                    } catch (error) {
                      console.error('Failed to open URL:', error);
                      Alert.alert('Error', 'Failed to open Etherscan link');
                    }
                  }}>
                  <Text style={styles.linkButtonText}>
                    🔗 View on Etherscan
                  </Text>
                </TouchableOpacity>
                <Text style={styles.etherscanNote}>
                  Track your transaction on Sepolia testnet
                </Text>
              </View>
            )}
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: '#666',
  },
  highlight: {
    fontWeight: '700',
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  walletInfo: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  walletAddress: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'monospace',
    color: '#333',
    flexWrap: 'wrap',
  },
  transactionInfo: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#d4edda',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  linkButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  linkButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  etherscanNote: {
    marginTop: 8,
    fontSize: 14,
    color: '#155724',
    textAlign: 'center',
  },
  helperText: {
    marginTop: 8,
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
  },
  headerSection: {
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  statusIndicator: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#4CAF50',
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  appIdText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    marginTop: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  emailLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginRight: 8,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
  },
  addressContainer: {
    marginTop: 8,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
    fontFamily: 'monospace',
  },
  helperContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    alignItems: 'center',
  },
  hashContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  hashLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginRight: 8,
  },
  hashText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
    fontFamily: 'monospace',
  },
});

export default App;
