export interface VideoItem {
  id: string;
  title: string;
  prompt: string;
  negativePrompt: string;
  model: string;
  style: string;
  duration: number; // in seconds
  fps: number;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
  resolution: '720p' | '1080p' | '4K';
  cameraMotion: string;
  seed: number;
  videoUrl: string;
  thumbnailUrl: string;
  tags: string[];
  createdAt: string;
  likes: number;
  views: number;
  creator: {
    name: string;
    avatar: string;
  };
}

export interface RenderJob {
  id: string;
  title: string;
  prompt: string;
  model: string;
  style: string;
  aspectRatio: string;
  duration: number;
  progress: number; // 0 to 100
  status: 'queued' | 'processing' | 'completed' | 'failed';
  currentStage: string;
  estimatedTimeLeft: number; // seconds
  createdAt: string;
  previewUrl?: string;
}

export const MOCK_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'Neon Cyberpunk Metropolis 2099',
    prompt: 'Ultra-detailed cinematic FPV drone shot flying through a rain-slicked futuristic Neo-Tokyo neon street, reflection of holographic billboards on puddle water, volumetric fog, dramatic lighting, 8k resolution, photorealistic Unreal Engine 5 render',
    negativePrompt: 'blurry, low quality, distortion, noise, text watermarks, choppy frame rate',
    model: 'Sora v2',
    style: 'Cyberpunk',
    duration: 10,
    fps: 60,
    aspectRatio: '16:9',
    resolution: '4K',
    cameraMotion: 'FPV Drone Forward',
    seed: 89432109,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
    tags: ['Cyberpunk', 'Sci-Fi', 'City', '4K'],
    createdAt: '2 hours ago',
    likes: 1420,
    views: 8920,
    creator: {
      name: 'AetherVisuals',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    }
  },
  {
    id: 'vid-2',
    title: 'Cosmic Nebula Wormhole Journey',
    prompt: 'Hyper-speed motion graphics traveling through a glowing golden and indigo interstellar nebula, swirling cosmic gas clouds, twinkling star clusters, 60fps ultra smooth camera flight, interstellar atmosphere',
    negativePrompt: 'pixelated, oversaturated, static, dark blocks',
    model: 'Runway Gen-3 Alpha',
    style: 'Sci-Fi Epic',
    duration: 15,
    fps: 60,
    aspectRatio: '16:9',
    resolution: '4K',
    cameraMotion: 'Continuous Forward Zoom',
    seed: 4410293,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    tags: ['Sci-Fi', 'Space', 'Cosmic', 'Hyperspeed'],
    createdAt: '5 hours ago',
    likes: 2840,
    views: 14200,
    creator: {
      name: 'NebulaLab',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    }
  },
  {
    id: 'vid-3',
    title: 'Emerald Forest Mist & Sunbeams',
    prompt: 'Breathtaking 8K documentary slow motion dolly shot in a sunlit ancient pine forest, golden rays piercing through morning fog, floating dust particles in light beams, vibrant emerald moss on trees',
    negativePrompt: 'overexposed, blurry, shaky cam, artifacts',
    model: 'Luma Dream Machine',
    style: 'Hyper-realistic',
    duration: 12,
    fps: 30,
    aspectRatio: '16:9',
    resolution: '1080p',
    cameraMotion: 'Slow Dolly Right',
    seed: 7651239,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    tags: ['Nature', 'Cinematic', 'Documentary', 'Forest'],
    createdAt: '1 day ago',
    likes: 980,
    views: 6100,
    creator: {
      name: 'BioCine',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
    }
  },
  {
    id: 'vid-4',
    title: 'Bioluminescent Deep Sea Realm',
    prompt: 'Surreal underwater macro shot of glowing glowing jellyfish floating in deep dark ocean water, neon violet and turquoise bioluminescence pulsing gracefully, 4k resolution, octane render style',
    negativePrompt: 'muddy color, low contrast, grain, compression artifacts',
    model: 'Flux Video',
    style: '3D Fantasy',
    duration: 10,
    fps: 30,
    aspectRatio: '9:16',
    resolution: '1080p',
    cameraMotion: 'Orbit Slow',
    seed: 9021482,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    tags: ['Ocean', 'Fantasy', 'TikTok/Reels', 'Bioluminescent'],
    createdAt: '2 days ago',
    likes: 3120,
    views: 18900,
    creator: {
      name: 'DeepOceanAI',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    }
  },
  {
    id: 'vid-5',
    title: 'Anime Cyber Samurai Duel',
    prompt: 'Epic Makoto Shinkai style anime shot of a cybernetic samurai standing on a skyscraper ledge over neon Tokyo city, sakura petals blowing in evening wind, dramatic sunset sky, 24fps cinematic animation',
    negativePrompt: 'photorealistic, 3d render, low framerate stutter',
    model: 'Pika 2.0',
    style: 'Anime',
    duration: 10,
    fps: 24,
    aspectRatio: '16:9',
    resolution: '1080p',
    cameraMotion: 'Pan Up to Sky',
    seed: 1289430,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    tags: ['Anime', 'Samurai', 'Cinematic', '24fps'],
    createdAt: '3 days ago',
    likes: 4500,
    views: 29000,
    creator: {
      name: 'TokyoAnimeX',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
    }
  }
];

export const STYLE_PRESETS = [
  { id: 'cinematic', name: 'Cinematic Movie', icon: 'Film', promptSuffix: 'cinematic 35mm film shot, anamorphic lens flare, depth of field, color graded' },
  { id: 'cyberpunk', name: 'Cyberpunk', icon: 'Zap', promptSuffix: 'neon cybernetic lights, rain reflections, high tech dark aesthetic, holographic overlays' },
  { id: 'photoreal', name: 'Hyper-Realistic', icon: 'Camera', promptSuffix: '8k photorealistic resolution, Unreal Engine 5 render, raytraced shadows, hyper detailed textures' },
  { id: 'anime', name: 'Anime Masterpiece', icon: 'Sparkles', promptSuffix: 'hand-drawn anime style, vibrant Studio Ghibli colors, key visual art, expressive atmospheric lighting' },
  { id: '3d-render', name: '3D Pixar Animation', icon: 'Box', promptSuffix: '3D stylized render, smooth volumetric lighting, octane render, vivid character design' },
  { id: 'drone', name: 'Drone Aerial', icon: 'Wind', promptSuffix: 'birds-eye view aerial drone footage, sweeping horizon, majestic landscape composition' },
  { id: 'retro', name: 'Vintage 16mm', icon: 'Tv', promptSuffix: '16mm vintage film grain, warm nostalgic tones, subtle chromatic aberration, retro aesthetic' },
];

export const CAMERA_MOTIONS = [
  { id: 'pan-right', label: 'Pan Right', desc: 'Smooth horizontal right tracking' },
  { id: 'pan-left', label: 'Pan Left', desc: 'Smooth horizontal left tracking' },
  { id: 'zoom-in', label: 'Zoom In', desc: 'Dynamic push towards center subject' },
  { id: 'zoom-out', label: 'Zoom Out', desc: 'Pull back revealing surrounding scene' },
  { id: 'orbit', label: 'Orbit 360°', desc: 'Circular camera rotation around focus' },
  { id: 'fpv-drone', label: 'FPV Fly-Through', desc: 'High speed acrobatic aerial motion' },
  { id: 'crane-up', label: 'Crane Up', desc: 'Vertical elevation camera lift' },
];

export const AI_MODELS = [
  { id: 'HunyuanVideo SOTA', name: 'Hunyuan SOTA', provider: 'Tencent Open-Source', speed: '12s (Fast)', quality: 'SOTA 1080p', cost: '~$0.05' },
  { id: 'Wan2.1', name: 'Wan2.1', provider: 'Alibaba Open-Source', speed: '10s (Fast)', quality: 'Cinematic Motion', cost: '~$0.05' },
  { id: 'Kling 1.5 Pro', name: 'Kling 1.5 Pro', provider: 'Kuaishou AI', speed: '15s', quality: 'Facial Emotion & Realism', cost: '~$0.12' },
  { id: 'Luma Ray 2', name: 'Dream Machine', provider: 'Luma AI', speed: '18s', quality: 'Photoreal Physics', cost: '~$0.18' },
  { id: 'LTX-Video', name: 'LTX-Video', provider: 'Lightricks Open-Source', speed: '4s (Ultra Fast)', quality: 'Budget Fast Draft', cost: '~$0.02' },
  { id: 'Sora v2 Pro', name: 'Sora v2 Pro', provider: 'OpenAI', speed: '15s', quality: 'Ultra 8K Multi-Shot', cost: '~$0.20' },
];
