# Using the Deposit Function

## Fixed Issue

**Problem**: VoidSigner error when calling `deposit()`  
**Cause**: Trying to use `contract.connect(account)` where `account` is a string, not a signer  
**Solution**: Get proper signer from MetaMask using `ethers.providers.Web3Provider`

---

## How It Works Now

The `sendUsdt()` function now:

1. **Gets signer from MetaMask** (not just the address)
2. **Approves USDT** for the Seka contract
3. **Calls deposit** on the Seka contract
4. **Waits for confirmations**

### Code Flow

```javascript
const { sendUsdt } = useWallet();

// This will:
// 1. Get signer from MetaMask
// 2. Approve USDT for Seka contract
// 3. Call sekaContract.deposit(amount)
// 4. Wait for transaction to be mined
await sendUsdt(adminAddress, 10, 'BEP20'); // Deposit 10 USDT
```

---

## Implementation Details

### Getting the Signer

```javascript
// ❌ WRONG - This creates a VoidSigner
const signer = account; // account is just a string
const tx = await contract.connect(account).deposit(amount); // ERROR!

// ✅ CORRECT - Get real signer from MetaMask
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const tx = await contract.connect(signer).deposit(amount); // Works!
```

### Full Flow in WalletContext

```javascript
const sendUsdt = async (to, amount, network) => {
  if (network === 'BEP20') {
    // Step 1: Get signer from MetaMask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    // Step 2: Convert amount (USDT has 6 decimals)
    const amountWithDecimals = ethers.utils.parseUnits(amount.toString(), 6);
    
    // Step 3: Approve USDT for Seka contract
    const usdtWithSigner = usdtContract.connect(signer);
    const approveTx = await usdtWithSigner.approve(sekaContractAddress, amountWithDecimals);
    await approveTx.wait(); // Wait for approval
    
    // Step 4: Deposit to Seka contract
    const sekaWithSigner = sekaContract.connect(signer);
    const tx = await sekaWithSigner.deposit(amountWithDecimals);
    await tx.wait(); // Wait for deposit
    
    return tx;
  }
};
```

---

## Usage in Components

### DepositModal.jsx

```javascript
import { useWallet } from '../../contexts/WalletContext';

const DepositModal = () => {
  const { sendUsdt, isConnected, currentNetwork } = useWallet();
  
  const handleDeposit = async () => {
    try {
      // This will approve + deposit in one call
      const tx = await sendUsdt(adminAddress, amount, 'BEP20');
      
      console.log('Transaction hash:', tx.hash);
      console.log('Block number:', tx.blockNumber);
      
      alert('Deposit successful!');
    } catch (error) {
      console.error('Deposit failed:', error);
      alert(`Error: ${error.message}`);
    }
  };
  
  return (
    <button onClick={handleDeposit} disabled={!isConnected}>
      Deposit {amount} USDT
    </button>
  );
};
```

---

## Other Available Functions

All these functions now use the signer properly:

### 1. Approve USDT for Seka Contract

```javascript
const { approveGameEscrow } = useWallet();

await approveGameEscrow(100); // Approve 100 USDT
```

### 2. Check Current Allowance

```javascript
const { checkGameEscrowAllowance } = useWallet();

const allowance = await checkGameEscrowAllowance();
console.log(`Approved: ${allowance} USDT`);
```

### 3. Create Game Room

```javascript
const { createGameRoom } = useWallet();

await createGameRoom(
  'room-123',  // roomId
  10,          // entryFee (USDT)
  4,           // maxPlayers
  0,           // roomType (0=PUBLIC, 1=PRIVATE, 2=TOURNAMENT)
  []           // invitedPlayers
);
```

### 4. Join Game Room

```javascript
const { joinGameRoom } = useWallet();

await joinGameRoom('room-123');
```

### 5. Deposit to Game Room

```javascript
const { depositToGameRoom } = useWallet();

await depositToGameRoom('room-123', 5); // Deposit 5 USDT
```

---

## Error Handling

### Common Errors

**"VoidSigner cannot sign transactions"**
- ✅ **Fixed** - Now using proper signer from MetaMask

**"User rejected transaction"**
- User cancelled in MetaMask
- Let them try again

**"Insufficient funds"**
- Not enough USDT or ETH for gas
- Tell user to top up

**"Insufficient allowance"**
- Call `approveGameEscrow()` first
- Or increase approval amount

### Example Error Handling

```javascript
try {
  await sendUsdt(adminAddress, 10, 'BEP20');
} catch (error) {
  if (error.code === 4001) {
    alert('Transaction cancelled by user');
  } else if (error.message.includes('insufficient funds')) {
    alert('Not enough USDT or ETH for gas');
  } else if (error.message.includes('allowance')) {
    alert('Please approve USDT first');
  } else {
    alert(`Error: ${error.message}`);
  }
}
```

---

## Key Differences: Web3.js vs Ethers.js

| Feature | Web3.js | Ethers.js |
|---------|---------|-----------|
| Provider | `new Web3(window.ethereum)` | `new ethers.providers.Web3Provider(window.ethereum)` |
| Signer | Auto from `.send({ from: account })` | `.getSigner()` required |
| Connect | `new contract(abi, address)` | `contract.connect(signer)` |
| Send TX | `.send({ from: account })` | `.functionName(params)` |
| Wait | Auto | `.wait()` required |
| Decimals | `toBigInt(x * 1e6)` | `parseUnits(x, 6)` |

**Your codebase now uses Ethers.js** for Seka/USDT contracts, so make sure to:
- Get signer with `getSigner()`
- Connect contract with `.connect(signer)`
- Wait for transactions with `.wait()`

---

## Testing Checklist

- ✅ Connect MetaMask to Base Sepolia
- ✅ Have USDT (0xe13137C700f14b5aDbdC8A63b71a282B9557Ce9d)
- ✅ Have ETH for gas
- ✅ Call `sendUsdt()` with amount
- ✅ Approve in MetaMask (USDT approval)
- ✅ Approve in MetaMask (Deposit transaction)
- ✅ Check transaction on BaseScan
- ✅ Verify balance updated

---

## Contract Addresses (Base Sepolia)

- **Seka Contract**: `0x01BdF4098a5CD6539B8A91DB96EaF3418ed02707`
- **USDT Contract**: `0xe13137C700f14b5aDbdC8A63b71a282B9557Ce9d`
- **Chain ID**: `84532`
- **RPC**: `https://base-sepolia.drpc.org`
- **Explorer**: `https://sepolia.basescan.org`

---

## Summary

The VoidSigner error is now **fixed**! The key changes:

1. ✅ Created `getSigner()` helper function
2. ✅ Use `.connect(signer)` instead of `.connect(account)`
3. ✅ Properly wait for transactions with `.wait()`
4. ✅ Use ethers.js utilities (`parseUnits`, `formatUnits`, etc.)

Your deposit flow should now work smoothly! 🎉


