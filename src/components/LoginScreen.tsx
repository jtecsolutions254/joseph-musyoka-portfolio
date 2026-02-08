import { useState, useEffect } from 'react';
import { User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = () => {
    setIsLoggingIn(true);
    // Simulate login animation
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div 
      className={`fixed inset-0 z-[9998] transition-all duration-700 ${
        isLoggingIn ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background with blur effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'linear-gradient(135deg, hsl(206 100% 35%) 0%, hsl(220 60% 20%) 50%, hsl(280 60% 25%) 100%)'
        }}
      />
      <div className="absolute inset-0 backdrop-blur-sm bg-background/10" />

      {/* Lock screen content */}
      <div className="relative h-full flex flex-col items-center justify-center text-primary-foreground">
        {/* Time and Date - Top Center */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 text-center animate-fade-up">
          <div className="text-7xl md:text-8xl font-light tracking-tight drop-shadow-lg">
            {formatTime(currentTime)}
          </div>
          <div className="text-xl md:text-2xl font-light mt-2 opacity-90 drop-shadow-md">
            {formatDate(currentTime)}
          </div>
        </div>

        {/* User Profile */}
        <div className="flex flex-col items-center animate-scale-in">
          {/* Profile Picture */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center mb-6 shadow-2xl border-4 border-primary-foreground/20 backdrop-blur-sm">
            <span className="text-5xl md:text-6xl font-semibold text-primary-foreground">KJ</span>
          </div>

          {/* Name */}
          <h1 className="text-2xl md:text-3xl font-medium mb-8 drop-shadow-lg">
            Kiseko Joseph Musyoka
          </h1>

          {/* Password Input */}
          <div className="relative w-72 md:w-80 group">
            <div className="absolute inset-0 bg-primary-foreground/20 rounded-full backdrop-blur-xl border border-primary-foreground/30" />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password (just press enter)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="relative w-full h-12 bg-transparent border-0 text-primary-foreground placeholder:text-primary-foreground/50 pr-20 pl-5 rounded-full focus-visible:ring-2 focus-visible:ring-primary-foreground/50 focus-visible:ring-offset-0"
              autoFocus
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary-foreground/20 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-primary-foreground/70" />
                ) : (
                  <Eye className="w-5 h-5 text-primary-foreground/70" />
                )}
              </button>
              <button
                onClick={handleLogin}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors"
              >
                <ArrowRight className="w-5 h-5 text-primary-foreground" />
              </button>
            </div>
          </div>

          {/* Sign-in options */}
          <div className="mt-6 flex flex-col items-center gap-2">
            <button className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              Sign-in options
            </button>
          </div>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-between items-end px-8">
          {/* Network/Accessibility icons */}
          <div className="flex gap-4">
            <button className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors backdrop-blur-sm">
              <User className="w-5 h-5 text-primary-foreground/80" />
            </button>
          </div>

          {/* Power/Accessibility */}
          <div className="text-right">
            <p className="text-xs text-primary-foreground/50">Computer Science Portfolio</p>
            <p className="text-xs text-primary-foreground/50">University of Embu</p>
          </div>
        </div>
      </div>
    </div>
  );
}
