import { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const IMAGES = [
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png',
    bg: '#F4845F',
    panel: '#F79B7F',
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png',
    bg: '#6BBF7A',
    panel: '#85CC92',
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png',
    bg: '#E882B4',
    panel: '#ED9DC4',
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png',
    bg: '#6EB5FF',
    panel: '#8DC4FF',
  },
];

type Role = 'center' | 'left' | 'right' | 'back';
type ScreenSize = 'mobile' | 'tablet' | 'desktop';

function getScreenSize(w: number): ScreenSize {
  if (w < 640) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

function getRoleStyle(role: Role, size: ScreenSize) {
  const s = {
    mobile: {
      center: { scale: 1.15, heightPct: 48, bottomPct: 22, leftPct: 50, blur: 0, opacity: 1, z: 20 },
      left:    { scale: 0.7,  heightPct: 14, bottomPct: 32, leftPct: 18, blur: 3, opacity: 0.6, z: 10 },
      right:   { scale: 0.7,  heightPct: 14, bottomPct: 32, leftPct: 82, blur: 3, opacity: 0.6, z: 10 },
      back:    { scale: 0.55, heightPct: 11, bottomPct: 32, leftPct: 50, blur: 5, opacity: 0.4, z: 5 },
    },
    tablet: {
      center: { scale: 1.4,  heightPct: 62, bottomPct: 10, leftPct: 50, blur: 0, opacity: 1, z: 20 },
      left:    { scale: 0.8, heightPct: 22, bottomPct: 18, leftPct: 22, blur: 2, opacity: 0.8, z: 10 },
      right:   { scale: 0.8, heightPct: 22, bottomPct: 18, leftPct: 78, blur: 2, opacity: 0.8, z: 10 },
      back:    { scale: 0.6, heightPct: 16, bottomPct: 18, leftPct: 50, blur: 4, opacity: 0.5, z: 5 },
    },
    desktop: {
      center: { scale: 1.65, heightPct: 86, bottomPct: 0, leftPct: 50, blur: 0, opacity: 1, z: 20 },
      left:    { scale: 0.85, heightPct: 26, bottomPct: 10, leftPct: 28, blur: 2, opacity: 0.85, z: 10 },
      right:   { scale: 0.85, heightPct: 26, bottomPct: 10, leftPct: 72, blur: 2, opacity: 0.85, z: 10 },
      back:    { scale: 0.6,  heightPct: 18, bottomPct: 10, leftPct: 50, blur: 5, opacity: 0.6, z: 5 },
    },
  };

  const v = s[size][role];
  return {
    transform: `translateX(-50%) scale(${v.scale})`,
    filter: `blur(${v.blur}px)`,
    opacity: v.opacity,
    zIndex: v.z,
    left: `${v.leftPct}%`,
    height: `${v.heightPct}%`,
    bottom: `${v.bottomPct}%`,
  };
}

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`;

export default function ToonHubHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [screenSize, setScreenSize] = useState<ScreenSize>(() => getScreenSize(window.innerWidth));

  useEffect(() => {
    IMAGES.forEach((img) => { const i = new Image(); i.src = img.src; });
  }, []);

  useEffect(() => {
    const onResize = () => setScreenSize(getScreenSize(window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const navigate = useCallback(
    (dir: 'next' | 'prev') => {
      if (isAnimating) return;
      setIsAnimating(true);
      setActiveIndex((prev) =>
        dir === 'next' ? (prev + 1) % 4 : (prev + 3) % 4
      );
      setTimeout(() => setIsAnimating(false), 650);
    },
    [isAnimating]
  );

  const roles = useMemo<Record<Role, number>>(() => ({
    center: activeIndex,
    left: (activeIndex + 3) % 4,
    right: (activeIndex + 1) % 4,
    back: (activeIndex + 2) % 4,
  }), [activeIndex]);

  const bgColor = IMAGES[activeIndex].bg;
  const isMobile = screenSize === 'mobile';

  return (
    <div
      style={{
        backgroundColor: bgColor,
        transition: 'background-color 650ms cubic-bezier(0.4,0,0.2,1)',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100dvh',
          overflow: 'hidden',
        }}
      >
        {/* 1. Grain overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 50,
            backgroundImage: GRAIN_SVG,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
            opacity: isMobile ? 0.25 : 0.4,
          }}
        />

        {/* 2. Giant ghost text */}
        <div
          style={{
            position: 'absolute',
            inset: '0 0 auto 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 2,
            top: isMobile ? '8%' : screenSize === 'tablet' ? '10%' : '12%',
          }}
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: isMobile ? 'clamp(48px, 20vw, 90px)' : 'clamp(90px, 28vw, 380px)',
              fontWeight: 900,
              color: 'white',
              opacity: 1,
              lineHeight: 1,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            3D SHAPE
          </span>
        </div>

        {/* 3. Top-left brand */}
        <div
          style={{
            position: 'absolute',
            top: isMobile ? '1rem' : '1.5rem',
            left: isMobile ? '0.75rem' : '2rem',
            zIndex: 60,
          }}
        >
          <span
            style={{
              fontSize: isMobile ? '0.65rem' : '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: 'white',
              opacity: 0.9,
              letterSpacing: '0.18em',
            }}
          >
            TOONHUB
          </span>
        </div>

        {/* 4. Carousel */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 3 }}>
          {IMAGES.map((img, i) => {
            const role = (Object.entries(roles) as [Role, number][]).find(
              ([, idx]) => idx === i
            )![0];
            const style = getRoleStyle(role, screenSize);

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  aspectRatio: '0.56 / 1',
                  ...style,
                  transition:
                    'transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1)',
                  willChange: 'transform, filter, opacity',
                  display: role === 'back' && isMobile ? 'none' : 'block',
                }}
              >
                <img
                  src={img.src}
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'bottom center',
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                  draggable={false}
                />
              </div>
            );
          })}
        </div>

        {/* 5. Bottom-left text + nav */}
        <div
          style={{
            position: 'absolute',
            bottom: isMobile ? '1rem' : '1.5rem',
            left: isMobile ? '0.75rem' : '2rem',
            zIndex: 60,
            maxWidth: isMobile ? 220 : 320,
          }}
        >
          <p
            style={{
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              marginBottom: isMobile ? '0.25rem' : '0.5rem',
              fontSize: isMobile ? '0.8rem' : '1rem',
              color: 'white',
              opacity: 0.95,
            }}
          >
            TOONHUB FIGURINES
          </p>

          <p
            style={{
              fontSize: isMobile ? '0.65rem' : '0.75rem',
              color: 'white',
              opacity: 0.85,
              lineHeight: 1.6,
              marginBottom: isMobile ? '0.5rem' : '1rem',
            }}
          >
            {isMobile
              ? 'Stunning 3D artwork, shipped ready. Order now.'
              : 'The artwork is stunning, shipped fully prepared. The finish is a vision, the 3D craft is flawless. Many thanks! Wishing you the win. Order now.'}
          </p>

          <div style={{ display: 'flex', gap: isMobile ? '0.5rem' : '0.75rem' }}>
            <button
              type="button"
              onClick={() => navigate('prev')}
              style={{
                width: isMobile ? '2.5rem' : '3rem',
                height: isMobile ? '2.5rem' : '3rem',
                backgroundColor: 'transparent',
                border: '2px solid white',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 150ms, background-color 150ms',
              }}
              className="sm:w-16 sm:h-16 hover:scale-[1.08] hover:bg-white/12"
            >
              <ArrowLeft size={isMobile ? 20 : 26} strokeWidth={2.25} color="white" />
            </button>
            <button
              type="button"
              onClick={() => navigate('next')}
              style={{
                width: isMobile ? '2.5rem' : '3rem',
                height: isMobile ? '2.5rem' : '3rem',
                backgroundColor: 'transparent',
                border: '2px solid white',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 150ms, background-color 150ms',
              }}
              className="sm:w-16 sm:h-16 hover:scale-[1.08] hover:bg-white/12"
            >
              <ArrowRight size={isMobile ? 20 : 26} strokeWidth={2.25} color="white" />
            </button>
          </div>
        </div>

        {/* 6. Bottom-right DISCOVER IT */}
        <div
          style={{
            position: 'absolute',
            bottom: isMobile ? '1rem' : '1.5rem',
            right: isMobile ? '0.75rem' : '2.5rem',
            zIndex: 60,
          }}
        >
          <a
            href="#"
            style={{
              display: 'flex',
              alignItems: 'center',
              fontFamily: "'Anton', sans-serif",
              fontSize: isMobile ? 'clamp(14px, 4.5vw, 20px)' : 'clamp(20px, 4vw, 56px)',
              fontWeight: 400,
              color: 'white',
              opacity: 0.95,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'opacity 200ms',
            }}
            className="hover:opacity-100"
          >
            DISCOVER IT
            <ArrowRight
              style={{
                width: isMobile ? '0.85rem' : '1.25rem',
                height: isMobile ? '0.85rem' : '1.25rem',
                marginLeft: isMobile ? '0.3rem' : '0.5rem',
              }}
              className="sm:w-8 sm:h-8"
              strokeWidth={2.25}
              color="white"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
