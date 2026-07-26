import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VideoStudio } from './components/VideoStudio';
import { VideoCanvas } from './components/VideoCanvas';
import { GenerationQueue } from './components/GenerationQueue';
import { VideoGallery } from './components/VideoGallery';
import { MOCK_VIDEOS, type VideoItem, type RenderJob } from './data/mockVideos';
import { Sparkles } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'queue' | 'gallery'>('studio');
  const [videos, setVideos] = useState<VideoItem[]>(MOCK_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(MOCK_VIDEOS[0]);
  const [credits] = useState<number>(999999);
  const [activePromptForStudio, setActivePromptForStudio] = useState<string>('');

  // Queue of active render jobs
  const [renderJobs, setRenderJobs] = useState<RenderJob[]>([
    {
      id: 'job-init-1',
      title: 'Neon Cyberpunk Metropolis 2099',
      prompt: 'Ultra-detailed cinematic FPV drone shot flying through a rain-slicked futuristic Neo-Tokyo neon street',
      model: 'Sora v2',
      style: 'Cyberpunk',
      aspectRatio: '16:9',
      duration: 5,
      progress: 100,
      status: 'completed',
      currentStage: 'Render Complete',
      estimatedTimeLeft: 0,
      createdAt: 'Just now'
    }
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Simulated render loop for processing jobs
  useEffect(() => {
    const timer = setInterval(() => {
      setRenderJobs((prevJobs) =>
        prevJobs.map((job) => {
          if (job.status === 'processing') {
            const nextProgress = Math.min(100, job.progress + 15);
            let stage = 'Latent Diffusion Sampling...';
            if (nextProgress > 40) stage = 'Motion Frame Interpolation...';
            if (nextProgress > 75) stage = '4K Upscaling & Color Grading...';

            if (nextProgress === 100) {
              showToast(`🎉 Video Render Complete: "${job.title}"`);
              return {
                ...job,
                progress: 100,
                status: 'completed',
                currentStage: 'Render Complete',
                estimatedTimeLeft: 0
              };
            }

            return {
              ...job,
              progress: nextProgress,
              currentStage: stage,
              estimatedTimeLeft: Math.max(0, Math.ceil((100 - nextProgress) / 15) * 2)
            };
          }
          return job;
        })
      );
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  const handleGenerate = (jobData: {
    prompt: string;
    negativePrompt: string;
    model: string;
    style: string;
    cameraMotion: string;
    aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
    duration: number;
    fps: number;
    seed: number;
  }) => {
    // Unlimited generations - no credit restriction!

    const newJob: RenderJob = {
      id: `job-${Date.now()}`,
      title: jobData.prompt.slice(0, 30) + '...',
      prompt: jobData.prompt,
      model: jobData.model,
      style: jobData.style,
      aspectRatio: jobData.aspectRatio,
      duration: jobData.duration,
      progress: 10,
      status: 'processing',
      currentStage: 'Parsing Prompt & Model Embeddings...',
      estimatedTimeLeft: 12,
      createdAt: 'Just now'
    };

    setRenderJobs((prev) => [newJob, ...prev]);

    // Also insert into video gallery preview once complete
    const newVid: VideoItem = {
      id: `vid-${Date.now()}`,
      title: jobData.prompt.slice(0, 35) + '...',
      prompt: jobData.prompt,
      negativePrompt: jobData.negativePrompt,
      model: jobData.model,
      style: jobData.style,
      duration: jobData.duration,
      fps: jobData.fps,
      aspectRatio: jobData.aspectRatio,
      resolution: '4K',
      cameraMotion: jobData.cameraMotion,
      seed: jobData.seed,
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-neon-lights-and-flying-vehicles-42934-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      tags: [jobData.style, '4K', jobData.aspectRatio],
      createdAt: 'Just now',
      likes: 1,
      views: 12,
      creator: {
        name: 'You (Creator)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      }
    };

    setVideos((prev) => [newVid, ...prev]);
    setSelectedVideo(newVid);
    showToast('🚀 Render job queued! Check Render Queue.');
  };

  const handleCancelJob = (id: string) => {
    setRenderJobs((prev) => prev.filter((j) => j.id !== id));
    showToast('Job cancelled.');
  };

  const handleViewJob = (job: RenderJob) => {
    const match = videos.find((v) => v.prompt === job.prompt);
    if (match) {
      setSelectedVideo(match);
    }
    setActiveTab('studio');
  };

  const handleRemixPrompt = (promptText: string) => {
    setActivePromptForStudio(promptText);
    setActiveTab('studio');
    showToast('✨ Prompt copied to Studio!');
  };

  return (
    <div className="app-container">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeQueueCount={renderJobs.filter((j) => j.status === 'processing').length}
        credits={credits}
        onNewProject={() => {
          setActiveTab('studio');
          setActivePromptForStudio('');
        }}
      />

      {/* Notification Toast */}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'rgba(14, 18, 27, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--accent-indigo)',
          boxShadow: 'var(--shadow-glow)',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          color: '#fff',
          fontWeight: 600,
          fontSize: '0.88rem',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Sparkles size={16} color="#818cf8" />
          {notification}
        </div>
      )}

      {/* Main Body */}
      <main style={{
        flex: 1,
        padding: '24px',
        maxWidth: '1600px',
        margin: '0 auto',
        width: '100%',
        overflowY: 'auto'
      }}>
        {activeTab === 'studio' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(340px, 480px) 1fr',
            gap: '24px',
            alignItems: 'start'
          }}>
            {/* Left Sidebar: Studio Form */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <VideoStudio
                onGenerate={handleGenerate}
                isRendering={renderJobs.some((j) => j.status === 'processing')}
                activePrompt={activePromptForStudio}
              />
            </div>

            {/* Right Main: Canvas Player */}
            <div style={{ height: 'calc(100vh - 120px)', minHeight: '500px' }}>
              <VideoCanvas
                video={selectedVideo}
                onRemix={handleRemixPrompt}
              />
            </div>
          </div>
        )}

        {activeTab === 'queue' && (
          <div style={{ maxWidth: '840px', margin: '0 auto' }}>
            <GenerationQueue
              jobs={renderJobs}
              onCancelJob={handleCancelJob}
              onViewJob={handleViewJob}
            />
          </div>
        )}

        {activeTab === 'gallery' && (
          <div>
            <VideoGallery
              videos={videos}
              onSelectVideo={(vid) => {
                setSelectedVideo(vid);
                setActiveTab('studio');
              }}
              onRemixPrompt={handleRemixPrompt}
            />
          </div>
        )}
      </main>
    </div>
  );
}
