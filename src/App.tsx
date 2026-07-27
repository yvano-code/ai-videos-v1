import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VideoStudio } from './components/VideoStudio';
import { VideoCanvas } from './components/VideoCanvas';
import { GenerationQueue } from './components/GenerationQueue';
import { VideoGallery } from './components/VideoGallery';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import { MOCK_VIDEOS, AI_MODELS, type VideoItem, type RenderJob } from './data/mockVideos';
import { Sparkles } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'queue' | 'gallery'>('studio');
  const [videos, setVideos] = useState<VideoItem[]>(MOCK_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(MOCK_VIDEOS[0]);
  const [credits] = useState<number>(999999);
  const [activePromptForStudio, setActivePromptForStudio] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('AI_VIDEO_API_KEY') || '');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

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

  const [totalSpent, setTotalSpent] = useState<number>(() => {
    return Number(localStorage.getItem('AI_VIDEO_TOTAL_SPENT')) || 0;
  });

  const updateSpend = (cost: number) => {
    setTotalSpent((prev) => {
      const updated = prev + cost;
      localStorage.setItem('AI_VIDEO_TOTAL_SPENT', updated.toString());
      return updated;
    });
  };

  const handleGenerate = async (jobData: {
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
    // Model price tracking
    const modelObj = AI_MODELS.find((m) => m.id === jobData.model);
    const cost = modelObj?.priceNum || 0.05;
    updateSpend(cost);

    const newJobId = `job-${Date.now()}`;
    const newJob: RenderJob = {
      id: newJobId,
      title: jobData.prompt.slice(0, 30) + '...',
      prompt: jobData.prompt,
      model: jobData.model,
      style: jobData.style,
      aspectRatio: jobData.aspectRatio,
      duration: jobData.duration,
      progress: 10,
      status: 'processing',
      currentStage: apiKey ? 'Submitting to Fal.ai Hunyuan API...' : 'Parsing Prompt & Model Embeddings...',
      estimatedTimeLeft: 12,
      createdAt: 'Just now'
    };

    setRenderJobs((prev) => [newJob, ...prev]);

    // Check if live Fal API key is connected
    if (apiKey) {
      showToast(`⚡ Submitting to Fal.ai (${jobData.model}) — Cost: $${cost.toFixed(3)}`);
      try {
        const endpoint = modelObj?.endpoint || 'fal-ai/hunyuan-video';
        const res = await fetch(`https://fal.run/${endpoint}`, {
          method: 'POST',
          headers: {
            'Authorization': `Key ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prompt: jobData.prompt,
            aspect_ratio: jobData.aspectRatio,
            duration: jobData.duration
          })
        });

        if (res.ok) {
          const data = await res.json();
          const videoUrl = data?.video?.url || data?.video_url;
          if (videoUrl) {
            const liveVid: VideoItem = {
              id: `vid-${Date.now()}`,
              title: jobData.prompt.slice(0, 35) + '...',
              prompt: jobData.prompt,
              negativePrompt: jobData.negativePrompt,
              model: jobData.model,
              style: jobData.style,
              cameraMotion: jobData.cameraMotion,
              videoUrl: videoUrl,
              thumbnailUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
              duration: jobData.duration,
              aspectRatio: jobData.aspectRatio,
              fps: jobData.fps,
              seed: jobData.seed,
              resolution: '1080p',
              tags: [jobData.style, 'GOOD YUTE', jobData.aspectRatio],
              likes: 1,
              views: 1,
              creator: {
                name: 'GOOD YUTE Creator',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
              },
              createdAt: 'Just now'
            };
            setVideos((prev) => [liveVid, ...prev]);
            setSelectedVideo(liveVid);
            showToast('🎉 Live Fal.ai HunyuanVideo Rendered Successfully!');
            return;
          }
        }
      } catch (err) {
        console.warn('Fal API call fallback to preview studio:', err);
      }
    } else {
      showToast(`🚀 Render Started ($${cost.toFixed(3)} added to spend meter). Connect API key in top right to go live!`);
    }

    // Default studio preview fallback item
    const newVid: VideoItem = {
      id: `vid-${Date.now()}`,
      title: jobData.prompt.slice(0, 35) + '...',
      prompt: jobData.prompt,
      negativePrompt: jobData.negativePrompt,
      model: jobData.model,
      style: jobData.style,
      cameraMotion: jobData.cameraMotion,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
      duration: jobData.duration,
      aspectRatio: jobData.aspectRatio,
      fps: jobData.fps,
      seed: jobData.seed,
      resolution: '1080p',
      tags: [jobData.style, 'GOOD YUTE', jobData.aspectRatio],
      likes: 1,
      views: 1,
      creator: {
        name: 'GOOD YUTE Creator',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      },
      createdAt: 'Just now'
    };

    setVideos((prev) => [newVid, ...prev]);
    setSelectedVideo(newVid);
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

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('AI_VIDEO_API_KEY', key);
    if (key) {
      showToast('🔑 Fal.ai / Replicate API Key connected!');
    } else {
      showToast('API Key disconnected.');
    }
  };

  return (
    <div className="app-container">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeQueueCount={renderJobs.filter((j) => j.status === 'processing').length}
        credits={credits}
        totalSpent={totalSpent}
        onNewProject={() => {
          setActiveTab('studio');
          setActivePromptForStudio('');
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasApiKey={!!apiKey}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <ApiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaveKey={handleSaveApiKey}
        currentKey={apiKey}
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
