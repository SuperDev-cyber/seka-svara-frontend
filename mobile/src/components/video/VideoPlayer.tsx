import { useRef, useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, DollarSign } from 'lucide-react';
import { Video } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { TipDialog } from './TipDialog';

type VideoPlayerProps = {
  video: Video;
  isActive: boolean;
  onLike: () => void;
  onComment: () => void;
  isLiked: boolean;
};

export function VideoPlayer({ video, isActive, onLike, onComment, isLiked }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showTipDialog, setShowTipDialog] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isActive) {
      videoRef.current.play().catch(() => {
        // Autoplay failed
      });
    } else {
      videoRef.current.pause();
    }
  }, [isActive]);

  const handleVideoClick = () => {
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  return (
    <div className="relative w-full h-full bg-black">
      <video
        ref={videoRef}
        src={video.video_url}
        className="w-full h-full object-contain"
        loop
        playsInline
        onClick={handleVideoClick}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />

      {/* Video info */}
      <div className="absolute bottom-20 left-0 right-0 px-4 pb-4 pointer-events-none">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {video.user_profiles?.avatar_url ? (
                <img
                  src={video.user_profiles.avatar_url}
                  alt={video.user_profiles.username || 'User'}
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-primary" />
              )}
              <span className="font-semibold text-white">
                @{video.user_profiles?.username || 'Anonymous'}
              </span>
            </div>
            <h3 className="font-semibold text-white mb-1">{video.title}</h3>
            {video.description && (
              <p className="text-sm text-white/90 line-clamp-2">{video.description}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-4 pointer-events-auto">
            <button
              onClick={onLike}
              className="flex flex-col items-center gap-1 transition-transform active:scale-90"
            >
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center',
                isLiked ? 'bg-primary' : 'glass-effect'
              )}>
                <Heart className={cn('w-6 h-6', isLiked && 'fill-current')} />
              </div>
              <span className="text-xs font-semibold text-white">
                {video.likes_count || 0}
              </span>
            </button>

            <button
              onClick={onComment}
              className="flex flex-col items-center gap-1 transition-transform active:scale-90"
            >
              <div className="w-12 h-12 rounded-full glass-effect flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-white">
                {video.comments_count || 0}
              </span>
            </button>

            <button
              onClick={() => setShowTipDialog(true)}
              className="flex flex-col items-center gap-1 transition-transform active:scale-90"
            >
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-white">Tip</span>
            </button>

            <button className="flex flex-col items-center gap-1 transition-transform active:scale-90">
              <div className="w-12 h-12 rounded-full glass-effect flex items-center justify-center">
                <Share2 className="w-6 h-6" />
              </div>
            </button>
          </div>
        </div>
      </div>

      <TipDialog
        open={showTipDialog}
        onClose={() => setShowTipDialog(false)}
        videoId={video.id}
        creatorId={video.user_id}
        creatorName={video.user_profiles?.username || 'Anonymous'}
      />
    </div>
  );
}
