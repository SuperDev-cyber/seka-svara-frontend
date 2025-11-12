import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
