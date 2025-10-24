import React, { useState } from "react";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:8000";

const Banner = ({ table, onLeave, tableTopSrc, userId, tableId }) => {
  const [isLeaving, setIsLeaving] = useState(false);

  const handleLeave = () => {
    if (!userId || !tableId) {
      console.error("❌ Missing userId or tableId");
      onLeave();
      return;
    }

    if (isLeaving) return;
    setIsLeaving(true);

    console.log("👋 Leaving table:", tableId);

    // Connect to WebSocket and leave table
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: false,
    });

    socket.on("connect", () => {
      console.log("✅ Connected to server, emitting leave_table");

      socket.emit(
        "leave_table",
        {
          tableId: tableId,
          userId: userId,
        },
        (response) => {
          console.log("📥 Leave table response:", response);

          socket.disconnect();

          if (response.success) {
            console.log("✅ Successfully left table");
            // CLEAR table membership from sessionStorage
            sessionStorage.removeItem("seka_currentTableId");
            sessionStorage.removeItem("seka_currentTableName");
            console.log("🗑️ Cleared table membership from sessionStorage");
          } else {
            console.warn("⚠️ Leave response:", response.message);
          }

          // Navigate back regardless
          onLeave();
        }
      );
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
      setIsLeaving(false);
      onLeave();
    });

    // Timeout fallback - force leave if stuck
    setTimeout(() => {
      if (isLeaving) {
        console.warn("⏱️ Leave timeout, force navigating anyway");
        socket.disconnect();
        // Clear all session storage to prevent stuck state
        sessionStorage.removeItem("seka_currentTableId");
        sessionStorage.removeItem("seka_currentTableName");
        sessionStorage.removeItem("seka_tableStatus");
        onLeave();
      }
    }, 5000); // Increased timeout to 5 seconds
  };
  return (
    <div className="table-banner">
      <button
        className="leave-btn"
        onClick={handleLeave}
        disabled={
          isLeaving ||
          table.status === "in_progress" ||
          table.status === "finished"
        }
        title={
          isLeaving
            ? "Leaving..."
            : table.status === "in_progress" || table.status === "finished"
            ? "Cannot leave during an active game"
            : "Leave table"
        }
      >
        <span className="leave-icon">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </span>
        {isLeaving ? "LEAVING..." : "LEAVE TABLE"}
      </button>
      {/* <div className="table-hero">
                <img className="table-hero-img" src={tableTopSrc} alt="table" />
                <div className="table-hero-overlay">
                    <div className="banner-left">
                        <div className="banner-title">Table #{table.id || 'T003'}</div>
                        <div className="banner-meta-row">
                            <span className="meta-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M2 8.82a15.91 15.91 0 0 1 20 0" />
                                    <path d="M5 12.5a10.91 10.91 0 0 1 14 0" />
                                    <path d="M8.5 16.18a5.91 5.91 0 0 1 7 0" />
                                    <circle cx="12" cy="19" r="1" />
                                </svg>
                            </span>
                            <span className="meta-pill">{table.network || 'BSC'}</span>
                            <span className="meta-players">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                                <span>{`${table.playerCount || 5}/${table.maxPlayers || 6} Players`}</span>
                            </span>
                        </div>
                    </div>
                    
                </div>
            </div> */}
    </div>
  );
};

export default Banner;
