import { useCallback, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextPressure } from '../components/ui/TextPressure';
import { ZoomParallax } from '../components/ui/ZoomParallax';

const SYSTEM_FONT = 'system-ui, sans-serif';

const VIDEOS = [
  {
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081127_0992a171-d3c6-4978-8213-0ec5df8b6d63.mp4',
    label: 'Pulse Line',
  },
  {
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_092026_dd05b805-ea0f-40b2-8c52-332b88502592.mp4',
    label: 'Bloom Line',
  },
  {
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081042_df7202bf-bd80-4b2b-bbc6-1f09ba2870e9.mp4',
    label: 'Nova Line',
  },
  {
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_080959_4cac5234-3573-464e-a5b7-76b94b8a7d61.mp4',
    label: 'Current Line',
  },
];

const STATS = [
  '18 Living Stations',
  '4 Metro Lines',
  '2.4M+ Contributions Blended',
  'AI-Woven, Rider-Made',
];

const OVERLAY_PNG =
  'https://soft-zoom-63098134.figma.site/_assets/v11/0b4a435b2df2747593c43d7a1c9b4578f7d8d90c.png';

const PARALLAX_IMAGES = [
  {
    src: '/Parallax Images/xlr680n42ec21.jpg',
    alt: 'Transit grid concept',
  },
  {
    src: '/Parallax Images/Screenshot 2026-07-14 193402.png',
    alt: 'System matrix scan 1',
  },
  {
    src: '/Parallax Images/Screenshot 2026-07-14 193412.png',
    alt: 'System matrix scan 2',
  },
  {
    src: '/Parallax Images/Screenshot 2026-07-14 193422.png',
    alt: 'System matrix scan 3',
  },
  {
    src: '/Parallax Images/Screenshot 2026-07-14 193433.png',
    alt: 'System matrix scan 4',
  },
  {
    src: '/Parallax Images/Screenshot 2026-07-14 193449.png',
    alt: 'System matrix scan 5',
  },
  {
    src: '/Parallax Images/Screenshot 2026-07-14 193502.png',
    alt: 'System matrix scan 6',
  },
];

interface VideoPlayerProps {
  url: string;
  isActive: boolean;
}

function VideoPlayer({ url, isActive }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch((err) => {
          console.debug('Video autoplay blocked or delayed:', err);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive]);

  return (
    <video
      ref={videoRef}
      src={url}
      loop
      muted
      playsInline
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
        isActive ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [activeVideo, setActiveVideo] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isDark = activeVideo === 2;
  const heroTextColor = isDark ? 'text-[#182C41]' : 'text-white';

  const handleVideoSwitch = useCallback(
    (index: number) => {
      if (index === activeVideo || isTransitioning) return;
      setActiveVideo(index);
      setIsTransitioning(true);
      window.setTimeout(() => setIsTransitioning(false), 1000);
    },
    [activeVideo, isTransitioning],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      navigate(`/signup?email=${encodeURIComponent(email.trim())}`);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-black overflow-x-clip">
      {/* Hero Section */}
      <section className="relative w-full h-screen overflow-hidden bg-black">
        {VIDEOS.map((video, i) => (
          <VideoPlayer
            key={video.url}
            url={video.url}
            isActive={i === activeVideo}
          />
        ))}

        <img
          src={OVERLAY_PNG}
          alt=""
          aria-hidden="true"
          className="animate-train-bob pointer-events-none absolute inset-0 z-[1] h-full w-full select-none object-cover"
        />

        <div className="relative z-[2] flex h-full flex-col items-center justify-center px-6 text-center">
          <div
            className={`liquid-glass mb-6 rounded-full px-4 py-2 transition-colors duration-700 sm:mb-8 ${heroTextColor}`}
          >
            <span className="text-xs sm:text-sm animate-pulse" style={{ fontFamily: SYSTEM_FONT }}>
              The world's first AI-powered living subway network
            </span>
          </div>

          <div className="relative w-full max-w-4xl h-[8vh] md:h-[11vh] flex items-center justify-center overflow-visible">
            <TextPressure
              text="The City Is Your"
              fontFamily="Instrument Serif"
              fontUrl="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
              flex={false}
              width={false}
              weight={false}
              italic={true}
              alpha={false}
              textColor={isDark ? '#182C41' : '#FFFFFF'}
              minFontSize={36}
              minItalic={0}
              maxItalic={0.5}
              uppercase={false}
              className="font-normal"
            />
          </div>
          <div className="relative w-full max-w-4xl h-[8vh] md:h-[11vh] flex items-center justify-center overflow-visible -mt-4 md:-mt-8">
            <TextPressure
              text="Living Canvas"
              fontFamily="Instrument Serif"
              fontUrl="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
              flex={false}
              width={false}
              weight={false}
              italic={true}
              alpha={false}
              textColor={isDark ? '#182C41' : '#FFFFFF'}
              minFontSize={36}
              minItalic={0}
              maxItalic={0.5}
              uppercase={false}
              className="font-normal"
            />
          </div>

          <p
            className={`mt-6 max-w-xl leading-relaxed transition-colors duration-700 ${
              isDark ? 'text-[#182C41]/80' : 'text-white/80'
            }`}
            style={{ fontFamily: SYSTEM_FONT }}
          >
            Vote on themes, paint digital art, compose music, or design light — every
            journey lets you leave a mark. AI blends millions of contributions into
            stations that never look the same twice.
          </p>

          <form
            onSubmit={handleSubmit}
            className="liquid-glass mt-8 flex w-full max-w-[320px] items-center rounded-full p-1.5 sm:max-w-sm"
          >
            <input
              type="email"
              placeholder="Your Best Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`min-w-0 flex-1 bg-transparent px-4 py-2 text-sm outline-none transition-colors duration-700 ${
                isDark ? 'text-[#182C41] placeholder-[#182C41]/60' : 'text-white placeholder-white/60'
              }`}
              style={{ fontFamily: SYSTEM_FONT }}
            />
            <button
              type="submit"
              className="whitespace-nowrap rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-transform hover:scale-105"
              style={{ fontFamily: SYSTEM_FONT }}
            >
              Board the Network
            </button>
          </form>

          <div className="mt-8 flex gap-6 sm:gap-8">
            {VIDEOS.map((video, i) => {
              const isActive = i === activeVideo;
              return (
                <button
                  key={video.label}
                  type="button"
                  onClick={() => handleVideoSwitch(i)}
                  className={`border-b-2 pb-1 text-xs transition-all duration-300 sm:text-sm ${heroTextColor} ${
                    isActive
                      ? `opacity-100 ${isDark ? 'border-[#182C41]' : 'border-white'}`
                      : 'border-transparent opacity-50 hover:opacity-80'
                  }`}
                  style={{ fontFamily: SYSTEM_FONT }}
                >
                  {video.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-[2] flex justify-center px-6 pb-6 sm:pb-8">
          <div
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-xs text-white/70 sm:text-sm"
            style={{ fontFamily: SYSTEM_FONT }}
          >
            {STATS.map((stat, i) => (
              <span key={stat} className="flex items-center gap-3">
                {i !== 0 && <span className="hidden text-white/30 sm:inline">|</span>}
                <span>{stat}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Zoom Parallax Header */}
      <div className="relative w-full bg-black pt-32 pb-16 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-5xl font-['Instrument_Serif'] italic text-white mb-4">
            Scroll down to zoom into the network
          </h2>
          <p className="text-white/60 text-sm max-w-lg mx-auto leading-relaxed" style={{ fontFamily: SYSTEM_FONT }}>
            Experience the dynamic visual transitions as you descend through our schematic grid. Touch each visual node to witness the collaborative digital canvas come alive.
          </p>
        </div>
      </div>

      {/* Zoom Parallax component rendered directly in main flow with no vertical padding boundary constraints */}
      <ZoomParallax images={PARALLAX_IMAGES} />

      <div className="h-[20vh] bg-black" />
    </div>
  );
}
