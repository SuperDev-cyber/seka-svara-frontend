// Stub file - Supabase removed, use backend API instead
// This file exists to prevent import errors in components that haven't been updated yet

export type Video = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  duration: number | null;
  views_count: number;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  user_profiles?: {
    username: string | null;
    avatar_url: string | null;
  };
};

export type Comment = {
  id: string;
  user_id: string;
  video_id: string;
  content: string;
  created_at: string;
  user_profiles?: {
    username: string | null;
    avatar_url: string | null;
  };
};

export type UserProfile = {
  id: string;
  username: string | null;
  email: string;
  wallet_address: string | null;
  avatar_url: string | null;
  bio: string | null;
};

// Stub supabase client - throws error if used
export const supabase = new Proxy({} as any, {
  get() {
    throw new Error('Supabase has been removed. Please use the backend API instead via apiService.');
  }
});
