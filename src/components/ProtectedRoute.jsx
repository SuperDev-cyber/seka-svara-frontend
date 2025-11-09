import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSafeAuth } from '../contexts/SafeAuthContext';

const ProtectedRoute = ({ children, requireAuth = true, adminOnly = false }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { loggedIn: safeAuthLoggedIn, account: safeAuthAccount } = useSafeAuth();
  const location = useLocation();

  // ✅ WALLET CONNECTION = AUTHENTICATION
  // If Web3Auth wallet is connected, user is considered authenticated
  const isWalletAuthenticated = safeAuthLoggedIn && safeAuthAccount;
  const effectivelyAuthenticated = isAuthenticated || isWalletAuthenticated;

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated (neither backend nor wallet)
  if (requireAuth && !effectivelyAuthenticated) {
    // Redirect to home page instead of /login (which doesn't exist)
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If admin access is required but user is not admin
  if (adminOnly && (!user || user.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  // If user is authenticated but trying to access auth pages
  if (!requireAuth && effectivelyAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

