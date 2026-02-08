import { useEffect, useState } from 'react';

interface BootScreenProps {
  onComplete: () => void;
}

export function BootScreen({ onComplete }: BootScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'logo' | 'loading' | 'fadeout'>('logo');
  const [loadingDots, setLoadingDots] = useState('');

  // Loading dots animation
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setLoadingDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(dotsInterval);
  }, []);

  // Progress bar - Extended to ~10 seconds
  useEffect(() => {
    if (phase !== 'loading') return;
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Slower progress for ~10 second boot time
        const increment = prev < 20 ? Math.random() * 3 + 1 :
                         prev < 50 ? Math.random() * 2 + 0.5 :
                         prev < 80 ? Math.random() * 1.5 + 0.3 :
                         Math.random() * 1 + 0.2;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [phase]);

  // Phase transitions
  useEffect(() => {
    // Start with logo, then transition to loading after 2 seconds
    const logoTimer = setTimeout(() => {
      setPhase('loading');
    }, 2000);

    return () => clearTimeout(logoTimer);
  }, []);

  useEffect(() => {
    if (progress >= 100 && phase === 'loading') {
      setTimeout(() => {
        setPhase('fadeout');
        setTimeout(onComplete, 800);
      }, 500);
    }
  }, [progress, phase, onComplete]);

  return (
    <div 
      className={`fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999] transition-opacity duration-800 ${
        phase === 'fadeout' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Windows XP Logo */}
      <div className={`transition-all duration-700 ${phase === 'logo' ? 'scale-100 opacity-100' : 'scale-95 opacity-90'}`}>
        {/* Windows XP Flag Logo */}
        <div className="relative mb-8">
          <svg width="120" height="120" viewBox="0 0 100 100" className="drop-shadow-2xl">
            {/* Red pane (top-left) */}
            <path 
              d="M5 5 L45 10 L45 45 L5 45 Z" 
              fill="#F25022"
              className="animate-pulse"
              style={{ animationDelay: '0ms', animationDuration: '2s' }}
            />
            {/* Green pane (top-right) */}
            <path 
              d="M50 10 L95 5 L95 45 L50 45 Z" 
              fill="#7FBA00"
              className="animate-pulse"
              style={{ animationDelay: '150ms', animationDuration: '2s' }}
            />
            {/* Blue pane (bottom-left) */}
            <path 
              d="M5 50 L45 50 L45 90 L5 95 Z" 
              fill="#00A4EF"
              className="animate-pulse"
              style={{ animationDelay: '300ms', animationDuration: '2s' }}
            />
            {/* Yellow pane (bottom-right) */}
            <path 
              d="M50 50 L95 50 L95 95 L50 90 Z" 
              fill="#FFB900"
              className="animate-pulse"
              style={{ animationDelay: '450ms', animationDuration: '2s' }}
            />
          </svg>
        </div>
        
        {/* JMK Portfolio Text */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2">
            <span className="text-white text-3xl font-light tracking-wider">JMK</span>
            <span className="text-white text-3xl font-bold italic text-[#F25022]">Portfolio</span>
          </div>
          <span className="text-white/60 text-sm tracking-[0.3em] uppercase mt-1 block">Professional</span>
        </div>
      </div>

      {/* Loading indicator */}
      {phase === 'loading' && (
        <div className="animate-fade-in">
          {/* XP-style progress blocks */}
          <div className="flex gap-1 mb-6">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className="w-3 h-3 bg-[#00A4EF] rounded-sm"
                style={{
                  animation: 'xpBlock 1.5s ease-in-out infinite',
                  animationDelay: `${i * 200}ms`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Loading text with dots */}
      {phase === 'loading' && (
        <div className="text-white/60 text-sm animate-fade-in">
          <span>OPENING PORTFOLIO{loadingDots}</span>
        </div>
      )}

      {/* Progress bar - XP style */}
      {phase === 'loading' && (
        <div className="absolute bottom-24 w-64">
          <div className="h-4 bg-[#1a1a2e] rounded border border-[#3a3a5a] overflow-hidden shadow-inner">
            <div className="h-full flex gap-0.5 p-0.5">
              {[...Array(Math.floor(progress / 4))].map((_, i) => (
                <div 
                  key={i}
                  className="h-full w-2 bg-gradient-to-b from-[#00A4EF] to-[#0078D4] rounded-sm"
                  style={{ animationDelay: `${i * 50}ms` }}
                />
              ))}
            </div>
          </div>
          <div className="text-center text-white/40 text-xs mt-2">
            {Math.floor(progress)}%
          </div>
        </div>
      )}

      {/* Branding */}
      <div className="absolute bottom-8 text-center text-white/30 text-xs">
        <p className="font-medium">Joseph Musyoka Portfolio</p>
        <p className="text-[10px] mt-1 opacity-60">Copyright © Microsoft Corporation</p>
      </div>

      <style>{`
        @keyframes xpBlock {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
