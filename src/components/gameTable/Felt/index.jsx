import React, { useState, useEffect } from "react";
import spadeIcon from "../../../assets/images/suits/spade.png";
import heartIcon from "../../../assets/images/suits/heart.svg";
import diamondIcon from "../../../assets/images/suits/diamond.svg";
import clubIcon from "../../../assets/images/suits/club.png";
import cardSeka from "../../../assets/images/card.png";
import CardDealingAnimation from "../CardDealingAnimation";

const Seat = ({
  index,
  visualPosition,
  player,
  cardBackSrc,
  USDTIconSrc,
  avatarUrl,
  isEmpty,
  isCurrentUser,
  showCards = false,
  cards = [],
  isShowdown = false,
  isDealer = false,
  handScore = null,
  handDescription = null,
  entryFee = 0,
  isCurrentTurn = false,
  cardViewers,
  setCardViewers,
}) => {
  // ✅ index = Physical DOM position (unique per player, based on join order)
  // ✅ visualPosition = Visual CSS position (where they appear on screen)
  const seatVisualClass = visualPosition !== undefined ? visualPosition : index;

  // 🎴 Track card flip animation state - only animate on transition
  const [previousShowFaceUp, setPreviousShowFaceUp] = useState(false);
  const [shouldAnimateFlip, setShouldAnimateFlip] = useState(false);

  if (isEmpty) {
    return (
      <div
        className={`seat seat-${seatVisualClass} empty-seat`}
        data-physical-index={index}
      >
        <div
          className="player-card"
          style={{
            background: "rgba(26, 35, 50, 0.6)",
            border: "2px dashed #444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "120px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              opacity: 0.5,
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#888"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            <div
              className="player-name"
              style={{ color: "#888", fontSize: "12px" }}
            >
              INVITE
            </div>
          </div>
          <div className="each-card">
            <img className={`each see`} src={cardSeka} alt="" />
            <img className={`each see`} src={cardSeka} alt="" />
            <img className={`each see`} src={cardSeka} alt="" />
          </div>
        </div>
      </div>
    );
  }

  // Use actual user data if available, otherwise fallback to email extraction
  const playerName =
    player.username ||
    player.name ||
    (player.email ? player.email.split("@")[0] : `Player ${index + 1}`);
  const displayName = playerName.charAt(0).toUpperCase() + playerName.slice(1);

  // Format userId for display (e.g., "user_hdkh5pt" → "0xhdkh...5pt")
  const userId = player.userId || "";
  const shortUserId =
    userId.length > 10
      ? `0x${userId.substring(5, 9)}...${userId.substring(userId.length - 3)}`
      : userId;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🎴 PER-PLAYER CARD VISIBILITY LOGIC (UNIQUE FOR EACH userId)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // This calculation runs INDEPENDENTLY for EACH player's Seat component
  // Current Player ID: ${player.userId || 'N/A'}
  //
  // RULE 1: Current user sees their cards ONLY if they've clicked "VIEW CARDS" (hasSeenCards)
  // RULE 2: During showdown, EVERYONE sees ALL cards
  // RULE 3: Otherwise, show card backs
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Step 1: Check if this player has cards to display
  const hasCards = cards && Array.isArray(cards) && cards.length > 0;

  // Step 2: Calculate visibility for THIS specific player (userId-specific)
  // ✅ CRITICAL: This variable is SCOPED to this Seat component instance
  // ✅ Each player gets their OWN independent showFaceUp calculation
  // ✅ Uses cardViewers state array to determine if this user has viewed cards
  // ✅ Variable name includes logic context: showFaceUp_${player.userId}
  const showFaceUp =
    hasCards &&
    ((isCurrentUser && cardViewers.includes(player.userId)) || isShowdown);

  // 🔍 DEBUG: Log card visibility decision for this player
  console.log(`🎴 Card visibility for ${player.userId.substring(0, 8)}:`, {
    hasCards,
    isCurrentUser,
    inCardViewers: cardViewers.includes(player.userId),
    cardViewersArray: cardViewers,
    isShowdown,
    finalShowFaceUp: showFaceUp,
  });

  // Step 3: Detect card flip transition (back → face) and trigger animation
  useEffect(() => {
    if (showFaceUp && !previousShowFaceUp) {
      // Cards just flipped from back to face - animate!
      setShouldAnimateFlip(true);

      // Remove animation after it completes (600ms = 0.6s)
      const timer = setTimeout(() => {
        setShouldAnimateFlip(false);
      }, 600);

      return () => clearTimeout(timer);
    }
    setPreviousShowFaceUp(showFaceUp);
  }, [showFaceUp, previousShowFaceUp]);

  // Determine player action/status
  const playerStatus = player.status || "";
  const currentBet = player.currentBet || 0;
  const hasActed = player.hasActed || false;
  const isFolded = playerStatus === "folded" || player.folded;
  const winAmount = player.winnings || 0;

  // Helper to get suit icon
  const getSuitIcon = (suit) => {
    switch (suit) {
      case "♠":
      case "spades":
        return spadeIcon;
      case "♥":
      case "hearts":
        return heartIcon;
      case "♦":
      case "diamonds":
        return diamondIcon;
      case "♣":
      case "clubs":
        return clubIcon;
      default:
        return null;
    }
  };

  // Helper to get suit color
  const getSuitColor = (suit) => {
    return suit === "♥" ||
      suit === "♦" ||
      suit === "hearts" ||
      suit === "diamonds"
      ? "#DC143C"
      : "#000000";
  };

  return (
    <div
      className={`seat seat-${seatVisualClass} ${
        isCurrentUser ? "current-user" : ""
      } ${isDealer ? "dealer-seat" : ""} ${isFolded ? "folded-seat" : ""}`}
      data-physical-index={index}
      data-user-id={player.userId}
      data-seat-owner={player.userId}
    >
      <div
        className={`player-card player-card-user-${player.userId}`}
        data-player-id={player.userId}
        style={{
          opacity: isFolded ? 0.5 : 1,
          filter: isFolded ? "grayscale(50%)" : "none",
        }}
      >
        {/* Top badges row - VIP and Gift icons */}
        <div
          style={{
            position: "absolute",
            top: "8px",
            left: "8px",
            display: "flex",
            gap: "6px",
            zIndex: 10,
          }}
        >
          {/* VIP Badge */}
          <div
            style={{
              background: "linear-gradient(135deg, #FFD700, #FFA500)",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              fontWeight: "bold",
              color: "#000",
              border: "2px solid #fff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            VIP
          </div>
          {/* Gift Icon */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              border: "2px solid #fff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            🎁
          </div>
        </div>

        {/* Avatar - Simple circular display */}
        <div
          style={{
            position: "relative",
            display: "inline-block"
          }}
        >
          <img
            className="gt-player-avatar"
            src={player.avatar || player.profilePicture || avatarUrl}
            alt={displayName}
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              width: "35px",
              height: "35px",
              border: "2px solid #334155",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
              position: "relative",
            }}
          />
          {isDealer && (
            <div
              style={{
                position: "absolute",
                bottom: "-5px",
                right: "-5px",
                backgroundColor: "#FFD700",
                color: "#000",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "bold",
                border: "2px solid #FFF",
                boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                zIndex: 3,
              }}
            >
              D
            </div>
          )}
          {/* Turn indicator badge */}
          {isCurrentTurn && (
            <div
              style={{
                position: "absolute",
                bottom: "-5px",
                left: "-5px",
                backgroundColor: "#22c55e",
                color: "#fff",
                borderRadius: "50%",
                width: "26px",
                height: "26px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "bold",
                border: "2px solid #FFF",
                boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                animation: "turnTimerPulse 1.5s ease-in-out infinite",
                zIndex: 3,
              }}
            >
              ⏱
            </div>
          )}
        </div>

        <div
          className="player-name"
          style={{ fontSize: "12px", fontWeight: "bold" }}
        >
          {displayName}
        </div>

        {/* Player balance with coin icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span style={{ fontSize: "18px" }}>🪙</span>
          <span
            style={{ fontSize: "15px", fontWeight: "bold", color: "#FFD700" }}
          >
            {(() => {
              const balance =
                typeof player.balance === "object"
                  ? player.balance.availableBalance
                  : player.balance || 0;
              const numBalance = Number(balance);
              // Format: Remove trailing zeros, max 2 decimal places for display
              return numBalance % 1 === 0
                ? numBalance
                : numBalance.toFixed(0).replace(/\.?0+$/, "");
            })()}
          </span>
        </div>

        {/* ENTRY PAID label */}
        {/* <div
          style={{
            fontSize: "11px",
            color: "#9CA3AF",
            marginTop: "4px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          ENTRY PAID :{" "}
          {Number(entryFee) % 1 === 0
            ? entryFee
            : Number(entryFee)
                .toFixed(0)
                .replace(/\.?0+$/, "")}
        </div> */}

        {/* Action status labels - RAISE, CALL, FOLD, WIN */}
        {!isFolded && winAmount > 0 && isShowdown && (
          <div
            style={{
              fontSize: "13px",
              color: "#22C55E",
              marginTop: "6px",
              fontWeight: "bold",
              padding: "4px 12px",
              background: "rgba(34, 197, 94, 0.2)",
              borderRadius: "8px",
            }}
          >
            WIN : {winAmount}
          </div>
        )}

        {isFolded && (
          <div
            style={{
              fontSize: "13px",
              color: "#EF4444",
              marginTop: "6px",
              fontWeight: "bold",
              padding: "4px 12px",
              background: "rgba(239, 68, 68, 0.2)",
              borderRadius: "8px",
            }}
          >
            FOLD
          </div>
        )}

        {!isFolded &&
          !isShowdown &&
          hasActed &&
          currentBet > 0 &&
          player.action && (
            <div
              style={{
                fontSize: "13px",
                color: "#F59E0B",
                marginTop: "6px",
                fontWeight: "bold",
                padding: "4px 12px",
                background: "rgba(245, 158, 11, 0.2)",
                borderRadius: "8px",
                textTransform: "uppercase",
              }}
            >
              {player.action} : {currentBet}
            </div>
          )}

        {!isFolded &&
          !isShowdown &&
          hasActed &&
          currentBet > 0 &&
          !player.action && (
            <div
              style={{
                fontSize: "13px",
                color: "#3B82F6",
                marginTop: "6px",
                fontWeight: "bold",
                padding: "4px 12px",
                background: "rgba(59, 130, 246, 0.2)",
                borderRadius: "8px",
              }}
            >
              CALL : {currentBet}
            </div>
          )}

        {/* Hand score display with P badge */}
        {/* ✅ FIX: Show hand score ONLY for current user OR during showdown */}
        {/* Opponents' scores stay hidden until showdown */}
        {handScore !== null &&
          handScore !== undefined &&
          ((isCurrentUser && cardViewers.includes(player.userId)) ||
            isShowdown) && (
            <div
              style={{
                position: "absolute",
                top: "45px",
                right: "-75px",
                backgroundColor: "#22C55E",
                color: "#FFF",
                padding: "6px 10px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "bold",
                boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                border: "2px solid #FFF",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                zIndex: 100,
              }}
            >
              <span style={{ fontSize: "16px" }}>{Math.round(handScore)}</span>
              <span
                style={{
                  fontSize: "11px",
                  backgroundColor: "#FFF",
                  color: "#22C55E",
                  padding: "2px 6px",
                  borderRadius: "50%",
                  fontWeight: "bold",
                }}
              >
                P
              </span>
            </div>
          )}

        {/* Cards stack - positioned above player card - HORIZONTAL LAYOUT */}
        {/* ✅ UNIQUE CLASS NAME: Each player's card container has unique identifier */}
        <div
          className={`cards-stack cards-stack-user-${player.userId}`}
          data-user-id={player.userId}
        >
          {/* ✅ FIX: Use showFaceUp variable instead of cardViewers check */}
          {/* This ensures opponent cards show backs only (not fronts) unless showdown */}
          {showFaceUp ? (
            // Show actual cards with suits during reveal/showdown - HORIZONTAL
            cards.map((card, i) => {
              const suitIcon = getSuitIcon(card.suit);
              const suitColor = getSuitColor(card.suit);

              return (
                <div
                  key={i}
                  className={`card-face card-${i + 1} card-user-${
                    player.userId
                  }`}
                  data-user-id={player.userId}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    padding: "8px 6px",
                    boxShadow:
                      "(0, 0, 0, 0.6) 0px 6px 16px, rgb(255, 255, 255) 0px 0px 10px 2px",
                    fontSize: "20px",
                    fontWeight: "bold",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "2px",
                    color: suitColor,
                    width: "65px",
                    height: "95px",
                    border: "3px solid #fff",
                    animation: shouldAnimateFlip
                      ? "cardFlip 0.6s ease-out"
                      : "none",
                    flex: "0 0 auto",
                    opacity: 1,
                    filter: "brightness(1.1) contrast(1.15) saturate(1.2)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "20px",
                      lineHeight: "1",
                      fontWeight: "900",
                      marginTop: "-2px",
                      marginLeft: "-6px",
                      alignSelf: "flex-start",
                    }}
                    className="again-text"
                  >
                    {card.rank}
                  </div>
                  {suitIcon && (
                    <div>
                      <img
                        src={suitIcon}
                        alt={card.suit}
                        style={{
                          width: "15px",
                          height: "30px",
                          zIndex:"2",
                          objectFit: "contain",
                          filter:
                            suitColor === "#DC143C"
                              ? "brightness(0) saturate(100%) invert(21%) sepia(88%) saturate(4477%) hue-rotate(343deg) brightness(90%) contrast(88%)"
                              : "none",
                          top: "20px",
                          left: "1px",
                          position: "absolute",
                        }}
                        className="one-image"
                      />
                      <img
                        src={suitIcon}
                        alt={card.suit}
                        style={{
                          width: "38px",
                          height: "38px",
                          objectFit: "contain",
                          filter:
                            suitColor === "#DC143C"
                              ? "brightness(0) saturate(100%) invert(21%) sepia(88%) saturate(4477%) hue-rotate(343deg) brightness(90%) contrast(88%)"
                              : "none",
                          top: "33px",
                          right: "9px",
                          position: "absolute",
                        }}
                        className="again-image"
                      />
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: "20px",
                      lineHeight: "1",
                      fontWeight: "900",
                      marginRight: "-6px",
                      marginBottom: "-2px",
                      alignSelf: "flex-end",
                      transform: "rotate(180deg)",
                    }}
                    className="again-text"
                  >
                    {card.rank}
                  </div>
                </div>
              );
            })
          ) : (
            // Show card backs - HORIZONTAL LAYOUT
            // ✅ UNIQUE USER-BASED CLASS NAMES: Each player's cards have unique identifiers
            <>
              <img
                className={`card-back card-1 card-user-${player.userId}`}
                data-user-id={player.userId}
                src={cardBackSrc}
                alt="card"
                style={{
                  width: "60px",
                  height: "90px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  flex: "0 0 auto",
                }}
              />
              <img
                className={`card-back card-2 card-user-${player.userId}`}
                data-user-id={player.userId}
                src={cardBackSrc}
                alt="card"
                style={{
                  width: "60px",
                  height: "90px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  flex: "0 0 auto",
                }}
              />
              <img
                className={`card-back card-3 card-user-${player.userId}`}
                data-user-id={player.userId}
                src={cardBackSrc}
                alt="card"
                style={{
                  width: "60px",
                  height: "90px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  flex: "0 0 auto",
                }}
              />
            </>
          )}
        </div>

        {/* Betting chips - show amount bet in current round */}
        {currentBet > 0 && !isFolded && (
          <div
            style={{
              position: "absolute",
              bottom: "-35px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(239, 68, 68, 0.9)",
              padding: "8px 16px",
              borderRadius: "25px",
              border: "3px solid #fff",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
              animation: "chipPulse 1s ease-in-out",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #DC2626, #EF4444)",
                border: "3px solid #fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
              }}
            >
              🎰
            </div>
            <span
              style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: "18px",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {currentBet}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const Felt = ({
  totalPot,
  USDTIconSrc,
  cardBackSrc,
  players = [],
  maxPlayers = 6,
  currentUserId,
  showCards = false,
  playerCards = {},
  isShowdown = false,
  dealerId = null,
  entryFee = 0,
  isDealingCards = false,
  cardViewers = [],
  setCardViewers = () => {},
  onDealingComplete,
}) => {
  // Load avatars from assets/images/users using Vite's glob importer
  const avatarModules = import.meta.glob(
    "../../../assets/images/users/*.{png,jpg,jpeg,webp}",
    { eager: true, as: "url" }
  );
  const avatarUrls = Object.values(avatarModules);

  // State for managing card visibility during dealing
  const [showPlayerCards, setShowPlayerCards] = useState(false);

  // playerCards format: { userId: [{ rank: 'A', suit: '♠' }, ...] }

  // When dealing starts, hide cards
  useEffect(() => {
    if (isDealingCards) {
      setShowPlayerCards(false);
    }
  }, [isDealingCards]);

  // When dealing completes, show cards
  const handleDealingComplete = () => {
    console.log("🎴 Dealing animation complete, showing cards");
    setShowPlayerCards(true);
    if (onDealingComplete) {
      onDealingComplete();
    }
  };

  // If not dealing and we have cards, show them
  useEffect(() => {
    if (!isDealingCards && Object.keys(playerCards).length > 0) {
      setShowPlayerCards(true);
    }
  }, [isDealingCards, playerCards]);

  // Bottom center seat (where current user should always be)
  const BOTTOM_CENTER_SEAT = 3;

  // Seat layout based on maxPlayers
  const seatLayout = {
    2: { bottomCenter: 3, othersAt: [0] },
    3: { bottomCenter: 3, othersAt: [5, 1] },
    4: { bottomCenter: 3, othersAt: [5, 0, 1] },
    5: { bottomCenter: 3, othersAt: [4, 5, 0, 1] },
    6: { bottomCenter: 3, othersAt: [4, 5, 0, 1, 2] },
  };

  const layout = seatLayout[maxPlayers] || seatLayout[6];

  // Find current user in players list
  const currentUserIndex = players.findIndex((p) => p.userId === currentUserId);

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔍 PLAYER ROTATION DEBUG");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📋 Current User ID:", currentUserId);
  console.log(
    "📋 Players array:",
    players.map((p, idx) => ({
      index: idx,
      userId: p.userId,
      email: p.email,
      match: p.userId === currentUserId ? "✅ THIS IS YOU!" : "",
    }))
  );
  console.log("📍 Current User Index in array:", currentUserIndex);
  console.log("🎯 Bottom Center Seat:", layout.bottomCenter);
  console.log("🔄 Other Seats:", layout.othersAt);

  // Rotate players so current user is always at bottom center
  let rotatedPlayers = [...players];
  if (currentUserIndex >= 0) {
    rotatedPlayers = [
      ...players.slice(currentUserIndex),
      ...players.slice(0, currentUserIndex),
    ];
    console.log("✅ ROTATION SUCCESSFUL!");
    console.log(
      "   After rotation:",
      rotatedPlayers.map((p, idx) => ({
        index: idx,
        email: p.email,
        willBeAtSeat:
          idx === 0
            ? `${layout.bottomCenter} (BOTTOM CENTER - YOU)`
            : `${layout.othersAt[idx - 1]} (OTHER PLAYER)`,
      }))
    );
  } else {
    console.warn("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.warn("⚠️ ROTATION FAILED!");
    console.warn("❌ Current user NOT found in players array!");
    console.warn("   Current User ID:", currentUserId);
    console.warn(
      "   Player IDs in array:",
      players.map((p) => p.userId)
    );
    console.warn("   This will cause INCORRECT positioning!");
    console.warn("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  }
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // ✅ NEW APPROACH: Assign seats based on ACTUAL player join order (userId-based)
  // This ensures each player has a UNIQUE physical DOM position
  // NOT based on visual rotation, but on the order they joined

  const seatAssignments = Array(6).fill(null);

  // ✅ CRITICAL: Use ORIGINAL player index (NOT rotated) for physical DOM position
  // This ensures Player 1 is ALWAYS at physical position 0, Player 2 at position 1, etc.
  // The VISUAL display will be adjusted with CSS transforms
  for (let i = 0; i < players.length && i < maxPlayers; i++) {
    const player = players[i]; // Use original order
    const visualSeatIndex = rotatedPlayers.findIndex(
      (p) => p.userId === player.userId
    );

    // Determine visual seat position based on layout
    let visualPosition;
    if (visualSeatIndex === 0) {
      visualPosition = layout.bottomCenter; // Current user at bottom center
    } else {
      visualPosition = layout.othersAt[visualSeatIndex - 1];
    }

    seatAssignments[i] = {
      // ✅ Physical position = join order (i)
      player: player,
      isCurrentUser: player.userId === currentUserId,
      physicalIndex: i, // Unique physical DOM position
      visualPosition: visualPosition, // Where they appear visually
    };
  }

  // ✅ Render seats in PHYSICAL order (0, 1, 2, 3, 4, 5)
  // Each player has a UNIQUE physical position based on join order
  const seatsToRender = Array.from(
    { length: players.length },
    (_, i) => i
  ).filter((i) => i < maxPlayers);

  // Get active seat indices for dealing animation
  const activeSeatIndices = seatsToRender.filter(
    (i) => seatAssignments[i] !== null
  );

  return (
    <div className="table-area">
      <div className="felt">
        {/* Professional TOTAL POT display - Green box like reference */}
        <div
          style={{
            position: "absolute",
            top: "45%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
            padding: "15px 40px",
            borderRadius: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 8px 32px rgba(34, 197, 94, 0.4)",
            border: "2px solid #4ade80",
            zIndex: 10,
          }}
        >
          <div
            style={{
              color: "#fff",
              fontSize: "14px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "1px",
              opacity: 0.9,
            }}
          >
            TOTAL POT
          </div>
          <div
            style={{
              color: "#fff",
              fontSize: "36px",
              fontWeight: "bold",
              textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            {Math.round(Number(totalPot))}
          </div>
        </div>
        {/* Card Dealing Animation */}
        <CardDealingAnimation
          activeSeatIndices={activeSeatIndices}
          onDealingComplete={handleDealingComplete}
          isDealing={isDealingCards}
        />

        <div className="seats">
          {seatsToRender.map((i) => {
            const assignment = seatAssignments[i];
            const playerUserId = assignment?.player?.userId;
            const cards = playerUserId ? playerCards[playerUserId] : [];
            const isDealer = playerUserId && playerUserId === dealerId;
            const handScore = assignment?.player?.handScore;
            const handDescription = assignment?.player?.handDescription;

            // 🐛 DEBUG: Log card rendering info
            if (playerUserId) {
              console.log(`🎴 Rendering seat ${i} for player ${playerUserId}:`);
              console.log("  - playerCards prop:", playerCards);
              console.log(`  - cards for ${playerUserId}:`, cards);
              console.log(
                `  - player.hasSeenCards:`,
                assignment?.player?.hasSeenCards
              );
              console.log(`  - isCurrentUser:`, assignment?.isCurrentUser);
              console.log(
                `  - physical-index: ${i}, visual-position: ${assignment?.visualPosition}`
              );
            }

            // ✅ FIX: Don't use global showCards - each player controls their own card visibility
            // Cards are shown based on individual player's hasSeenCards flag, not global state
            const shouldShowCards = showPlayerCards || isShowdown;

            return (
              <Seat
                key={`seat-${i}-${playerUserId || "empty"}`}
                index={i}
                visualPosition={assignment?.visualPosition || i}
                player={assignment?.player}
                isEmpty={!assignment}
                isCurrentUser={assignment?.isCurrentUser || false}
                showCards={shouldShowCards}
                cards={cards}
                isShowdown={isShowdown}
                isDealer={isDealer}
                handScore={handScore}
                handDescription={handDescription}
                entryFee={entryFee}
                cardBackSrc={cardBackSrc}
                USDTIconSrc={USDTIconSrc}
                avatarUrl={
                  avatarUrls.length ? avatarUrls[i % avatarUrls.length] : ""
                }
                cardViewers={cardViewers}
                setCardViewers={setCardViewers}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Felt;
