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

function getRoleStyle(role: Role, isMobile: boolean) {
  switch (role) {
    case 'center':
      return {
        transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
        filter: 'blur(0px)',
        opacity: 1,
        zIndex: 20,
        left: '50%',
        height: isMobile ? '60%' : '92%',
        bottom: isMobile ? '22%' : 0,
      };
    case 'left':
      return {
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
        zIndex: 10,
        left: isMobile ? '20%' : '30%',
        height: isMobile ? '16%' : '28%',
        bottom: isMobile ? '32%' : '12%',
      };
    case 'right':
      return {
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
        zIndex: 10,
        left: isMobile ? '80%' : '70%',
        height: isMobile ? '16%' : '28%',
        bottom: isMobile ? '32%' : '12%',
      };
    case 'back':
      return {
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(4px)',
        opacity: 1,
        zIndex: 5,
        left: '50%',
        height: isMobile ? '13%' : '22%',
        bottom: isMobile ? '32%' : '12%',
      };
  }
}

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`;

export default function ToonHubHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // Preload images on mount
  useEffect(() => {
    IMAGES.forEach((img) => {
      const i = new Image();
      i.src = img.src;
    });
  }, []);

  // Responsive listener
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
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
          height: '100vh',
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
            opacity: 0.4,
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
            top: '18%',
          }}
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(90px, 28vw, 380px)',
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
            top: '1.5rem',
            left: '1rem',
            zIndex: 60,
          }}
          className="sm:left-8"
        >
          <span
            style={{
              fontSize: '0.75rem',
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
            const style = getRoleStyle(role, isMobile);

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  aspectRatio: '0.6 / 1',
                  ...style,
                  transition:
                    'transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1)',
                  willChange: 'transform, filter, opacity',
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
            bottom: '1.5rem',
            left: '1rem',
            zIndex: 60,
            maxWidth: 320,
          }}
          className="sm:bottom-20 sm:left-24"
        >
          <p
            style={{
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              marginBottom: '0.5rem',
              fontSize: '1rem',
              color: 'white',
              opacity: 0.95,
            }}
            className="sm:mb-3 sm:text-[22px]"
          >
            TOONHUB FIGURINES
          </p>

          <p
            style={{
              fontSize: '0.75rem',
              color: 'white',
              opacity: 0.85,
              lineHeight: 1.6,
              marginBottom: '1rem',
              display: isMobile ? 'none' : 'block',
            }}
            className="sm:text-sm sm:mb-5"
          >
            The artwork is stunning, shipped fully prepared. The finish is a
            vision, the 3D craft is flawless. Many thanks! Wishing you the win.
            Order now.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => navigate('prev')}
              style={{
                width: '3rem',
                height: '3rem',
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
              <ArrowLeft size={26} strokeWidth={2.25} color="white" />
            </button>
            <button
              type="button"
              onClick={() => navigate('next')}
              style={{
                width: '3rem',
                height: '3rem',
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
              <ArrowRight size={26} strokeWidth={2.25} color="white" />
            </button>
          </div>
        </div>

        {/* 6. Bottom-right DISCOVER IT */}
        <div
          style={{
            position: 'absolute',
            bottom: '1.5rem',
            right: '1rem',
            zIndex: 60,
          }}
          className="sm:bottom-20 sm:right-10"
        >
          <a
            href="#"
            style={{
              display: 'flex',
              alignItems: 'center',
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(20px, 4vw, 56px)',
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
                width: '1.25rem',
                height: '1.25rem',
                marginLeft: '0.5rem',
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
