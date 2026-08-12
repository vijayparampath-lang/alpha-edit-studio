import React, { useState, useRef, useEffect } from 'react';
import { Play, AlertCircle, Loader2, Volume2, VolumeX, RotateCcw, ExternalLink, Youtube, Instagram, Facebook, Tv, Video, Globe } from 'lucide-react';

interface PortfolioVideoPlayerProps {
  videoUrl: string;
  videoPlatform?: string;
  posterUrl?: string;
  title?: string;
}

export function parseVideoInfo(videoUrl: string, explicitPlatform?: string) {
  if (!videoUrl) return { isEmbed: false, platform: 'Custom URL', embedUrl: '', directUrl: '' };

  const url = videoUrl.trim();
  const lowerUrl = url.toLowerCase();

  // Determine platform
  let platform = explicitPlatform && explicitPlatform !== 'Auto Detect' ? explicitPlatform : '';

  if (!platform) {
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
      platform = 'YouTube';
    } else if (lowerUrl.includes('vimeo.com')) {
      platform = 'Vimeo';
    } else if (lowerUrl.includes('drive.google.com')) {
      platform = 'Google Drive';
    } else if (lowerUrl.includes('instagram.com') || lowerUrl.includes('instagr.am')) {
      platform = 'Instagram Reel';
    } else if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.watch')) {
      platform = 'Facebook Video';
    } else if (lowerUrl.includes('tiktok.com')) {
      platform = 'TikTok';
    } else {
      platform = 'Custom URL';
    }
  }

  // Parse embed URLs per platform
  if (platform === 'YouTube' || lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return {
        isEmbed: true,
        platform: 'YouTube',
        embedUrl: `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`,
        directUrl: url
      };
    }
  }

  if (platform === 'Vimeo' || lowerUrl.includes('vimeo.com')) {
    const regExp = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/;
    const match = url.match(regExp);
    if (match && match[3]) {
      return {
        isEmbed: true,
        platform: 'Vimeo',
        embedUrl: `https://player.vimeo.com/video/${match[3]}?autoplay=1&title=0&byline=0`,
        directUrl: url
      };
    }
  }

  if (platform === 'Google Drive' || lowerUrl.includes('drive.google.com')) {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return {
        isEmbed: true,
        platform: 'Google Drive',
        embedUrl: `https://drive.google.com/file/d/${match[1]}/preview`,
        directUrl: url
      };
    }
  }

  if (platform === 'Instagram Reel' || lowerUrl.includes('instagram.com') || lowerUrl.includes('instagr.am')) {
    const match = url.match(/\/(reel|p|reels)\/([a-zA-Z0-9_-]+)/);
    if (match && match[2]) {
      return {
        isEmbed: true,
        platform: 'Instagram Reel',
        embedUrl: `https://www.instagram.com/reel/${match[2]}/embed`,
        directUrl: url
      };
    }
  }

  if (platform === 'Facebook Video' || lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.watch')) {
    return {
      isEmbed: true,
      platform: 'Facebook Video',
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=true`,
      directUrl: url
    };
  }

  if (platform === 'TikTok' || lowerUrl.includes('tiktok.com')) {
    const match = url.match(/\/video\/(\d+)/);
    if (match && match[1]) {
      return {
        isEmbed: true,
        platform: 'TikTok',
        embedUrl: `https://www.tiktok.com/embed/v2/${match[1]}`,
        directUrl: url
      };
    }
  }

  // Native / Direct video file check
  const cleanPath = lowerUrl.split('?')[0];
  const isDirectVideo = cleanPath.endsWith('.mp4') || cleanPath.endsWith('.webm') || cleanPath.endsWith('.mov') || url.startsWith('data:video/') || url.startsWith('blob:') || url.startsWith('db-media://');

  if (isDirectVideo) {
    return {
      isEmbed: false,
      platform: platform || 'Custom URL',
      embedUrl: url,
      directUrl: url
    };
  }

  // Fallback iframe for external video URLs
  return {
    isEmbed: true,
    platform: platform || 'Custom URL',
    embedUrl: url,
    directUrl: url
  };
}

export default function PortfolioVideoPlayer({ videoUrl, videoPlatform, posterUrl, title }: PortfolioVideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const parsed = parseVideoInfo(videoUrl, videoPlatform);

  // Restart video states on URL or Platform change
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [videoUrl, videoPlatform]);

  const handlePlayToggle = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Video play failed:", err);
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play()
              .then(() => setIsPlaying(true))
              .catch(() => setHasError(true));
          }
        });
    }
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    setHasError(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const renderPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'YouTube':
        return <Youtube className="w-3.5 h-3.5 text-red-500" />;
      case 'Instagram Reel':
        return <Instagram className="w-3.5 h-3.5 text-pink-500" />;
      case 'Facebook Video':
        return <Facebook className="w-3.5 h-3.5 text-blue-500" />;
      case 'TikTok':
        return <Tv className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Vimeo':
        return <Video className="w-3.5 h-3.5 text-sky-400" />;
      case 'Google Drive':
        return <ExternalLink className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Globe className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  // 1. EMBEDDED IFRAME PLAYER (YouTube, Vimeo, Google Drive, Reel, TikTok, FB, etc.)
  if (parsed.isEmbed && parsed.embedUrl) {
    return (
      <div id="video-container" className="relative w-full h-full bg-black flex items-center justify-center group overflow-hidden rounded-xl">
        {/* Platform Badge */}
        <div className="absolute top-3 left-3 z-20 flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-amber-500/30 text-[10px] font-mono tracking-wider font-bold text-amber-400">
          {renderPlatformIcon(parsed.platform)}
          <span>{parsed.platform}</span>
        </div>

        {/* Watch on platform direct action button */}
        <a
          href={parsed.directUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-3 right-3 z-20 flex items-center space-x-1 px-3 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-mono tracking-wider font-bold transition-all hover:scale-105"
        >
          <span>Open Link</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        {/* Iframe */}
        <iframe
          src={parsed.embedUrl}
          title={title || `${parsed.platform} Video Stream`}
          className="w-full h-full border-0 rounded-xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />

        {/* Loading Spinner */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center space-y-3 z-10 pointer-events-none">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">Loading {parsed.platform} stream...</span>
          </div>
        )}
      </div>
    );
  }

  // 2. NATIVE HTML5 VIDEO PLAYER (MP4, WebM, Local File)
  const isWebM = videoUrl.toLowerCase().includes('.webm');
  const isMp4 = !isWebM;

  return (
    <div id="video-container" className="relative w-full h-full bg-black flex items-center justify-center group overflow-hidden rounded-xl">
      {/* Platform Badge */}
      <div className="absolute top-3 left-3 z-20 flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-amber-500/30 text-[10px] font-mono tracking-wider font-bold text-amber-400">
        {renderPlatformIcon(parsed.platform)}
        <span>{parsed.platform}</span>
      </div>

      <video
        ref={videoRef}
        className="w-full h-full object-contain cursor-pointer"
        poster={posterUrl || undefined}
        preload="metadata"
        playsInline
        controls={isPlaying && !hasError}
        onLoadStart={() => {
          setIsLoading(true);
          setHasError(false);
        }}
        onCanPlay={() => {
          setIsLoading(false);
        }}
        onWaiting={() => {
          setIsLoading(true);
        }}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
        }}
        onPause={() => {
          setIsPlaying(false);
        }}
        onEnded={() => {
          setIsPlaying(false);
        }}
        onError={(e) => {
          console.error("Video player native error:", e);
          setIsLoading(false);
          setHasError(true);
        }}
        onClick={handlePlayToggle}
      >
        {isMp4 && <source src={videoUrl} type="video/mp4" />}
        {isWebM && <source src={videoUrl} type="video/webm" />}
        <source src={videoUrl} />
        Your browser does not support the video tag.
      </video>

      {/* Loading Overlay spinner */}
      {isLoading && !hasError && (
        <div id="video-loading" className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center space-y-3 pointer-events-none z-10">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">Loading cinematic stream...</span>
        </div>
      )}

      {/* Error Fallback Panel */}
      {hasError && (
        <div id="video-error" className="absolute inset-0 bg-gray-950 flex flex-col items-center justify-center p-6 text-center z-20">
          <AlertCircle className="w-10 h-10 text-amber-500 mb-3 animate-pulse" />
          <h4 className="text-white font-bold text-sm tracking-wide">Failed to decode visual media</h4>
          <p className="text-gray-500 text-xs mt-1.5 max-w-sm">
            The video at this URL is currently offline, protected, or uses an unsupported encoding profile.
          </p>
          <div className="flex items-center space-x-3 mt-4">
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl text-xs font-mono text-gray-300 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Load</span>
            </button>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs font-mono flex items-center space-x-1.5 transition-all"
            >
              <span>Open Link</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Start Play Overlay when paused and not loading/errored */}
      {!isPlaying && !isLoading && !hasError && (
        <div 
          onClick={handlePlayToggle}
          className="absolute inset-0 bg-black/35 group-hover:bg-black/50 transition-colors flex items-center justify-center cursor-pointer z-10"
        >
          <div className="p-4 rounded-full bg-amber-500 hover:bg-amber-400 hover:scale-110 text-black shadow-2xl transition-all duration-300 flex items-center justify-center">
            <Play className="w-6 h-6 fill-black ml-0.5" />
          </div>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-black/90 px-3 py-1 rounded-full border border-amber-500/30 pointer-events-none">
            Click to Play Project Showcase
          </span>
        </div>
      )}

      {/* Helper mute button */}
      {isPlaying && !hasError && (
        <button
          onClick={handleMuteToggle}
          className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer border border-gray-800"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
        </button>
      )}
    </div>
  );
}
