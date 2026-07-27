import React from 'react';
import { Video, Sparkles, Layers, Plus, Compass, Key, Sun, Moon, DollarSign } from 'lucide-react';

interface HeaderProps {
  activeTab: 'studio' | 'queue' | 'gallery';
  setActiveTab: (tab: 'studio' | 'queue' | 'gallery') => void;
  activeQueueCount: number;
  credits: number;
  totalSpent: number;
  onNewProject: () => void;
  onOpenSettings: () => void;
  hasApiKey: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeQueueCount,
  credits: _credits,
  totalSpent,
  onNewProject,
  onOpenSettings,
  hasApiKey,
  theme,
  onToggleTheme
}) => {
  const initialCredit = 10.0;
  const remainingEstimate = Math.max(0, initialCredit - totalSpent);

  return (
    <header style={{
      height: '64px',
      borderBottom: '1px solid var(--border-light)',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(20px)',
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
          background: 'var(--text-primary)',
          color: 'var(--bg-dark)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <Video size={20} color="currentColor" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
              GOOD YUTE
            </span>
            <span className="badge badge-indigo" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
              AI Design LAB
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
        background: 'rgba(120, 120, 120, 0.08)',
        padding: '4px',
        borderRadius: '12px',
        border: '1px solid var(--border-light)'
      }}>
        <button
          onClick={() => setActiveTab('studio')}
          className="btn"
          style={{
            padding: '6px 14px',
            fontSize: '0.85rem',
            background: activeTab === 'studio' ? 'var(--text-primary)' : 'transparent',
            color: activeTab === 'studio' ? 'var(--bg-dark)' : 'var(--text-secondary)',
            boxShadow: activeTab === 'studio' ? '0 2px 10px rgba(0, 0, 0, 0.15)' : 'none'
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
            background: activeTab === 'queue' ? 'var(--text-primary)' : 'transparent',
            color: activeTab === 'queue' ? 'var(--bg-dark)' : 'var(--text-secondary)',
            position: 'relative'
          }}
        >
          <Layers size={15} />
          Render Queue
          {activeQueueCount > 0 && (
            <span style={{
              background: 'var(--accent-primary)',
              color: 'var(--bg-dark)',
              fontSize: '0.7rem',
              fontWeight: 800,
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
            background: activeTab === 'gallery' ? 'var(--text-primary)' : 'transparent',
            color: activeTab === 'gallery' ? 'var(--bg-dark)' : 'var(--text-secondary)'
          }}
        >
          <Compass size={15} />
          Showcase Gallery
        </button>
      </nav>

      {/* Right Controls: Theme Switcher, API Settings & Live Spend Counter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Dark/Light Theme Toggle */}
        <button
          className="btn btn-secondary"
          onClick={onToggleTheme}
          style={{ padding: '8px 12px' }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} color="#6366f1" />}
        </button>

        <button
          className="btn btn-secondary"
          onClick={onOpenSettings}
          style={{
            padding: '6px 12px',
            fontSize: '0.8rem',
            borderColor: hasApiKey ? 'var(--border-strong)' : 'var(--border-light)',
            color: 'var(--text-primary)'
          }}
        >
          <Key size={14} />
          {hasApiKey ? 'API Connected' : 'Connect API Key'}
        </button>

        {/* Real USD Live Spend & Credit Tracker */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '10px',
          background: 'rgba(120, 120, 120, 0.08)',
          border: '1px solid var(--border-light)',
          fontSize: '0.82rem'
        }}>
          <DollarSign size={15} color="var(--text-primary)" />
          <span style={{ color: 'var(--text-secondary)' }}>Spent:</span>
          <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>${totalSpent.toFixed(2)}</span>
          <span style={{ color: 'var(--text-muted)', margin: '0 2px' }}>|</span>
          <span style={{ color: 'var(--text-secondary)' }}>Credit:</span>
          <span style={{ fontWeight: 800, color: '#34d399' }}>${remainingEstimate.toFixed(2)}</span>
        </div>

        <button className="btn btn-primary" onClick={onNewProject} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          <Plus size={16} />
          New Generation
        </button>
      </div>
    </header>
  );
};
