import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Upload, Loader2, Video } from 'lucide-react';

type UploadFormProps = {
  onSuccess: () => void;
};

export function UploadForm({ onSuccess }: UploadFormProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast.error('Faqat video fayllar ruxsat etilgan');
      return;
    }

    // Validate file size (max 500MB)
    if (file.size > 500 * 1024 * 1024) {
      toast.error('Video hajmi 500MB dan oshmasligi kerak');
      return;
    }

    setVideoFile(file);
  };

  const handleUpload = async () => {
    if (!user || !videoFile || !title.trim()) {
      toast.error('Barcha maydonlarni to\'ldiring');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Upload video to storage
      const fileName = `${user.id}/${Date.now()}_${videoFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, videoFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      setProgress(50);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      setProgress(75);

      // Create video record
      const { error: dbError } = await supabase.from('videos').insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        video_url: publicUrl,
      });

      if (dbError) throw dbError;

      setProgress(100);
      toast.success('Video muvaffaqiyatli yuklandi!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setVideoFile(null);
      onSuccess();
    } catch (error: any) {
      console.error('Error uploading video:', error);
      toast.error(error.message || 'Video yuklashda xatolik');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <Video className="w-16 h-16 text-muted-foreground mb-4" />
        <p className="text-lg font-semibold mb-2">Video yuklash</p>
        <p className="text-sm text-muted-foreground">
          Video yuklash uchun tizimga kiring
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Video yuklash</h2>
          <p className="text-sm text-muted-foreground">
            Videolaringizni jamiyat bilan baham ko'ring
          </p>
        </div>

        <div className="space-y-4">
          {/* Video upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Video</label>
            <div className="relative">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
                id="video-upload"
                disabled={uploading}
              />
              <label
                htmlFor="video-upload"
                className="flex flex-col items-center justify-center gap-2 glass-effect border-2 border-dashed rounded-lg p-8 cursor-pointer hover:border-primary transition-colors"
              >
                {videoFile ? (
                  <>
                    <Video className="w-12 h-12 text-primary" />
                    <span className="font-medium">{videoFile.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-muted-foreground" />
                    <span className="font-medium">Video tanlang</span>
                    <span className="text-sm text-muted-foreground">
                      Maksimal hajm: 500MB
                    </span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Sarlavha</label>
            <Input
              placeholder="Video sarlavhasini kiriting"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={uploading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Ta'rif</label>
            <Textarea
              placeholder="Video haqida qisqacha ma'lumot..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              disabled={uploading}
            />
          </div>

          {/* Upload progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full gradient-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-center text-muted-foreground">
                Yuklanmoqda... {progress}%
              </p>
            </div>
          )}

          {/* Submit button */}
          <Button
            onClick={handleUpload}
            disabled={!videoFile || !title.trim() || uploading}
            className="w-full gradient-primary"
            size="lg"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Yuklanmoqda...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Video yuklash
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
