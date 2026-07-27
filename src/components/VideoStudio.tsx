import React, { useState, useEffect, useRef } from 'react';
import {
  Wand2,
  Sparkles,
  Zap,
  RotateCcw,
  EyeOff,
  Image as ImageIcon,
  Music,
  Upload,
  FileVideo,
  Volume2,
  X,
  Link
} from 'lucide-react';
import { AI_MODELS, STYLE_PRESETS, CAMERA_MOTIONS } from '../data/mockVideos';

interface MediaAttachment {
  name: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  size?: string;
}

interface VideoStudioProps {
  onGenerate: (jobData: {
    prompt: string;
    negativePrompt: string;
    model: string;
    style: string;
    cameraMotion: string;
    aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
    duration: number;
    fps: number;
    seed: number;
  }) => void;
  isRendering: boolean;
  activePrompt?: string;
}

export const VideoStudio: React.FC<VideoStudioProps> = ({
  onGenerate,
  isRendering,
  activePrompt = ''
}) => {
  const [prompt, setPrompt] = useState(
    activePrompt ||
    'A cinematic FPV drone flight through a neon-lit cyberpunk alleyway in Tokyo, wet puddles reflecting holographic ads, ultra realistic 8k resolution'
  );
  const [negativePrompt, setNegativePrompt] = useState('blurry, low contrast, oversaturated, static, noise, text');
  const [showNegativePrompt, setShowNegativePrompt] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].id);
  const [selectedStyle, setSelectedStyle] = useState(STYLE_PRESETS[0].id);
  const [selectedCamera, setSelectedCamera] = useState(CAMERA_MOTIONS[0].id);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '4:5'>('16:9');
  const [duration, setDuration] = useState<number>(5);
  const [fps, setFps] = useState<number>(30);
  const [seed, setSeed] = useState<number>(89432109);

  // Enterprise features & Media Drag/Drop
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(true);
  const [enableAudioSFX, setEnableAudioSFX] = useState(true);
  const [characterAnchor, setCharacterAnchor] = useState('');

  // Drag & Drop Media state
  const [mediaAttachment, setMediaAttachment] = useState<MediaAttachment | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activePrompt) {
      setPrompt(activePrompt);
    }
  }, [activePrompt]);



  const handleMagicEnhance = () => {
    const styleObj = STYLE_PRESETS.find((s) => s.id === selectedStyle);
    const cameraObj = CAMERA_MOTIONS.find((c) => c.id === selectedCamera);
    const enhancer = `, ${cameraObj?.label || 'dynamic motion'}, ${styleObj?.promptSuffix || 'cinematic lighting, photorealistic, 8k resolution'}`;
    if (!prompt.includes('cinematic')) {
      setPrompt((prev) => prev.trim() + enhancer);
    }
  };

  const handleProcessFile = (file: File) => {
    let mediaType: 'image' | 'video' | 'audio' = 'image';
    if (file.type.startsWith('video/')) mediaType = 'video';
    else if (file.type.startsWith('audio/')) mediaType = 'audio';

    const objectUrl = URL.createObjectURL(file);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

    setMediaAttachment({
      name: file.name,
      type: mediaType,
      url: objectUrl,
      size: sizeMb
    });

    if (mediaType === 'image') {
      setImageUrl(objectUrl);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleRandomSeed = () => {
    setSeed(Math.floor(Math.random() * 90000000) + 10000000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onGenerate({
      prompt,
      negativePrompt,
      model: selectedModel,
      style: selectedStyle,
      cameraMotion: selectedCamera,
      aspectRatio,
      duration,
      fps,
      seed
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Studio Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wand2 size={20} color="#818cf8" />
            Prompt & Parameter Creator
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Configure neural parameters, motion paths, and model architectures.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleMagicEnhance}
          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
        >
          <Sparkles size={14} color="#ec4899" />
          Magic Enhance Prompt
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Main Prompt Textarea */}
        <div style={{ position: 'relative' }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Video Prompt
          </label>
          <textarea
            className="form-textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the video scene you want to create..."
            rows={4}
            style={{ paddingRight: '40px', lineHeight: '1.6' }}
          />
          <button
            type="button"
            onClick={() => setShowNegativePrompt(!showNegativePrompt)}
            style={{
              position: 'absolute',
              right: '12px',
              bottom: '12px',
              background: 'transparent',
              border: 'none',
              color: showNegativePrompt ? '#ec4899' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
            title="Toggle Negative Prompt"
          >
            <EyeOff size={16} />
          </button>
        </div>

        {/* Negative Prompt Collapsible */}
        {showNegativePrompt && (
          <div style={{ background: 'rgba(236, 72, 153, 0.05)', border: '1px solid rgba(236, 72, 153, 0.2)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#f472b6', marginBottom: '4px' }}>
              Negative Prompt (What to exclude)
            </label>
            <input
              type="text"
              className="form-input"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="e.g. low quality, blurry, text, grain"
              style={{ fontSize: '0.85rem' }}
            />
          </div>
        )}

        {/* AI Model Selection */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            AI Video Generation Model
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
            {AI_MODELS.map((m) => {
              const isSelected = selectedModel === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? '1px solid var(--accent-indigo)' : '1px solid var(--border-light)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isSelected ? '#fff' : 'var(--text-secondary)' }}>
                      {m.name}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {m.provider} • Free
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Style Presets */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Visual Style Presets
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {STYLE_PRESETS.map((style) => {
              const isSelected = selectedStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    border: isSelected ? '1px solid var(--accent-indigo)' : '1px solid var(--border-light)',
                    background: isSelected ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.04)',
                    color: isSelected ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {style.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Camera Motion Matrix */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Camera Motion Dynamics
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
            {CAMERA_MOTIONS.map((cam) => {
              const isSelected = selectedCamera === cam.id;
              return (
                <div
                  key={cam.id}
                  onClick={() => setSelectedCamera(cam.id)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? '1px solid var(--accent-violet)' : '1px solid var(--border-light)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: isSelected ? '#fff' : 'var(--text-secondary)' }}>
                    {cam.label}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {cam.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technical Specs: Aspect Ratio & Duration */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Aspect Ratio */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Aspect Ratio
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['16:9', '9:16', '1:1', '4:5'] as const).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: aspectRatio === ratio ? '1px solid var(--accent-indigo)' : '1px solid var(--border-light)',
                    background: aspectRatio === ratio ? 'rgba(99, 102, 241, 0.2)' : 'rgba(0, 0, 0, 0.3)',
                    color: aspectRatio === ratio ? '#fff' : 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Duration & FPS */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Duration
              </label>
              <select
                className="form-select"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              >
                <option value={3}>3 Seconds</option>
                <option value={5}>5 Seconds</option>
                <option value={10}>10 Seconds</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                FPS
              </label>
              <select
                className="form-select"
                value={fps}
                onChange={(e) => setFps(Number(e.target.value))}
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              >
                <option value={24}>24 FPS</option>
                <option value={30}>30 FPS</option>
                <option value={60}>60 FPS</option>
              </select>
            </div>
          </div>
        </div>

        {/* Seed Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
              Random Seed Number
            </label>
            <input
              type="number"
              className="form-input"
              value={seed}
              onChange={(e) => setSeed(Number(e.target.value))}
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
            />
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleRandomSeed}
            style={{ marginTop: '18px', padding: '8px 12px' }}
            title="Randomize Seed"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Enterprise Pro Toggles & Drag/Drop Media Zone */}
        <div style={{ background: 'rgba(120, 120, 120, 0.04)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Upload size={16} />
              Input Media (Image / Video / Sound)
            </span>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowImageInput(!showImageInput)}
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            >
              {showImageInput ? 'Hide Box' : 'Show Media Box'}
            </button>
          </div>

          {showImageInput && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: isDragging ? '2px dashed var(--text-primary)' : '2px dashed var(--border-strong)',
                  borderRadius: '10px',
                  padding: '20px 16px',
                  textAlign: 'center',
                  background: isDragging ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*,audio/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleProcessFile(e.target.files[0]);
                    }
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ImageIcon size={18} color="var(--text-secondary)" />
                  <FileVideo size={18} color="var(--text-secondary)" />
                  <Volume2 size={18} color="var(--text-secondary)" />
                </div>

                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Drag & Drop Image, Video, or Audio file here
                  </span>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    or click to browse local files (.png, .jpg, .mp4, .mov, .mp3)
                  </span>
                </div>
              </div>

              {/* Active Media Preview Attachment Card */}
              {mediaAttachment && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-glass-hover)',
                  border: '1px solid var(--border-strong)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                    {mediaAttachment.type === 'image' && (
                      <img src={mediaAttachment.url} alt="Keyframe Preview" style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                    )}
                    {mediaAttachment.type === 'video' && <FileVideo size={20} color="var(--text-primary)" />}
                    {mediaAttachment.type === 'audio' && <Volume2 size={20} color="var(--text-primary)" />}
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>
                        {mediaAttachment.name}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {mediaAttachment.type.toUpperCase()} • {mediaAttachment.size || 'Local File'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setMediaAttachment(null);
                      setImageUrl('');
                    }}
                    style={{ padding: '4px 8px' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* URL Input Fallback */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <Link size={14} color="var(--text-muted)" />
                <input
                  type="text"
                  className="form-input"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Or paste starting keyframe media URL (e.g. https://...)"
                  style={{ fontSize: '0.82rem', padding: '8px 12px' }}
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Music size={15} color="#ec4899" />
              Auto AI Cinematic Audio & SFX
            </span>
            <input
              type="checkbox"
              checked={enableAudioSFX}
              onChange={(e) => setEnableAudioSFX(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--accent-indigo)', cursor: 'pointer' }}
            />
          </div>

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
              Character Face Anchor Tag (Consistency)
            </label>
            <input
              type="text"
              className="form-input"
              value={characterAnchor}
              onChange={(e) => setCharacterAnchor(e.target.value)}
              placeholder="e.g. character_id: man_motel_actor_01"
              style={{ fontSize: '0.82rem' }}
            />
          </div>
        </div>

        {/* Submit Generation Button */}
        <button
          type="submit"
          disabled={isRendering || !prompt.trim()}
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '1rem',
            marginTop: '8px',
            opacity: isRendering || !prompt.trim() ? 0.6 : 1
          }}
        >
          {isRendering ? (
            <>
              <Sparkles className="spin" size={20} />
              Generating AI Video Clip...
            </>
          ) : (
            <>
              <Zap size={20} />
              Generate AI Video (Free / Unlimited)
            </>
          )}
        </button>
      </form>
    </div>
  );
};
