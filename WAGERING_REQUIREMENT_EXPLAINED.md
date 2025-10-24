# Wagering Requirement System - Complete Explanation

## 🎮 How It Works

The withdrawal system is based on **actual game activity** (money wagered in games), NOT on deposit amounts.

## 📊 Formula

```
Maximum Withdrawable Amount = (Total Amount Wagered in Games) ÷ 1.3
```

## 🔍 What Counts as "Wagered"?

**Wagered amount** includes ALL money spent during gameplay:
- Bets placed
- Antes paid
- Raises made
- **Important**: Money from winnings that you use to play again also counts as wagered!

## 📖 Example Scenario

Let's say a player:

1. **Deposits**: 10 USDT
   - Now has: 10 SEKA balance
   - Total wagered: 0 SEKA

2. **Game 1**: Bets 5 SEKA and loses
   - Balance: 5 SEKA
   - **Total wagered: 5 SEKA** ✅

3. **Game 2**: Bets 5 SEKA and wins 25 SEKA
   - Balance: 25 SEKA
   - **Total wagered: 5 + 5 = 10 SEKA** ✅

4. **Game 3**: Uses 20 SEKA from winnings to play
   - Balance: varies based on outcome
   - **Total wagered: 10 + 20 = 30 SEKA** ✅

5. **Game 4**: Wins 100 SEKA
   - Balance: 100+ SEKA
   - Total wagered: still 30 SEKA (no new bets yet)

6. **Game 5**: Uses 50 SEKA to play
   - **Total wagered: 30 + 50 = 80 SEKA** ✅

7. **Wins big**: Now has 1,000 SEKA balance!

### 💰 Withdrawal Calculation

```
Total Wagered: 80 SEKA
Max Withdrawable: 80 ÷ 1.3 = 61.54 SEKA

Even though the player has 1,000 SEKA in their balance,
they can only withdraw ~61.54 SEKA because that's based on
how much they've actually wagered in games.
```

## 🎯 Key Points

1. **Deposit ≠ Wagered**
   - Depositing 100 USDT doesn't mean you've wagered 100 USDT
   - You must actually USE that money in games

2. **Winnings Can Be Wagered Too**
   - If you win 1,000 SEKA and play with it, those bets count as wagered
   - This allows you to increase your maximum withdrawable amount

3. **Encourages Active Play**
   - The more you play (wager), the more you can withdraw
   - Protects against deposit → immediate withdrawal

4. **Fair Conversion**
   - 1 SEKA = 1 USDT when withdrawing
   - No fees on withdrawal

## 🔄 Backend Tracking

The backend tracks `totalWagered` by:
- Recording every bet, ante, and raise in game transactions
- Summing all game-related debits (money spent in games)
- NOT counting deposits or transfers

## 🛡️ Why This System?

1. **Anti-fraud**: Prevents money laundering and bonus abuse
2. **Fair play**: Rewards active players who engage with games
3. **Sustainable**: Ensures platform viability
4. **Transparent**: Clear formula (÷ 1.3) that players can understand

## 📱 UI Updates

The WithdrawModal now shows:
- ✅ Clear explanation of "Total Wagered" vs deposits
- ✅ Real-time calculation of max withdrawable amount
- ✅ Detailed example scenario
- ✅ Informative error messages when limits are exceeded
- ✅ "Total Game Activity" label to clarify what's being tracked

## 💡 For Users

**To increase your withdrawal limit:**
- Play more games (bet, ante, raise)
- Use your winnings to play again
- Every SEKA spent in games increases your "Total Wagered"
- Your max withdrawal = Total Wagered ÷ 1.3

**Example:**
- Want to withdraw 100 SEKA?
- You need to wager: 100 × 1.3 = 130 SEKA in games

