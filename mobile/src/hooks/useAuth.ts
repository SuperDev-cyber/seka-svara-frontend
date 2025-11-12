import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';

export type UserProfile = {
  id: string;
  username: string | null;
  email: string;
  wallet_address: string | null;
  avatar_url: string | null;
  bio: string | null;
};

export type User = {
  id: string;
  email?: string;
  name?: string;
  walletAddress?: string;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('authToken');
    if (token) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const loadProfile = async () => {
    try {
      const data = await apiService.getUserProfile();
      setProfile(data);
      setUser({
        id: data.id,
        email: data.email,
        name: data.username || undefined,
        walletAddress: data.wallet_address || undefined,
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      // Clear invalid token
      localStorage.removeItem('authToken');
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const signInWithOtp = async (email: string) => {
    // TODO: Implement OTP via backend API
    throw new Error('OTP sign-in not yet implemented');
  };

  const verifyOtpAndSetPassword = async (
    email: string,
    token: string,
    password?: string
  ) => {
    // TODO: Implement OTP verification via backend API
    throw new Error('OTP verification not yet implemented');
  };

  const signIn = async (email: string, password: string) => {
    // TODO: Implement email/password sign-in via backend API
    throw new Error('Email/password sign-in not yet implemented');
  };

  const signOut = async () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');
    // TODO: Implement profile update via backend API
    throw new Error('Profile update not yet implemented');
  };

  return {
    user,
    profile,
    loading,
    signInWithOtp,
    verifyOtpAndSetPassword,
    signIn,
    signOut,
    updateProfile,
  };
}
