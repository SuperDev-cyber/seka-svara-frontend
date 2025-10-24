# Wallet Integration for Seka Svara Card Game

This document describes the wallet integration implementation for the multiplayer Seka Svara card game with USDT betting support for both BEP20 (Binance Smart Chain) and TRC20 (Tron Network).

## Features Implemented

### 🔗 Wallet Connection
- **MetaMask Integration**: Connect to Binance Smart Chain (BEP20) network
- **TronLink Integration**: Connect to Tron Network (TRC20) network
- **Network Detection**: Automatic detection of installed wallets
- **Network Switching**: Automatic switching to correct network when connecting

### 💰 USDT Support
- **BEP20 USDT**: Support for USDT on Binance Smart Chain
- **TRC20 USDT**: Support for USDT on Tron Network
- **Balance Display**: Real-time USDT and native token balance display
- **Transaction Handling**: Secure USDT transfers for betting

### 🎮 Game Integration
- **Betting Controls**: Integrated betting interface with wallet connection
- **Real-time Balance**: Live balance updates during gameplay
- **Transaction Simulation**: Simulated transaction processing for testing
- **Smart Contract Ready**: Prepared for smart contract integration

## Architecture

### Components Structure
```
src/
├── contexts/
│   └── WalletContext.jsx          # Main wallet context provider
├── components/
│   └── wallet/
│       ├── WalletConnect.jsx      # Wallet connection component
│       ├── WalletConnect.css      # Wallet connection styles
│       ├── WalletBalance.jsx      # Balance display component
│       ├── WalletBalance.css      # Balance display styles
│       ├── BettingControls.jsx    # Betting interface component
│       └── BettingControls.css   # Betting interface styles
├── services/
│   └── smartContract.js           # Smart contract interaction service
└── Pages/
    └── GameTable/
        └── index.jsx              # Updated game table with wallet integration
```

### Network Configurations

#### BEP20 (Binance Smart Chain)
- **Chain ID**: 56 (0x38)
- **RPC URL**: https://bsc-dataseed.binance.org/
- **USDT Contract**: 0x55d398326f99059fF775485246999027B3197955
- **Wallet**: MetaMask

#### TRC20 (Tron Network)
- **Chain ID**: 728 (0x2b6653dc)
- **RPC URL**: https://api.trongrid.io
- **USDT Contract**: TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
- **Wallet**: TronLink

## Usage

### 1. Wallet Connection

The wallet connection is automatically available in the header and game table:

```jsx
import { useWallet } from './contexts/WalletContext';

const { 
  isConnected, 
  currentNetwork, 
  account, 
  usdtBalance, 
  connectMetaMask, 
  connectTronLink 
} = useWallet();
```

### 2. Game Integration

The game table now includes wallet-integrated betting controls:

```jsx
<BettingControls
  onBet={handleBet}
  onFold={handleFold}
  onCall={handleCall}
  onRaise={handleRaise}
  onAllIn={handleAllIn}
  currentBet={25}
  minBet={25}
  maxBet={1000}
  potSize={table.totalPot}
  isPlayerTurn={true}
  playerBalance={parseFloat(usdtBalance) || 0}
/>
```

### 3. Smart Contract Integration

The smart contract service is ready for integration:

```jsx
import SmartContractService from './services/smartContract';

const contractService = new SmartContractService(web3, 'BEP20');
await contractService.joinTable(tableId, betAmount, playerAddress);
```

## Dependencies

### Installed Packages
- `web3`: Ethereum/BSC interaction
- `tronweb`: Tron network interaction
- `@walletconnect/web3-provider`: WalletConnect v1 support
- `@walletconnect/modal`: WalletConnect modal
- `@walletconnect/qrcode-modal`: QR code modal

### Wallet Requirements
- **MetaMask**: For BEP20 (Binance Smart Chain) support
- **TronLink**: For TRC20 (Tron Network) support

## Security Features

### Transaction Security
- **Approval Pattern**: USDT transfers require explicit approval
- **Balance Validation**: Pre-transaction balance checks
- **Network Validation**: Automatic network switching
- **Error Handling**: Comprehensive error handling and user feedback

### Smart Contract Security
- **Escrow System**: Funds held in smart contract until game completion
- **Fair Play**: Transparent game logic on blockchain
- **Platform Fees**: Configurable fee system
- **Winner Determination**: Automated winner selection

## Testing

### Development Testing
1. Install MetaMask and TronLink browser extensions
2. Connect to testnet networks
3. Use test USDT tokens for betting
4. Test transaction flows and error handling

### Production Deployment
1. Deploy smart contracts to mainnet
2. Update contract addresses in configuration
3. Test with real USDT transactions
4. Implement comprehensive monitoring

## Future Enhancements

### Planned Features
- **Multi-wallet Support**: Support for additional wallets
- **Mobile Integration**: Mobile wallet support
- **Advanced Analytics**: Transaction history and analytics
- **Tournament Mode**: Multi-table tournament support
- **NFT Integration**: NFT rewards and achievements

### Smart Contract Features
- **Provably Fair**: Cryptographic game fairness
- **Automated Payouts**: Smart contract-based winner payouts
- **Tournament System**: Multi-round tournament support
- **Referral System**: Referral rewards and bonuses

## Troubleshooting

### Common Issues

#### MetaMask Connection Issues
- Ensure MetaMask is installed and unlocked
- Check if BSC network is added to MetaMask
- Verify account has sufficient BNB for gas fees

#### TronLink Connection Issues
- Ensure TronLink is installed and unlocked
- Check if TronLink is connected to Tron mainnet
- Verify account has sufficient TRX for energy/bandwidth

#### Transaction Failures
- Check USDT balance before transactions
- Ensure sufficient gas/energy for transactions
- Verify network connection and RPC endpoints

### Error Messages
- **"MetaMask not installed"**: Install MetaMask browser extension
- **"TronLink not installed"**: Install TronLink browser extension
- **"Insufficient balance"**: Add more USDT to wallet
- **"Network mismatch"**: Switch to correct network

## Support

For technical support or questions about the wallet integration:
- Check the browser console for detailed error messages
- Verify wallet extensions are properly installed
- Ensure you're connected to the correct network
- Check transaction status on blockchain explorers

## License

This wallet integration is part of the Seka Svara card game project and follows the same licensing terms as the main project.
