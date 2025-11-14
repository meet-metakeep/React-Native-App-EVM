/**
 * TypeScript declarations for react-native-config
 * Provides type safety for environment variables
 */

declare module 'react-native-config' {
  export interface NativeConfig {
    METAKEEP_APP_ID?: string;
    RPC_URL?: string;
    CHAIN_ID?: string;
    ETHERSCAN_URL?: string;
    RECIPIENT_ADDRESS?: string;
    TX_VALUE?: string;
    TX_DATA?: string;
    TX_GAS_LIMIT?: string;
    TX_MAX_FEE_PER_GAS?: string;
    TX_MAX_PRIORITY_FEE_PER_GAS?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}

