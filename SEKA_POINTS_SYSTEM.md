# SEKA Points System - Architecture Documentation

## Overview
All game activities use **SEKA Points** (virtual balance), NOT your actual wallet funds.

## How It Works

### 1. **Deposit Flow** 💰
```
User Wallet (USDT) → Smart Contract → SEKA Points (Virtual Balance)
```
- User deposits USDT from their wallet (MetaMask/TronLink)
- USDT goes to the Seka smart contract
- User receives equivalent SEKA points in their virtual balance
- **Actual wallet balance decreases** (one-time during deposit)

### 2. **Gameplay Flow** 🎮
```
SEKA Points (Virtual Balance) → Game Bets/Antes → Game Winnings → SEKA Points
```
- All bets, antes, and raises use SEKA points
- Winnings are credited as SEKA points
- **Actual wallet is NEVER touched during games**
- No gas fees during gameplay

### 3. **Withdrawal Flow** 💸
```
SEKA Points → Smart Contract → User Wallet (USDT)
```
- User requests withdrawal
- SEKA points are converted back to USDT
- USDT is sent from smart contract to user's wallet
- **Actual wallet balance increases** (one-time during withdrawal)

## Backend Implementation

### Virtual Balance (SEKA Points)
Located in: `backend/src/modules/wallet/wallet.service.ts`

```typescript
// When deposit is confirmed:
user.balance = Number(user.balance) + Number(transaction.amount);
// ✅ This is the virtual balance used for ALL game activities
```

### Game Betting
Located in: `backend/src/modules/game/services/betting.service.ts`

```typescript
// All bets use virtual balance:
const balance = await this.walletService.getBalance(player.userId);
await this.walletService.deductBalance(player.userId, amount, {...});
```

### Entry Fee Validation
Located in: `backend/src/modules/game/game.service.ts`

```typescript
// Validates virtual balance before joining:
const balance = await this.walletService.getBalance(playerId);
if (balance < requiredBalance) {
  throw new BadRequestException('Insufficient balance');
}
```

## Frontend Display

### Balance Types Displayed

1. **Wallet Balance** (in header)
   - Shows: USDT, BNB, or TRX from actual wallet
   - Used: Only for deposits
   - Location: `MY WALLET` button

2. **SEKA Balance** (in header)
   - Shows: SEKA points from smart contract
   - Used: For ALL game activities
   - Location: Next to wallet balance
   - Format: `Seka: X.XX`

3. **Virtual Balance** (in user menu)
   - Shows: Same as SEKA balance
   - Stored: In database (synced with smart contract)
   - Location: User dropdown menu
   - Format: `Balance: $X.XX`

## Key Points ✨

### ✅ What USES SEKA Points:
- Creating game tables (entry fee)
- Placing bets during games
- Raising bets
- Going all-in
- Winning pots
- Game rewards

### ❌ What DOES NOT Touch Your Wallet:
- Betting during games
- Losing a hand
- Game antes
- Any in-game transaction

### 💡 When Your Wallet IS Used:
- Depositing USDT (adds SEKA points)
- Withdrawing USDT (removes SEKA points)
- Gas fees for deposits/withdrawals (small amount of BNB/TRX)

## Security Benefits

1. **No Gas Fees During Games** - Only virtual balance updates, no blockchain transactions
2. **Faster Gameplay** - No waiting for blockchain confirmations
3. **Protected Funds** - Main wallet funds safe from game bugs
4. **Controlled Risk** - Only deposited amount is at risk

## User Experience Flow

```
1. User connects wallet → Shows actual USDT/BNB/TRX balance
2. User deposits USDT → Wallet balance ↓, SEKA balance ↑
3. User plays games → SEKA balance changes, wallet unchanged
4. User wins/loses → SEKA balance ↑/↓, wallet unchanged
5. User withdraws → SEKA balance ↓, wallet balance ↑
```

## Technical Stack

### Smart Contract (Blockchain Layer)
- **Purpose**: Hold deposited USDT and track SEKA balances
- **Network**: Base Sepolia Testnet (BEP20)
- **Contract**: `0x01BdF4098a5CD6539B8A91DB96EaF3418ed02707`
- **Functions**:
  - `deposit(amount)` - Convert USDT to SEKA
  - `getUserBalance(address)` - Get SEKA balance
  - `withdraw(amount)` - Convert SEKA back to USDT

### Backend (Database Layer)
- **Purpose**: Track virtual balance for fast game operations
- **Storage**: PostgreSQL database
- **Sync**: Periodically synced with smart contract
- **Tables**:
  - `users.balance` - Virtual SEKA balance
  - `wallets.balance` - Mirrored for redundancy
  - `wallet_transactions` - All deposit/withdrawal history

### Frontend (Display Layer)
- **Purpose**: Show both wallet and SEKA balances
- **Context**: `WalletContext` - Actual wallet balances
- **Context**: `AuthContext` - Virtual SEKA balance
- **Update**: Real-time on deposits, withdrawals, and game results

## FAQ

**Q: Why do I see two different balances?**
A: One is your actual wallet (USDT), the other is your SEKA points (for games).

**Q: Can I play games with just my wallet balance?**
A: No, you must deposit USDT to get SEKA points first.

**Q: Do I pay gas fees for every bet?**
A: No! Only when depositing or withdrawing. Games use virtual balance.

**Q: What happens if I lose all my SEKA points?**
A: Your wallet funds are safe. Just deposit more USDT to get more SEKA points.

**Q: Can I withdraw my SEKA points anytime?**
A: Yes (not implemented yet), unless they're locked in an active game.

---

**Last Updated**: 2025-10-23
**Version**: 1.0

