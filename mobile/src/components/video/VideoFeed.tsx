import { useState, useEffect, useRef } from 'react';
import { VideoPlayer } from './VideoPlayer';
import { CommentsSheet } from './CommentsSheet';
import { Video, supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function VideoFeed() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadVideos();
    if (user) {
      loadLikedVideos();
    }
  }, [user]);

  const loadVideos = async () => {
    try {
      const { data, error } = await supabase.
      from('videos').
      select('*, user_profiles(username, avatar_url)').
      order('created_at', { ascending: false }).
      limit(20);

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error loading videos:', error);
      toast.error('Videolarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const loadLikedVideos = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.
      from('likes').
      select('video_id').
      eq('user_id', user.id);

      if (error) throw error;
      setLikedVideos(new Set(data?.map((like) => like.video_id) || []));
    } catch (error) {
      console.error('Error loading likes:', error);
    }
  };

  const handleLike = async (videoId: string) => {
    if (!user) {
      toast.error('Like qo\'yish uchun tizimga kiring');
      return;
    }

    const isLiked = likedVideos.has(videoId);

    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase.
        from('likes').
        delete().
        eq('video_id', videoId).
        eq('user_id', user.id);

        if (error) throw error;

        setLikedVideos((prev) => {
          const newSet = new Set(prev);
          newSet.delete(videoId);
          return newSet;
        });

        // Update video likes count
        setVideos((prev) =>
        prev.map((v) =>
        v.id === videoId ? { ...v, likes_count: v.likes_count - 1 } : v
        )
        );
      } else {
        // Like
        const { error } = await supabase.from('likes').insert({
          video_id: videoId,
          user_id: user.id
        });

        if (error) throw error;

        setLikedVideos((prev) => new Set(prev).add(videoId));

        // Update video likes count
        setVideos((prev) =>
        prev.map((v) =>
        v.id === videoId ? { ...v, likes_count: v.likes_count + 1 } : v
        )
        );
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Xatolik yuz berdi');
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;

    const scrollTop = containerRef.current.scrollTop;
    const windowHeight = window.innerHeight;
    const newIndex = Math.round(scrollTop / windowHeight);

    if (newIndex !== currentIndex && newIndex < videos.length) {
      setCurrentIndex(newIndex);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>);

  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        
        


      </div>);

  }

  return (
    <>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide">

        {videos.map((video, index) =>
        <div
          key={video.id}
          className="h-screen w-full snap-start snap-always">

            <VideoPlayer
            video={video}
            isActive={index === currentIndex}
            onLike={() => handleLike(video.id)}
            onComment={() => setSelectedVideoId(video.id)}
            isLiked={likedVideos.has(video.id)} />

          </div>
        )}
      </div>

      <CommentsSheet
        videoId={selectedVideoId}
        onClose={() => setSelectedVideoId(null)} />

    </>);

}