/**
 * Application Styles
 * Centralized StyleSheet for all UI components
 */

import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  // Section layout styles
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '400',
    color: '#666',
  },
  sectionSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    flexWrap: 'wrap',
  },

  // Header styles
  headerSection: {
    paddingTop: 32,
    paddingBottom: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },

  // Status indicator styles
  statusContainer: {
    marginTop: 12,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  appIdText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    flexWrap: 'wrap',
  },

  // Button styles
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  linkButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 10,
    alignItems: 'center',
  },
  linkButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  // Wallet info styles
  walletInfo: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    maxWidth: '100%',
  },
  emailContainer: {
    marginTop: 6,
    marginBottom: 6,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  emailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  emailText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#333',
    lineHeight: 18,
  },
  addressContainer: {
    marginTop: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  addressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  addressText: {
    fontSize: 11,
    fontWeight: '400',
    color: '#333',
    fontFamily: 'monospace',
    lineHeight: 16,
    flexWrap: 'wrap',
  },

  // Transaction info styles
  transactionInfo: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#d4edda',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c3e6cb',
    maxWidth: '100%',
  },
  hashContainer: {
    marginTop: 8,
  },
  hashLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#155724',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  hashText: {
    fontSize: 11,
    fontWeight: '400',
    color: '#155724',
    fontFamily: 'monospace',
    lineHeight: 16,
    flexWrap: 'wrap',
  },
  etherscanNote: {
    marginTop: 6,
    fontSize: 12,
    color: '#155724',
    textAlign: 'center',
    lineHeight: 16,
    flexWrap: 'wrap',
  },

  // Helper message styles
  helperContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    alignItems: 'center',
  },
  helperText: {
    marginTop: 4,
    fontSize: 13,
    color: '#856404',
    textAlign: 'center',
    lineHeight: 18,
  },
});

