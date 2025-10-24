# Withdrawal System with Wagering Requirements

## Overview
Implemented a complete withdrawal system that enforces a 1.3x wagering requirement before users can withdraw their SEKA Points.

## Features Implemented

### 1. **Wagering Requirement Formula** ✅
```
Max Withdrawable Amount = Total Wagered ÷ 1.3
```

**Example from requirements:**
- Total Deposited: 10 USDT
- Game 1: Wagered 5 USDT → Won 25 USDT
- Game 2: Wagered 20 USDT → Won 100 USDT  
- Game 3: Wagered 10 USDT → Won 100 USDT
- Game 4: Wagered 50 USDT → Won 1000 USDT
- **Total Wagered: 85 USDT**
- **Max Withdrawal: 85 ÷ 1.3 ≈ 65.38 USDT**

### 2. **WithdrawModal Component** ✅
**File**: `src/components/profile/WithdrawModal/index.jsx`

**Features:**
- ✅ Displays connected wallet address (from deposit)
- ✅ Shows wagering statistics:
  - Total Wagered
  - Max Withdrawable Amount
  - Current SEKA Balance
- ✅ Calculates withdrawal limits automatically
- ✅ Validates amount against wagering requirements
- ✅ Prevents over-withdrawal
- ✅ Real-time balance fetching from smart contract
- ✅ Network selection (BEP20/TRC20)
- ✅ "MAX" button auto-fills maximum allowed amount
- ✅ Clear error messages

### 3. **UI Components**

#### Wallet Address Display
```
📍 Withdrawal Address:
┌─────────────────────────────────────┐
│ 0x1234...5678 (Connected Wallet)    │
└─────────────────────────────────────┘
USDT will be sent to your connected wallet address
```

#### Wagering Requirements Panel
```
📊 Wagering Requirements
┌─────────────────────────────────────┐
│ Total Wagered:      85.00 SEKA      │
│ Max Withdrawable:   65.38 SEKA      │
│ Current Balance:   1000.01 SEKA     │
│                                     │
│ 💡 Formula: Max = Wagered ÷ 1.3    │
└─────────────────────────────────────┘
```

## API Integration

### Frontend Calls
```javascript
// Fetch wagering stats
GET /wallet/wagering-stats
Response: {
  totalWagered: 85.00,
  totalDeposited: 10.00
}

// Process withdrawal
POST /wallet/withdraw
Body: {
  network: 'BEP20',
  amount: 65.38,
  toAddress: '0x...'
}
```

### Validation Logic
```javascript
// 1. Check if amount > 0
if (withdrawAmount <= 0) {
  error: "Please enter a valid amount"
}

// 2. Check if user has sufficient SEKA balance
if (withdrawAmount > sekaBalance) {
  error: "Insufficient SEKA balance"
}

// 3. Check wagering requirement
const maxWithdrawable = totalWagered / 1.3;
if (withdrawAmount > maxWithdrawable) {
  error: "Maximum withdrawable is XX SEKA (wagered YY ÷ 1.3)"
}

// 4. Check if wallet is connected
if (!account) {
  error: "Please connect your wallet first"
}
```

## User Flow

```
1. User clicks "Withdraw" button on profile page
   ↓
2. Modal opens showing:
   - Connected wallet address
   - Wagering stats
   - Max withdrawable amount
   ↓
3. User enters amount or clicks "MAX"
   ↓
4. System validates:
   ✓ Amount > 0
   ✓ Amount ≤ SEKA balance
   ✓ Amount ≤ (Total Wagered ÷ 1.3)
   ✓ Wallet connected
   ↓
5. Click "Confirm Withdrawal"
   ↓
6. Backend processes withdrawal
   ↓
7. SEKA Points converted to USDT
   ↓
8. USDT sent to connected wallet address
   ↓
9. Success message + modal closes after 3 seconds
```

## Backend Requirements (To Be Implemented)

### 1. Track Total Wagered
Add to User entity:
```typescript
@Column({ type: 'decimal', precision: 18, scale: 8, default: 0 })
totalWagered: number;
```

Update every time a player bets:
```typescript
// In betting.service.ts
await this.userRepository.increment(
  { id: player.userId },
  'totalWagered',
  amount
);
```

### 2. Wagering Stats API Endpoint
```typescript
// GET /wallet/wagering-stats
async getWageringStats(userId: string) {
  const user = await this.usersRepository.findOne({ where: { id: userId } });
  
  const totalDeposited = await this.transactionsRepository
    .createQueryBuilder('txn')
    .where('txn.userId = :userId', { userId })
    .andWhere('txn.type = :type', { type: 'DEPOSIT' })
    .select('SUM(txn.amount)', 'sum')
    .getRawOne();

  return {
    totalWagered: user.totalWagered || 0,
    totalDeposited: parseFloat(totalDeposited.sum || 0)
  };
}
```

### 3. Withdrawal Processing
```typescript
// POST /wallet/withdraw
async processWithdrawal(userId: string, data: WithdrawDto) {
  const user = await this.usersRepository.findOne({ where: { id: userId } });
  
  // Calculate max withdrawable
  const maxWithdrawable = user.totalWagered / 1.3;
  
  // Validate amount
  if (data.amount > maxWithdrawable) {
    throw new BadRequestException(
      `Maximum withdrawable amount is ${maxWithdrawable.toFixed(2)} SEKA`
    );
  }
  
  if (data.amount > user.balance) {
    throw new BadRequestException('Insufficient SEKA balance');
  }
  
  // Deduct from user balance
  user.balance -= data.amount;
  await this.usersRepository.save(user);
  
  // Call smart contract to transfer USDT
  await this.blockchainService.withdraw(data.toAddress, data.amount, data.network);
  
  // Create withdrawal transaction record
  await this.transactionsRepository.save({
    userId,
    type: 'WITHDRAWAL',
    amount: data.amount,
    network: data.network,
    toAddress: data.toAddress,
    status: 'PENDING'
  });
  
  return { success: true, amount: data.amount };
}
```

## Security Features

1. **Wagering Requirement**: Prevents money laundering by requiring users to wager 1.3x before withdrawal
2. **Wallet Address Verification**: Only withdraws to connected wallet (deposit address)
3. **Balance Validation**: Cannot withdraw more than SEKA balance
4. **Real-time Calculations**: Max withdrawal recalculated on every modal open
5. **Transaction Logging**: All withdrawals tracked in database

## Testing Scenarios

### Scenario 1: Successful Withdrawal
```
User balance: 1000 SEKA
Total wagered: 1300 SEKA
Max withdrawal: 1300 ÷ 1.3 = 1000 SEKA
✅ Can withdraw full 1000 SEKA
```

### Scenario 2: Insufficient Wagering
```
User balance: 1000 SEKA
Total wagered: 100 SEKA
Max withdrawal: 100 ÷ 1.3 = 76.92 SEKA
❌ Cannot withdraw 1000 SEKA
✅ Can only withdraw up to 76.92 SEKA
```

### Scenario 3: High Wagering
```
User balance: 100 SEKA
Total wagered: 5000 SEKA
Max withdrawal: 5000 ÷ 1.3 = 3846.15 SEKA
✅ Can withdraw full 100 SEKA (limited by balance)
```

## UI States

### Loading State
- Displays "Loading stats..." while fetching data

### Connected State
- Shows wallet address
- Shows wagering stats
- Enables withdrawal

### Not Connected State
- Shows "Not Connected" instead of address
- Disables withdrawal
- Error: "Please connect your wallet first"

### Processing State
- Disables all inputs
- Shows "⏳ Processing..." on button
- Cannot close modal

### Success State
- Shows success message with amount and address
- Auto-closes after 3 seconds
- Green success styling

### Error State
- Shows red error message
- Keeps modal open
- Re-enables inputs

## Files Modified

1. ✅ `src/components/profile/WithdrawModal/index.jsx` - Complete rewrite
2. ✅ `src/components/profile/BalanceCard/index.jsx` - Already has withdraw button
3. ✅ Uses existing `WalletContext` for balance and wallet info
4. ✅ Uses existing `AuthContext` for user data
5. ✅ Uses existing `apiService` for backend calls

## Backend TODO

- [ ] Add `totalWagered` field to User entity
- [ ] Track wagering in betting service
- [ ] Create `/wallet/wagering-stats` endpoint
- [ ] Update `/wallet/withdraw` endpoint with wagering validation
- [ ] Integrate with smart contract `withdraw()` function
- [ ] Add transaction logging

---

**Date Implemented**: October 23, 2025
**Status**: ✅ Frontend Complete - Backend Integration Needed
**Formula**: Max Withdrawal = Total Wagered ÷ 1.3

