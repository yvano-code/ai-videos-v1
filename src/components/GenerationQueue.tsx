import React from 'react';
import { Layers, Cpu, X, ArrowRight } from 'lucide-react';
import type { RenderJob } from '../data/mockVideos';

interface GenerationQueueProps {
  jobs: RenderJob[];
  onCancelJob: (id: string) => void;
  onViewJob: (job: RenderJob) => void;
}

export const GenerationQueue: React.FC<GenerationQueueProps> = ({
  jobs,
  onCancelJob,
  onViewJob
}) => {
  if (jobs.length === 0) {
    return (
      <div className="glass-panel" style={{
        padding: '40px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Layers size={48} color="var(--accent-indigo)" style={{ opacity: 0.4, marginBottom: '12px' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
          Render Queue Empty
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '300px' }}>
          No active video render tasks. Submit a prompt in the Studio workspace to start generating.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={20} color="#818cf8" />
            Neural Render Pipeline
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Real-time multi-stage diffusion render progress monitor.
          </p>
        </div>
        <span className="badge badge-indigo">
          {jobs.filter((j) => j.status === 'processing').length} Active Processing
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {jobs.map((job) => {
          const isDone = job.status === 'completed';
          return (
            <div
              key={job.id}
              className="glass-panel"
              style={{
                padding: '16px',
                borderLeft: isDone
                  ? '4px solid #10b981'
                  : '4px solid var(--accent-indigo)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ flex: 1, paddingRight: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                      {job.title}
                    </span>
                    <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>
                      {job.model}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    "{job.prompt}"
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isDone ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => onViewJob(job)}
                      style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                    >
                      View Video
                      <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button
                      className="btn btn-secondary"
                      onClick={() => onCancelJob(job.id)}
                      style={{ padding: '6px', color: '#f87171' }}
                      title="Cancel Job"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar & Stage */}
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px' }}>
                  <span style={{ color: isDone ? '#34d399' : '#818cf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {!isDone && <span className="pulse-dot" />}
                    {job.currentStage}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fff' }}>
                    {job.progress}%
                  </span>
                </div>

                {/* Outer Track */}
                <div style={{
                  height: '8px',
                  borderRadius: '99px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div
                    className={!isDone ? 'shimmer-progress' : ''}
                    style={{
                      height: '100%',
                      width: `${job.progress}%`,
                      background: isDone ? 'linear-gradient(90deg, #10b981, #34d399)' : undefined,
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
