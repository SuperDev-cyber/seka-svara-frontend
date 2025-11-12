import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Comment, supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Send, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { uz } from 'date-fns/locale';

type CommentsSheetProps = {
  videoId: string | null;
  onClose: () => void;
};

export function CommentsSheet({ videoId, onClose }: CommentsSheetProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (videoId) {
      loadComments();
    }
  }, [videoId]);

  const loadComments = async () => {
    if (!videoId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*, user_profiles(username, avatar_url)')
        .eq('video_id', videoId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendComment = async () => {
    if (!user || !videoId) {
      toast.error('Izoh qoldirish uchun tizimga kiring');
      return;
    }

    if (!comment.trim()) return;

    setSending(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          video_id: videoId,
          user_id: user.id,
          content: comment.trim(),
        })
        .select('*, user_profiles(username, avatar_url)')
        .single();

      if (error) throw error;

      setComments((prev) => [data, ...prev]);
      setComment('');
      toast.success('Izoh qo\'shildi');
    } catch (error) {
      console.error('Error sending comment:', error);
      toast.error('Izoh yuborishda xatolik');
    } finally {
      setSending(false);
    }
  };

  return (
    <Sheet open={!!videoId} onOpenChange={() => onClose()}>
      <SheetContent side="bottom" className="h-[80vh] flex flex-col">
        <SheetHeader>
          <SheetTitle>Izohlar</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Hali izohlar yo'q. Birinchi bo'lib izoh qoldiring!
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                {comment.user_profiles?.avatar_url ? (
                  <img
                    src={comment.user_profiles.avatar_url}
                    alt={comment.user_profiles.username || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-primary" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">
                      @{comment.user_profiles?.username || 'Anonymous'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                        locale: uz,
                      })}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Input
            placeholder="Izoh yozing..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendComment();
              }
            }}
            disabled={!user}
          />
          <Button
            onClick={handleSendComment}
            disabled={!comment.trim() || sending || !user}
            size="icon"
            className="gradient-primary"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
