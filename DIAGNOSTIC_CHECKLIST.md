# 🔧 Quick Diagnostic Checklist

## If you can't see tables or countdown:

### **Step 1: Open Browser Console** (F12)

Look for these logs:

#### **In Game Lobby** (`/gamelobby`):
```
✅ Socket already connected
🔗 Joining lobby room...
📡 Requesting active tables...
Loaded X tables from memory
Available tables: X
```

**What to check:**
- Are there any RED errors?
- Does it say "Available tables: 0"?
- Does it say "Connected to game server"?

---

#### **In Game Table** (`/game/pending-...`):
```
🔗 Joining table to ensure it exists...
✅ Successfully joined/created table
📡 Requesting table details for: pending-...
✅ Table found: ...
```

**What to check:**
- Does it say "Successfully joined/created table"?
- Any errors about "Table not found"?
- Does countdown appear after 2nd player joins?

---

### **Step 2: Check Backend** (if you have access)

Backend should show:
```
✅ Player ... joined table ... (1/6)
⏳ Waiting for more players... (1/6)
```

When 2nd player joins:
```
✅ Player ... joined table ... (2/6)
🚀 AUTO-START: EXACTLY 2 players present
```

---

### **Step 3: Common Issues & Quick Fixes**

#### **Issue: "Available tables: 0" in lobby**
**Fix**: 
1. Create a new table (Click "Create Table")
2. Should immediately appear in lobby

#### **Issue: Countdown doesn't appear**
**Reason**: Countdown only starts when EXACTLY 2 players join
**Fix**:
1. Make sure you have EXACTLY 2 players
2. Not 1 player, not 3 players - EXACTLY 2

#### **Issue: Can't see table that was just created**
**Fix**:
1. Hard refresh (`Ctrl + Shift + R`)
2. Check console for errors

#### **Issue: Multiple backend processes running**
**Symptom**: Strange behavior, duplicate messages
**Fix**: Kill all Node processes and restart backend

---

### **Step 4: Nuclear Option - Full Reset**

If nothing works:

1. **Backend**:
   ```powershell
   taskkill /F /IM node.exe
   cd backend/Seka-Svara-CP-For-Server
   npm run start:dev
   ```

2. **Frontend**:
   - Hard refresh both browsers (`Ctrl + Shift + R`)
   - Clear session storage (F12 → Application → Session Storage → Clear)

3. **Test again**:
   - User A: Create table
   - User B: Join table
   - Should see countdown when 2nd player joins

---

### **Step 5: Share Console Logs**

If still not working, share these logs:

1. **Frontend Console** (everything in red)
2. **Backend Terminal** (last 20 lines)
3. **What you tried** (steps you took)

---

## 🎯 Expected Behavior

### **Creating Table:**
1. Click "Create Table"
2. Table appears in lobby immediately
3. You're automatically in the table

### **Joining Table:**
1. Click "Join" on any table
2. You enter the game page
3. See other players' avatars

### **Game Starting:**
1. When 2nd player joins → Countdown appears (10...9...8...)
2. After 10 seconds → Cards are dealt
3. Game begins!

---

**Still stuck? Let me know what you see in the console!** 🔍

