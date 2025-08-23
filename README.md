# MetaKeep Demo App

React Native demo application on android that demonstrates the integration of the MetaKeep SDK.

## Configuration Required

**Before running this app, you must configure your own MetaKeep credentials:**

1. **Get your App ID**: Visit [console.metakeep.xyz](https://console.metakeep.xyz) to create an account and get your App ID
2. **Update the code**: Replace `YOUR_APP_ID_HERE` in `App.tsx` with your actual App ID
3. **RPC URL**: The app uses `https://rpc.sepolia.org` for Sepolia testnet (already configured)

## Setup

### Prerequisites
- React Native 0.73.0
- Android API level 34 (Android 14) or higher
- Java 8 or higher
- Node.js 18 or higher


### Android Configuration

The following Android configurations have been applied:

1. **Minimum SDK Version**: Set to 34 in `android/build.gradle`
2. **Manifest Placeholders**: Configured in `android/app/build.gradle`
3. **Intent Filter**: Added to `android/app/src/main/AndroidManifest.xml` for MetaKeep callbacks
4. **Repositories**: Added JitPack repository for MetaKeep SDK dependencies

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. For Android:
   ```bash
   npx react-native run-android
   ```

## Features

- MetaKeep SDK initialization with the provided app ID
- Status display showing SDK initialization status
- Proper Android configuration for MetaKeep integration

## Project Structure

```
MetaKeepDemo/
├── android/                 # Android-specific configuration
├── ios/                    # iOS-specific configuration
├── modules/                # Local modules
│   └── MetaKeepReactNativeSDK/  # MetaKeep SDK
├── App.tsx                 # Main application component
└── package.json            # Dependencies and scripts
```

## MetaKeep SDK Usage

The SDK is initialized in `App.tsx` with the following code:

```typescript
import MetaKeep from 'metakeep-react-native-sdk';

useEffect(() => {
  try {
    // Replace 'YOUR_APP_ID_HERE' with your actual App ID from console.metakeep.xyz
    const metakeep = new MetaKeep('YOUR_APP_ID_HERE');
    setMetakeepInitialized(true);
  } catch (error) {
    console.error('Failed to initialize MetaKeep SDK:', error);
  }
}, []);
```

**Configuration Steps:**
1. Sign up at [console.metakeep.xyz](https://console.metakeep.xyz)
2. Create a new app to get your App ID
3. Replace `YOUR_APP_ID_HERE` in the code above with your actual App ID
4. The app will automatically use `https://rpc.sepolia.org` for Sepolia testnet

## Troubleshooting

If you encounter build issues:

1. Clean the project:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

2. Reset Metro cache:
   ```bash
   npx react-native start --reset-cache
   ```

3. Ensure all Android SDK components are installed for API level 34

## License

This project is for demonstration purposes only.
