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

  // Progress bar
  useEffect(() => {
    if (phase !== 'loading') return;
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Variable speed for realism
        const increment = prev < 30 ? Math.random() * 15 + 8 :
                         prev < 70 ? Math.random() * 10 + 3 :
                         Math.random() * 5 + 2;
        return Math.min(prev + increment, 100);
      });
    }, 150);

    return () => clearInterval(progressInterval);
  }, [phase]);

  // Phase transitions
  useEffect(() => {
    // Start with logo, then transition to loading
    const logoTimer = setTimeout(() => {
      setPhase('loading');
    }, 1500);

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
      {/* Windows-style logo */}
      <div className={`transition-all duration-700 ${phase === 'logo' ? 'scale-100 opacity-100' : 'scale-95 opacity-80'}`}>
        {/* Animated Windows logo */}
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 grid grid-cols-2 gap-1.5">
            <div 
              className="bg-[#F25022] rounded-sm animate-pulse" 
              style={{ animationDelay: '0ms' }}
            />
            <div 
              className="bg-[#7FBA00] rounded-sm animate-pulse" 
              style={{ animationDelay: '100ms' }}
            />
            <div 
              className="bg-[#00A4EF] rounded-sm animate-pulse" 
              style={{ animationDelay: '200ms' }}
            />
            <div 
              className="bg-[#FFB900] rounded-sm animate-pulse" 
              style={{ animationDelay: '300ms' }}
            />
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {phase === 'loading' && (
        <div className="animate-fade-in">
          {/* Circular spinner */}
          <div className="relative w-12 h-12 mb-8">
            <div className="absolute inset-0 rounded-full border-2 border-white/10" />
            <div 
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-white animate-boot-spin"
              style={{ animationDuration: '1s' }}
            />
          </div>
        </div>
      )}

      {/* Loading text with dots */}
      {phase === 'loading' && (
        <div className="text-white/60 text-sm animate-fade-in">
          <span>Loading{loadingDots}</span>
        </div>
      )}

      {/* Progress indicator - subtle bottom bar */}
      {phase === 'loading' && (
        <div className="absolute bottom-20 w-48">
          <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white/50 transition-all duration-200 rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Branding */}
      <div className="absolute bottom-8 text-center text-white/30 text-xs">
        <p>KJM Portfolio OS</p>
      </div>
    </div>
  );
}
