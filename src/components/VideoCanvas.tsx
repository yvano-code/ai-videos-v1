import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Copy,
  Sparkles,
  Check,
  Film,
  Activity
} from 'lucide-react';
import type { VideoItem } from '../data/mockVideos';

interface VideoCanvasProps {
  video: VideoItem | null;
  onRemix: (prompt: string) => void;
}

export const VideoCanvas: React.FC<VideoCanvasProps> = ({ video, onRemix }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(5);
  const [isMuted, setIsMuted] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [activeResolution, setActiveResolution] = useState<'720p' | '1080p' | '4K'>('4K');

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [video?.id, video?.videoUrl]);

  if (!video) {
    return (
      <div className="glass-panel" style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        textAlign: 'center'
      }}>
        <Film size={48} color="var(--accent-indigo)" style={{ opacity: 0.5, marginBottom: '16px' }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
          No Video Loaded
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '320px' }}>
          Generate a video in the Studio workspace or select a clip from the Showcase gallery to preview.
        </p>
      </div>
    );
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || video.duration);
    }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(video.prompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleExport = async () => {
    try {
      const response = await fetch(video.videoUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${video.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(video.videoUrl, '_blank');
    }
  };

  return (
    <div className="glass-panel" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden'
    }}>
      {/* Canvas Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(0, 0, 0, 0.2)'
      }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
            {video.title}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Model: <strong style={{ color: '#fff' }}>{video.model}</strong></span>
            <span>•</span>
            <span>Ratio: <strong style={{ color: '#fff' }}>{video.aspectRatio}</strong></span>
            <span>•</span>
            <span>Camera: <strong style={{ color: '#fff' }}>{video.cameraMotion}</strong></span>
          </div>
        </div>

        {/* Resolution Selector Pill */}
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(0, 0, 0, 0.4)', padding: '3px', borderRadius: 'var(--radius-sm)' }}>
          {(['720p', '1080p', '4K'] as const).map((res) => (
            <button
              key={res}
              onClick={() => setActiveResolution(res)}
              style={{
                background: activeResolution === res ? 'var(--gradient-primary)' : 'transparent',
                color: activeResolution === res ? '#fff' : 'var(--text-muted)',
                border: 'none',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.7rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {res}
            </button>
          ))}
        </div>
      </div>

      {/* Video Viewport Container */}
      <div style={{
        flex: 1,
        position: 'relative',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '340px'
      }}>
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnailUrl}
          loop
          muted={isMuted}
          playsInline
          autoPlay
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={(e) => {
            // Fallback video URL if current link has loading issues
            const target = e.currentTarget;
            if (!target.src.includes('BigBuckBunny')) {
              target.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
              target.play().catch(() => {});
            }
          }}
          onClick={togglePlay}
          style={{
            width: '100%',
            height: '100%',
            maxHeight: '440px',
            objectFit: video.aspectRatio === '9:16' ? 'contain' : 'cover',
            cursor: 'pointer'
          }}
        />

        {/* Play Overlay Button if paused */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            style={{
              position: 'absolute',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.85)',
              border: 'none',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-glow)',
              backdropFilter: 'blur(8px)',
              transition: 'transform 0.2s ease'
            }}
          >
            <Play size={28} style={{ marginLeft: '4px' }} />
          </button>
        )}

        {/* Camera Motion Overlay Badge */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '6px 12px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.75rem',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Activity size={14} color="#818cf8" />
          <span>{video.cameraMotion}</span>
        </div>
      </div>

      {/* Video Controls & Timeline Scrubbing Bar */}
      <div style={{
        padding: '16px 20px',
        background: 'rgba(14, 18, 27, 0.9)',
        borderTop: '1px solid var(--border-light)'
      }}>
        {/* Timeline Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            {currentTime.toFixed(1)}s
          </span>
          <input
            type="range"
            min={0}
            max={duration || 5}
            step={0.1}
            value={currentTime}
            onChange={handleScrub}
            style={{
              flex: 1,
              accentColor: 'var(--accent-indigo)',
              cursor: 'pointer'
            }}
          />
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            {(duration || 5).toFixed(1)}s
          </span>
        </div>

        {/* Action Controls & Metadata Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="btn btn-secondary" onClick={togglePlay} style={{ padding: '8px 12px' }}>
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button className="btn btn-secondary" onClick={() => setIsMuted(!isMuted)} style={{ padding: '8px 12px' }}>
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="btn btn-secondary" onClick={handleCopyPrompt} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
              {isCopied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              {isCopied ? 'Copied Prompt' : 'Copy Prompt'}
            </button>

            <button
              className="btn btn-accent"
              onClick={() => onRemix(video.prompt)}
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              <Sparkles size={14} />
              Remix Prompt
            </button>

            <button
              onClick={handleExport}
              className="btn btn-primary"
              style={{ fontSize: '0.8rem', padding: '6px 14px' }}
            >
              <Download size={14} />
              Export MP4
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
