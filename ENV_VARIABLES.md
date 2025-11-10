# Frontend Environment Variables Guide

## ⚠️ IMPORTANT: BSC_PRIVATE_KEY Should NOT Be in Frontend

**DO NOT** add `BSC_PRIVATE_KEY` to your frontend `.env` file. Here's why:

### Security Reasons

1. **Frontend code is public**: Any environment variables in the frontend are exposed to anyone who:
   - Views the page source
   - Inspects the browser's network requests
   - Uses browser developer tools
   - Accesses the built JavaScript bundle

2. **Private keys must remain secret**: The `BSC_PRIVATE_KEY` is the admin wallet's private key that:
   - Controls funds for all game payouts
   - Should only exist on the secure backend server
   - If exposed, could allow unauthorized access to the admin wallet

### Architecture

- **Backend (`BSC_PRIVATE_KEY`)**: Used by the server to transfer winnings from the admin wallet to winners
- **Frontend (Web3Auth)**: Users retrieve their own private keys from Web3Auth for:
  - Entry fee transfers
  - Betting action transfers (bet, raise, call, all-in)

### What Should Be in Frontend ENV?

Only include:
- Public API endpoints (e.g., `VITE_API_URL`)
- Public configuration (e.g., Web3Auth Client ID - which is already public)
- Non-sensitive settings

### Where Should BSC_PRIVATE_KEY Be Set?

**Backend environment only** (e.g., Render.com, Vercel Serverless Functions, or your backend server):
```
BSC_PRIVATE_KEY=0x97a44679d20c75523339c885ded3cd7499a0255cd0a78f6aee3dad7f52b21764
```

See `backend/Seka-Svara-CP-For-Server/BSC_ENV_SETUP.md` for backend configuration details.

