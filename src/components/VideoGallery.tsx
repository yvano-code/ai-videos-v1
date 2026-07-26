import React, { useState } from 'react';
import { Search, Heart, Eye, Sparkles } from 'lucide-react';
import type { VideoItem } from '../data/mockVideos';

interface VideoGalleryProps {
  videos: VideoItem[];
  onSelectVideo: (video: VideoItem) => void;
  onRemixPrompt: (prompt: string) => void;
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({
  videos,
  onSelectVideo,
  onRemixPrompt
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState<string>('All');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const tags = ['All', 'Cyberpunk', 'Sci-Fi', 'Nature', 'Ocean', 'Anime', '4K'];

  const filteredVideos = videos.filter((vid) => {
    const matchesSearch =
      vid.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vid.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = activeTag === 'All' || vid.tags.includes(activeTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Search & Tag Filter Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            <input
              type="text"
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search AI prompts, styles, or keywords..."
              style={{ paddingLeft: '42px' }}
            />
          </div>
        </div>

        {/* Tags Row */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: activeTag === tag ? '1px solid var(--accent-indigo)' : '1px solid var(--border-light)',
                background: activeTag === tag ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.04)',
                color: activeTag === tag ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {filteredVideos.map((video) => {
          const isHovered = hoveredId === video.id;

          return (
            <div
              key={video.id}
              className="glass-panel glass-panel-interactive"
              onMouseEnter={() => setHoveredId(video.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectVideo(video)}
              style={{
                cursor: 'pointer',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Thumbnail / Video Container */}
              <div style={{ position: 'relative', height: '180px', background: '#000' }}>
                {isHovered ? (
                  <video
                    src={video.videoUrl}
                    autoPlay
                    muted
                    loop
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}

                {/* Aspect Ratio Badge */}
                <span style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(0,0,0,0.65)',
                  backdropFilter: 'blur(4px)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  color: '#fff',
                  fontWeight: 700
                }}>
                  {video.aspectRatio}
                </span>

                {/* Duration Badge */}
                <span style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  background: 'rgba(0,0,0,0.7)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  color: '#fff',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {video.duration}s
                </span>
              </div>

              {/* Card Meta & Prompt */}
              <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                    {video.title}
                  </h4>
                  <p style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '1.4',
                    marginBottom: '12px'
                  }}>
                    {video.prompt}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Heart size={13} color="#f472b6" />
                      {video.likes}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={13} />
                      {video.views}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-accent"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemixPrompt(video.prompt);
                    }}
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  >
                    <Sparkles size={12} />
                    Remix
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
