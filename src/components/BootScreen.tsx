import { useEffect, useState } from 'react';

interface BootScreenProps {
  onComplete: () => void;
}

export function BootScreen({ onComplete }: BootScreenProps) {
  const [progress, setProgress] = useState(0);
  const [showLogo, setShowLogo] = useState(true);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        setShowLogo(false);
        setTimeout(onComplete, 500);
      }, 500);
    }
  }, [progress, onComplete]);

  return (
    <div 
      className={`fixed inset-0 bg-gradient-to-b from-[#0078D4] to-[#005a9e] flex flex-col items-center justify-center z-[9999] transition-opacity duration-500 ${
        !showLogo ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Windows-style loading spinner */}
      <div className="relative w-20 h-20 mb-12">
        <div className="absolute inset-0 rounded-full border-4 border-primary-foreground/20" />
        <div 
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-foreground animate-boot-spin"
          style={{ animationDuration: '1.2s' }}
        />
      </div>

      {/* Name and title */}
      <h1 className="text-4xl md:text-5xl font-light text-primary-foreground mb-2 tracking-wide">
        Kiseko Joseph Musyoka
      </h1>
      <p className="text-lg text-primary-foreground/80 mb-8 font-light">
        Computer Science Portfolio
      </p>

      {/* Loading bar */}
      <div className="w-64 h-1 bg-primary-foreground/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary-foreground transition-all duration-300 ease-out rounded-full"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <p className="mt-4 text-primary-foreground/60 text-sm">
        Loading portfolio...
      </p>
    </div>
  );
}
