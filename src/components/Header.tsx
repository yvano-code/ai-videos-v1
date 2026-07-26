import React from 'react';
import { Video, Sparkles, Layers, Cpu, Plus, Compass } from 'lucide-react';

interface HeaderProps {
  activeTab: 'studio' | 'queue' | 'gallery';
  setActiveTab: (tab: 'studio' | 'queue' | 'gallery') => void;
  activeQueueCount: number;
  credits: number;
  onNewProject: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeQueueCount,
  credits,
  onNewProject
}) => {
  return (
    <header style={{
      height: '64px',
      borderBottom: '1px solid var(--border-light)',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('studio')}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'var(--gradient-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <Video size={20} color="#fff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', color: '#fff' }}>
              AI Videos
            </span>
            <span className="badge badge-indigo" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
              v1.0
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Next-Gen Neural Cinema Studio
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.4)',
        padding: '4px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)'
      }}>
        <button
          onClick={() => setActiveTab('studio')}
          className="btn"
          style={{
            padding: '6px 14px',
            fontSize: '0.85rem',
            background: activeTab === 'studio' ? 'var(--gradient-primary)' : 'transparent',
            color: activeTab === 'studio' ? '#fff' : 'var(--text-secondary)',
            boxShadow: activeTab === 'studio' ? '0 2px 10px rgba(99, 102, 241, 0.4)' : 'none'
          }}
        >
          <Sparkles size={15} />
          Studio Workspace
        </button>

        <button
          onClick={() => setActiveTab('queue')}
          className="btn"
          style={{
            padding: '6px 14px',
            fontSize: '0.85rem',
            background: activeTab === 'queue' ? 'var(--gradient-primary)' : 'transparent',
            color: activeTab === 'queue' ? '#fff' : 'var(--text-secondary)',
            position: 'relative'
          }}
        >
          <Layers size={15} />
          Render Queue
          {activeQueueCount > 0 && (
            <span style={{
              background: '#ec4899',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: '99px',
              marginLeft: '4px'
            }}>
              {activeQueueCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className="btn"
          style={{
            padding: '6px 14px',
            fontSize: '0.85rem',
            background: activeTab === 'gallery' ? 'var(--gradient-primary)' : 'transparent',
            color: activeTab === 'gallery' ? '#fff' : 'var(--text-secondary)'
          }}
        >
          <Compass size={15} />
          Showcase Gallery
        </button>
      </nav>

      {/* Right Controls: GPU Credits & Action */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          fontSize: '0.82rem'
        }}>
          <Cpu size={16} color="#818cf8" />
          <span style={{ color: 'var(--text-secondary)' }}>GPU Credits:</span>
          <span style={{ fontWeight: 700, color: '#fff' }}>{credits}</span>
        </div>

        <button className="btn btn-primary" onClick={onNewProject} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          <Plus size={16} />
          New Generation
        </button>
      </div>
    </header>
  );
};
