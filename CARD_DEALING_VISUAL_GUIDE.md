# 🎴 Card Dealing Animation - Visual Guide

## Animation Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    GAME START SEQUENCE                          │
└─────────────────────────────────────────────────────────────────┘

Step 1: COUNTDOWN (3 seconds)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌────────────────────────────────────┐
│                                    │
│                                    │
│              ╔═══╗                 │
│              ║ 3 ║  ← Large Pulsing Number
│              ╚═══╝                 │
│         Game Starting...           │
│                                    │
│                                    │
└────────────────────────────────────┘

⏱️  Duration: 3 seconds
📊 Status: showCountdown = true, countdown = 3 → 2 → 1


Step 2: DEALER DISPLAY (2 seconds after game_started)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌────────────────────────────────────┐
│                                    │
│        ╭────────────────╮          │
│        │   [Avatar]     │          │
│        │   👤 Dealer    │          │
│        │ player@mail    │          │
│        │ Dealer is      │          │
│        │ dealing cards  │          │
│        ╰────────────────╯          │
│                                    │
└────────────────────────────────────┘

⏱️  Duration: Appears 2s after game_started
📊 Status: showDealerDisplay = true


Step 3: CARD DEALING ANIMATION (Starts 3s after game_started)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ROUND 1 (First card to each player):
┌────────────────────────────────────┐
│   [P1]          [P2]               │
│                                    │
│                                    │
│ [P4]    [🎴] → → → →  [P3]        │  Cards fly from center
│                                    │
│                                    │
│   [P5]          [P6]               │
└────────────────────────────────────┘

Time: t=0ms → Card to Player 1
      t=250ms → Card to Player 2
      t=500ms → Card to Player 3
      t=750ms → Card to Player 4


ROUND 2 (Second card to each player):
┌────────────────────────────────────┐
│   [P1]🎴       [P2]🎴              │
│                                    │
│                                    │
│ [P4]🎴  [🎴] → → → →  [P3]🎴      │
│                                    │
│                                    │
│   [P5]🎴       [P6]🎴              │
└────────────────────────────────────┘

Time: t=1000ms → Card to Player 1
      t=1250ms → Card to Player 2
      t=1500ms → Card to Player 3
      t=1750ms → Card to Player 4


ROUND 3 (Third card to each player):
┌────────────────────────────────────┐
│   [P1]🎴🎴     [P2]🎴🎴            │
│                                    │
│                                    │
│ [P4]🎴🎴 [🎴] → → → [P3]🎴🎴      │
│                                    │
│                                    │
│   [P5]🎴🎴     [P6]🎴🎴            │
└────────────────────────────────────┘

Time: t=2000ms → Card to Player 1
      t=2250ms → Card to Player 2
      t=2500ms → Card to Player 3
      t=2750ms → Card to Player 4

⏱️  Total: ~3 seconds for 4 players
📊 Status: isDealingCards = true, showPlayerCards = false


Step 4: CARDS REVEALED (After animation completes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌────────────────────────────────────┐
│   [P1]🂠🂠🂠   [P2]🂠🂠🂠           │  Others: Card backs
│                                    │
│                                    │
│ [P4]🂠🂠🂠  POT: 100  [P3]🂠🂠🂠    │
│                                    │
│                                    │
│   [P5]🂠🂠🂠   [P6]🂠🂠🂠           │
└────────────────────────────────────┘
                 ↓
              CURRENT USER (P3)
┌────────────────────────────────────┐
│         [A♠] [K♥] [Q♦]             │  You: Face-up cards
│        ┌──────────────────┐        │
│        │  Fold   Call  Raise │     │  Betting controls appear
│        └──────────────────┘        │
└────────────────────────────────────┘

⏱️  Instant reveal after dealing completes
📊 Status: showPlayerCards = true, showCards = true, cardsDealt = true
```

---

## 🎬 Animation Sequence (Timeline)

```
TIME    EVENT                           STATE CHANGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

0.0s    Backend: game_starting          gameStatus = 'starting'
                                        showCountdown = true
                                        countdown = 3

1.0s    Countdown: 2                    countdown = 2

2.0s    Countdown: 1                    countdown = 1

3.0s    Backend: game_started           gameStatus = 'in_progress'
                                        showCountdown = false

5.0s    Dealer Display Shows            showDealerDisplay = true
                                        cardsDealt = false
                                        showCards = false
                                        playerCards = {}

6.0s    Card Animation Starts           isDealingCards = true
                                        showPlayerCards = false

6.3s    Card 1 flies to Seat 0          dealingCards = [card-0]

6.55s   Card 2 flies to Seat 1          dealingCards = [card-0, card-1]

6.8s    Card 3 flies to Seat 3          dealingCards = [card-1, card-2]

7.05s   Card 4 flies to Seat 5          dealingCards = [card-2, card-3]

7.3s    Card 5 flies to Seat 0          dealingCards = [card-3, card-4]

... (continues for all 12 cards)

9.65s   Last card animation complete    dealingCards = []
                                        isDealingCards = false

9.65s   Cards Revealed                  showPlayerCards = true
                                        playerCards = {userId: [...]}
                                        cardsDealt = true

9.65s   Betting Controls Appear         Player can now take actions
```

---

## 🎨 Card Flight Paths

```
Seat Positions (6-player table):

        [0]         [1]
           \       /
            \     /
             \   /
    [4] ─── [CENTER] ─── [2]
             /   \
            /     \
           /       \
        [5]         [3]
                  (YOU)

Animation Paths:

Seat 0 (Top-left):
  CENTER → translate(-300px, -200px) + rotate(15deg)

Seat 1 (Top-center-right):
  CENTER → translate(250px, -200px) + rotate(-15deg)

Seat 2 (Right):
  CENTER → translate(350px, -50px) + rotate(-10deg)

Seat 3 (Bottom-center - YOU):
  CENTER → translate(0, 150px) + rotate(0deg)

Seat 4 (Left):
  CENTER → translate(-350px, -50px) + rotate(10deg)

Seat 5 (Top-center-left):
  CENTER → translate(-250px, -200px) + rotate(15deg)
```

---

## 🔄 State Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    GameTable Component                          │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Props
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Felt Component                             │
│                                                                 │
│  State:                                                         │
│    • showPlayerCards = false (initially)                        │
│                                                                 │
│  useEffect: isDealingCards changes                              │
│    ├─ if true → showPlayerCards = false                        │
│    └─ if false → showPlayerCards = true                        │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Props
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│              CardDealingAnimation Component                     │
│                                                                 │
│  Props:                                                         │
│    • isDealing = true                                           │
│    • activeSeatIndices = [0, 1, 3, 5]                          │
│    • onDealingComplete = callback                              │
│                                                                 │
│  State:                                                         │
│    • dealingCards = [card-0, card-1, ...]                      │
│    • dealingPhase = 0 → 1 → 2                                  │
│                                                                 │
│  Logic:                                                         │
│    1. Loop through players 3 times                             │
│    2. Add card to dealingCards array                           │
│    3. Trigger CSS animation                                    │
│    4. Remove card after 650ms                                  │
│    5. Wait 250ms before next card                              │
│    6. After all cards → onDealingComplete()                    │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Callback
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Felt Component                             │
│                                                                 │
│  handleDealingComplete():                                       │
│    • showPlayerCards = true                                     │
│    • Triggers re-render                                         │
│    • Seat components now show cards                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Timing Variables

```javascript
// CardDealingAnimation/index.jsx
const DEAL_DELAY = 250;           // Time between cards
const ANIMATION_DURATION = 600;   // Card flight time
const CLEANUP_DELAY = 650;        // When to remove card from DOM
const INITIAL_DELAY = 300;        // Delay before first card

// CSS (index.css)
animation: dealCardToSeatX 0.6s ease-out forwards;
// 0.6s = ANIMATION_DURATION

// GameTable/index.jsx
setTimeout(() => setShowDealerDisplay(true), 2000);  // Show dealer
setTimeout(() => setIsDealingCards(true), 1000);     // Start dealing after dealer
```

---

## 📊 Performance Metrics

### Expected Timings (4 players):

| Metric                    | Value      |
|---------------------------|------------|
| Cards to deal             | 12         |
| Time per card             | 250ms      |
| Animation duration        | 600ms      |
| Total dealing time        | ~3 seconds |
| First card appears at     | 6.3s       |
| Last card lands at        | 9.05s      |
| Cards revealed at         | 9.65s      |
| **Total from game_started** | **~6.7s**  |

### Memory Usage:

| Component              | DOM Elements | Max Simultaneous |
|------------------------|--------------|------------------|
| Dealing cards          | 1-3          | 3 cards flying   |
| Total animations       | 12           | Sequential       |
| Peak memory impact     | Low          | <1MB             |

---

## 🎨 CSS Animation Breakdown

```css
/* Example: Card to Seat 0 */
@keyframes dealCardToSeat0 {
    0% {
        transform: translate(0, 0)        /* Start at center */
                   scale(1)               /* Normal size */
                   rotate(0deg);          /* No rotation */
        opacity: 1;                       /* Fully visible */
    }
    100% {
        transform: translate(-300px, -200px)  /* Move to seat 0 */
                   scale(0.8)                 /* Slightly smaller */
                   rotate(15deg);             /* Slight rotation */
        opacity: 1;                           /* Stay visible */
    }
}

/* Applied via class */
.dealing-card-to-seat-0 {
    animation: dealCardToSeat0     /* Animation name */
               0.6s                /* Duration */
               ease-out            /* Timing function */
               forwards;           /* Keep final state */
}
```

---

## 🔍 Debug Console Output

```
🎴 Starting card dealing animation...
🎴 Dealing card 1/12 - Round 0, Seat 0
🎴 Dealing card 2/12 - Round 0, Seat 1
🎴 Dealing card 3/12 - Round 0, Seat 3
🎴 Dealing card 4/12 - Round 0, Seat 5
🎴 Dealing card 5/12 - Round 1, Seat 0
🎴 Dealing card 6/12 - Round 1, Seat 1
🎴 Dealing card 7/12 - Round 1, Seat 3
🎴 Dealing card 8/12 - Round 1, Seat 5
🎴 Dealing card 9/12 - Round 2, Seat 0
🎴 Dealing card 10/12 - Round 2, Seat 1
🎴 Dealing card 11/12 - Round 2, Seat 3
🎴 Dealing card 12/12 - Round 2, Seat 5
✅ Card dealing complete!
🎴 Dealing animation complete, showing cards
🎴 Card dealing animation in Felt complete!
```

---

## 🎮 User Interaction During Dealing

### ❌ BLOCKED Actions:
- Betting (controls hidden until cards revealed)
- Seeing cards (face-down during animation)
- Leaving table (disabled during dealing)

### ✅ ALLOWED Actions:
- Viewing chat
- Seeing pot amount
- Viewing other players
- Reading game status

---

## 🚀 Testing the Animation

### Manual Test Steps:

1. **Create a table** as User A
2. **Join table** as User B (open incognito window)
3. **Wait for auto-start** (2+ players, 10 seconds)
4. **Observe countdown** (3-2-1)
5. **Watch dealer display** (should appear 2s after start)
6. **See cards fly** (one by one from center)
7. **Verify reveal** (your cards face-up, others face-down)
8. **Check console** (should see 🎴 logs)

### Expected Results:
- ✅ Smooth animation
- ✅ Cards fly to correct seats
- ✅ Sequential dealing (not simultaneous)
- ✅ Proper timing (250ms between cards)
- ✅ Cards revealed after animation
- ✅ No flickering or jumps

---

**Visual Guide Version**: 1.0  
**Last Updated**: 2025-10-24  
**Status**: ✅ Complete

