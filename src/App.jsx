import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { AuthProvider } from './contexts/AuthContext';
import { WalletProvider } from './contexts/WalletContext';
import { SocketProvider } from './contexts/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import ToastContainer from './components/common/ToastContainer';
import NotificationManager from './components/notifications/NotificationManager';

import Header from './components/layout/Header/index.jsx';
import Footer from './components/layout/Footer/index.jsx';

import Register from './Pages/auth/Register/index.jsx';
import Login from './Pages/auth/Login/index.jsx';
import Home from './Pages/Home/index.jsx';
import Profile from './Pages/Profile/index.jsx';
import Marketplace from './Pages/Marketplace/index.jsx';
import GameLobby from './Pages/GameLobby/index.jsx';
import NFTDetail from './Pages/NFTDetail/index.jsx';
import NotFound from './Pages/NotFound/index.jsx';
import Support from './Pages/Support/index.jsx';
import GameTable from './Pages/GameTable/index.jsx';
import Admin from './Pages/Admin/index.jsx';
import AdminLogin from './Pages/Admin/Login/index.jsx';

function App() {
  // Use environment variable with fallback for development
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '485100795433-qcoglhlidiih80k2ptc49g2fuv526lqo.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <WalletProvider>
          <SocketProvider>
            <BrowserRouter>
              <ToastContainer />
              <NotificationManager />
          <Routes>
          {/* Public routes */}
          <Route path="/register" element={
            <ProtectedRoute requireAuth={false}>
              <Register />
            </ProtectedRoute>
          } />
          <Route path="/login" element={
            <ProtectedRoute requireAuth={false}>
              <Login />
            </ProtectedRoute>
          } />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <><Header /><Profile /><Footer /></>
            </ProtectedRoute>
          } />
          <Route path="/marketplace" element={
            <ProtectedRoute>
              <><Header /><Marketplace /><Footer /></>
            </ProtectedRoute>
          } />
          <Route path="/nft/:id" element={
            <ProtectedRoute>
              <><Header /><NFTDetail /><Footer /></>
            </ProtectedRoute>
          } />
          <Route path="/gamelobby" element={
            <ProtectedRoute>
              <><Header /><GameLobby /><Footer /></>
            </ProtectedRoute>
          } />
          <Route path="/game/:id" element={
            <ProtectedRoute>
              <><Header /><GameTable /></>
            </ProtectedRoute>
          } />
          <Route path="/support" element={
            <ProtectedRoute>
              <><Header /><Support /><Footer /></>
            </ProtectedRoute>
          } />
          <Route path="/admin/*" element={
            <ProtectedRoute adminOnly>
              <Admin />
            </ProtectedRoute>
          } />
          
          {/* Public home route */}
          <Route path="/" element={<><Header /><Home /><Footer /></>} />
          <Route path="*" element={<><Header /><NotFound /><Footer /></>} />
        </Routes>
            </BrowserRouter>
          </SocketProvider>
        </WalletProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App
