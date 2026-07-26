import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  Zap,
  RotateCcw,
  EyeOff
} from 'lucide-react';
import { AI_MODELS, STYLE_PRESETS, CAMERA_MOTIONS } from '../data/mockVideos';

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

  const currentModelData = AI_MODELS.find((m) => m.id === selectedModel) || AI_MODELS[0];

  const handleMagicEnhance = () => {
    const styleObj = STYLE_PRESETS.find((s) => s.id === selectedStyle);
    const cameraObj = CAMERA_MOTIONS.find((c) => c.id === selectedCamera);
    const enhancer = `, ${cameraObj?.label || 'dynamic motion'}, ${styleObj?.promptSuffix || 'cinematic lighting, photorealistic, 8k resolution'}`;
    if (!prompt.includes('cinematic')) {
      setPrompt((prev) => prev.trim() + enhancer);
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
                    {m.provider} • {m.cost} Credits
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
              Generate AI Video ({currentModelData.cost} Credits)
            </>
          )}
        </button>
      </form>
    </div>
  );
};
